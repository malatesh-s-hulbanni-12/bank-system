const express = require('express');
const router = express.Router();
const { createFixedDeposit, getAllFixedDeposits } = require('../controllers/fixedDepositController');

router.post('/create', createFixedDeposit);
router.get('/all', getAllFixedDeposits);

module.exports = router;