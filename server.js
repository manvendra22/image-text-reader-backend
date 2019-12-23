const express = require('express');
const fs = require('fs');
const path = require('path');
const util = require('util');
const multer = require('multer');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

require('dotenv').config();

const port = process.env.PORT || 9000;

const app = express();
const router = express.Router();

app.use(fileUpload());
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
router.get('/api/contents', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

router.post('/api/contents', upload.single('image'), async (req, res) => {
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

app.listen(port, function () {
    console.log(`Example app listening on port !`);
});
