const express = require('express');
const { sendMessage, getMessage } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/send/:id', authMiddleware, sendMessage);
router.get('/:id', authMiddleware, getMessage);

module.exports = router;