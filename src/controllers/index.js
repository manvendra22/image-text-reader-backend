const { ImageAnnotatorClient } = require('@google-cloud/vision');

/**
Google vision configs
*/
const visionClient = new ImageAnnotatorClient({
    keyFilename: 'google-credentials.json'
});

exports.fetchText = async function (req, res, next) {
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
}