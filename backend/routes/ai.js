const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/analyze', aiController.analyzeSymptoms);
router.get('/status', aiController.checkStatus);

module.exports = router;
