const express = require('express');
const router = express.Router();
const multer = require('multer');
const { add } = require('../controllers/dormController');
const upload = multer({ dest: 'uploads/' });

router.post('/dorms/add', upload.fields([
    { name: 'dormName', maxCount: 1 }
    // not sure about the payload. will need to add other fields later.
]), add);

module.exports = router;
