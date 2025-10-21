
const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

//note:this route needs to be protected with auth middleware using handles 
router.get('/welcome', authMiddleware, (req,res) => {
  const {username, userId, role} = req.userInfo;
  res.json({
    message : 'welcome to home page',
    user :{
      _id : userId,
      username,
      role
    }
  });
})

module.exports = router