const express = require('express');
const router = express.Router();
const multer = require('multer');
const { applyLoan, getAllLoans } = require('../controllers/loanController');

// Simple memory storage for testing (use Cloudinary for production)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/apply', upload.single('document'), applyLoan);
router.get('/all', getAllLoans);

module.exports = router;