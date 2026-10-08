const express = require('express');
const { parseInvoiceFromText, generateRemainderEmails, getDashboardSummary } = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/parse-invoice', authMiddleware, parseInvoiceFromText);
router.post('/generate-remainder', authMiddleware, generateRemainderEmails);
router.get('/dashboard-summary', authMiddleware, getDashboardSummary);

module.exports = router;