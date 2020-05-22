const express = require('express');
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');
const { ImageAnnotatorClient } = require('@google-cloud/vision');


const app = express();

app.use(cors())
app.use(logger('dev'));
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/**
Serve static files from the React app
*/
app.use(express.static(path.join(__dirname, 'client/build')));


require('dotenv').config();

const port = process.env.PORT || 9000;

const uploadPath = path.join(__dirname, 'uploads');

/**
create the upload folder if it doesn't exist
*/
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

/**
configure multer to use the uploads folder
*/
const upload = multer({ dest: 'uploads/' });

/**
Google cloud configs
*/
const storage = new Storage({
    keyFilename: 'google-credentials.json'
});

const bucketName = 'handwriting-recognition-221';
const bucket = storage.bucket(bucketName);

const firestore = new Firestore({
    keyFilename: 'google-credentials.json'
});

const collection = firestore.collection('handwriting-recognition-221')

const visionClient = new ImageAnnotatorClient({
    keyFilename: 'google-credentials.json'
});

/**
API calls
*/
app.get('/api/contents', async (req, res, next) => {
    try {
        const contents = [];
        const snapshot = await collection.get();

        snapshot.forEach((doc) => {
            let data = doc.data()
            data.id = doc.id
            contents.push(data)
        });

        res.status(200).json({ contents });
    } catch (err) {
        next(err)
    }
});

app.post('/api/contents', upload.single('document'), async (req, res, next) => {
    if (!req.file) {
        const err = new Error('File not found')
        return next(err);
    }

    /**
    get the file path uploaded via multer
    */
    const filePath = req.file.path;

    const response = await visionClient.textDetection(filePath)
    const detections = response[0].textAnnotations;
    const description = detections[0].description;

    bucket.upload(filePath, (err, file, apiResponse) => {
        if (err) {
            return next(err);
        }
        file.makePublic()

        let contents = {
            mediaLink: apiResponse.mediaLink,
            description
        }

        let docRef = collection.doc(apiResponse.name)
        docRef.set(contents)

        res.status(200).json({ contents: [contents] })
    })
})

/**
catch 404 and forward to error handler
*/
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
The "catchall" handler: for any request that doesn't
match one above, send back React's index.html file.
*/
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + 'client/build/index.html'));
});

/**
error handler
*/
app.use(function (err, req, res, next) {
    console.error(err)
    /**
    set locals, only providing error in development
    */
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    /**
    render the error page
    */
    res.status(err.status || 500);
    res.json({ error: err })
});

app.listen(port, function () {
    console.log(`Example app listening on port: ${port}`);
});
