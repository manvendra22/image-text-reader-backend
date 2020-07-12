const express = require("express");
const router = express.Router();
const multer = require('multer');

const controller = require("../controllers");

/**
configure multer
*/
const upload = multer();

router.post('/api/contents', upload.single('image'), controller.fetchText);

module.exports = router;