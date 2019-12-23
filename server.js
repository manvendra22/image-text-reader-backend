const express = require('express');
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
// const { Datastore } = require('@google-cloud/datastore');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');


const app = express();

app.use(cors())
app.use(logger('dev'));
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


require('dotenv').config();

const port = process.env.PORT || 9000;

const uploadPath = path.join(__dirname, 'uploads');

// create the upload folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// configure multer to use the uploads folder
const upload = multer({ dest: 'uploads/' });




const storage = new Storage();

const bucketName = 'handwriting-recognition-221';
const bucket = storage.bucket(bucketName);



// const datastore = new Datastore();



const visionClient = new ImageAnnotatorClient();




const Schema = mongoose.Schema;

let ImageSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, max: 100 },
});

let ImageModal = mongoose.model('Image', ImageSchema);

const uri = `mongodb+srv://canvas:<${process.env.DB_PASSWORD}>@cluster0-ovurt.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(uri);

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// const client = new MongoClient(uri, { useNewUrlParser: true });

// let collection = null

// client.connect(err => {
//     collection = client.db("handwriting-recognition").collection("data");
//     // console.log("collection ", collection)
//     // client.close();
// });





// API calls

app.get('/api/contents', (req, res) => {
    res.json({ express: 'Hello From Express' });
});

app.post('/api/contents', upload.single('document'), async (req, res) => {
    if (!req.file) {
        throw new Error('File not found')
    }

    // get the file path uploaded via multer
    const filePath = req.file.path;

    visionClient
        .textDetection(filePath)
        .then(response => {
            const detections = response[0].textAnnotations;
            const description = detections[0].description;

            bucket.upload(filePath, function (err, file, apiResponse) {
                if (err) {
                    throw new Error(err)
                }
                // console.log("apiResponse ", apiResponse)

                let image = new ImageModal(
                    {
                        _id: apiResponse.id,
                        mediaLink: apiResponse.mediaLink
                    }
                );

                image.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                })
            })
        })
        .catch(err => {
            console.error(err);
            throw new Error(err)
        });
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err)
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ error: err })
});

app.listen(port, function () {
    console.log(`Example app listening on port: ${port}`);
});
