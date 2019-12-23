const express = require('express');
const fs = require('fs');
const path = require('path');
// const util = require('util');
const multer = require('multer');
const logger = require('morgan');
const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

require('dotenv').config();

const port = process.env.PORT || 9000;

const app = express();

// app.use(fileUpload());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// promisify the filesystem functions we need
// const readdirAsync = util.promisify(fs.readdir);
// const statAsync = util.promisify(fs.stat);
// const unlinkAsync = util.promisify(fs.unlink);

// fs.writeFileSync(path.join(__dirname, 'gcloud-credentials.json'), process.env.SERVICE_ACCOUNT_JSON);

// create Cloud Vision client
// const visionClient = new ImageAnnotatorClient();

const uploadPath = path.join(__dirname, 'uploads');

// create the upload folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// configure multer to use the uploads folder
const upload = multer({ dest: 'uploads/' });

// API calls
app.get('/api/contents', (req, res) => {
    res.json({ express: 'Hello From Express' });
});

app.post('/api/contents', upload.single('image'), async (req, res) => {
    if (!req.file) {
        res.sendStatus(500);
        return;
    }

    // get the file path uploaded via multer
    const filePath = req.file.path;

    console.log("filePath ", filePath)

    // send the image to gcloud for text detection
    // const results = await visionClient.textDetection(filePath);

    // console.log("results ", results)
    // res.status(201).json(results);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, function () {
    console.log(`Example app listening on port: ${port}`);
});

module.exports = app;