const express = require('express');
const {login, register, logout, getOtherUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/', authMiddleware, getOtherUsers);

module.exports = router;