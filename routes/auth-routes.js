
const express = require('express');
const {registerUser, loginUser, changePassword} = require('../controllers/auth-controllers');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

//all routes are related to aunthentication and authorization
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router