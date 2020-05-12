const express = require('express');
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
const { Storage } = require('@google-cloud/storage');
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


const storage = new Storage({
    keyFilename: 'google-credentials.json'
});

const bucketName = 'handwriting-recognition-221';
const bucket = storage.bucket(bucketName);

const visionClient = new ImageAnnotatorClient({
    keyFilename: 'google-credentials.json'
});

const Schema = mongoose.Schema;

let ImageSchema = new Schema({
    _id: { type: String, required: true },
    mediaLink: { type: String, required: true, max: 100 },
    description: { type: String, required: true },
});

let ImageModal = mongoose.model('Image', ImageSchema, 'images-data');

const uri = `mongodb+srv://canvas:${process.env.DB_PASSWORD}@cluster0-ovurt.mongodb.net/handwriting-recognition?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', err => {
    console.error(`MongoDB connection error: ${err}`);
});

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

// let collection = null

// client.connect(err => {
//     collection = client.db("handwriting-recognition").collection("data");
//     // console.log("collection ", collection)
//     // client.close();
// });


/**
API calls
*/
app.get('/api/contents', async (req, res) => {
    let contents = await ImageModal.find({});

    res.status(200).json({ contents });
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

    visionClient
        .textDetection(filePath)
        .then(response => {
            const detections = response[0].textAnnotations;
            const description = detections[0].description;

            bucket.upload(filePath, async (err, file, apiResponse) => {
                if (err) {
                    return next(err);
                }

                await file.makePublic()

                let image = new ImageModal(
                    {
                        _id: apiResponse.id,
                        mediaLink: apiResponse.mediaLink,
                        description
                    }
                );

                image.save(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).json({
                        result
                    })
                })
            })
        })
        .catch(err => {
            next(err)
        });
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
