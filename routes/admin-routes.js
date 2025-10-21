
const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const router = express.Router();

//passing authMiddleware and adminMiddleware as an extra protection
router.get('/welcome', authMiddleware, adminMiddleware, (req,res) => {
  res.json({
   message : 'Welcome to admin page'
  });
})

module.exports = router