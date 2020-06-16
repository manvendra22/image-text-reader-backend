const express = require('express');
const cors = require('cors')
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const bodyParser = require('body-parser');
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

/**
configure multer
*/
const upload = multer();

/**
Google vision configs
*/
const visionClient = new ImageAnnotatorClient({
    keyFilename: 'google-credentials.json'
});

/**
API call
*/

app.post('/api/contents', upload.single('image'), async (req, res, next) => {
    try {
        /**
        get the file data via multer
        */
        const file = req.file.buffer
        const mimetype = req.file.mimetype

        const response = await visionClient.textDetection(file)
        const detections = response[0].textAnnotations;
        const description = detections[0].description;

        res.status(200).json({ description, file, mimetype })
    } catch (error) {
        const err = new Error(error)
        return next(err);
    }
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
