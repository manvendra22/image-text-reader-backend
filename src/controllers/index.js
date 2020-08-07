
require('dotenv').config();
const fs = require('fs');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const visualRecognition = new VisualRecognitionV3({
    version: '2018-03-19',
    authenticator: new IamAuthenticator({
        apikey: process.env.IBM_WATSON_API_KEY,
    }),
    url: process.env.IBM_WATSON_API_URL
});

exports.fetchText = async function (req, res, next) {
    try {
        /**
        get the file data via multer
        */
        const file = req.file.buffer
        const mimetype = req.file.mimetype

        const classifyParams = {
            imagesFile: file
        };

        const response = await visualRecognition.classify(classifyParams);

        // const classifiedImages = response.result;
        // console.log(JSON.stringify(classifiedImages, null, 2));

        res.status(200).json({ description: response.result, file, mimetype })
    } catch (error) {
        const err = new Error(error)
        return next(err);
    }
}
