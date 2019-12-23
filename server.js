const express = require('express');
const fs = require('fs');
const path = require('path');
// const util = require('util');
const multer = require('multer');
const logger = require('morgan');
const bodyParser = require('body-parser');
const vision = require('@google-cloud/vision');

require('dotenv').config();

// Creates a client
// process.env.SERVICE_ACCOUNT_JSON
const visionClient = new vision.ImageAnnotatorClient();

const port = process.env.PORT || 9000;

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const uploadPath = path.join(__dirname, 'uploads');

// create the upload folder if it doesn't exist
// if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath);
// }

// configure multer to use the uploads folder
const upload = multer({ dest: 'uploads/' });

// API calls
app.get('/api/contents', (req, res) => {
    res.json({ express: 'Hello From Express' });
});

app.post('/api/contents', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('File not found')
        }

        // get the file path uploaded via multer
        const filePath = req.file.path;

        const [result] = await visionClient.textDetection(filePath);
        const detections = result.textAnnotations;
        const description = detections[0].description;
        console.log('Text:', description);
        res.send({
            description
        })
    } catch (err) {
        throw new Error(err)
    }
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

module.exports = app;