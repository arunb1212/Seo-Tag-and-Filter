const express = require('express');
const router = express.Router();
const { generateTags } = require('../controllers/tagController');

router.post('/generate-tags', generateTags);

module.exports = router;
