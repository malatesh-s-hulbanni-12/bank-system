const express = require('express');
const router = express.Router();
const { createFixedDeposit, getAllFixedDeposits, getFixedDepositsByAccount, updateFdStatus } = require('../controllers/fixedDepositController');

router.post('/create', createFixedDeposit);
router.get('/all', getAllFixedDeposits);
router.get('/account/:accountNumber', getFixedDepositsByAccount);
router.put('/:id/status', updateFdStatus);

module.exports = router;