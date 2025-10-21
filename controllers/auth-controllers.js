
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//register controller
const registerUser = async (req, res) => {
  try {
    //extract user information from our request body
    const {username, email, password, role} = req.body;

    //check if user is already in database
    const checkExistingUser = await User.findOne({$or : [{username}, {email}]});
    if(checkExistingUser) {
      return res.status(401).json({
        success : false,
        message: 'User already exist. Please try with a different username or email'
      });
    }

    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    //create a new user and save in database
    const newlyCreatedUser = new User ({
     username,
     email,
     password : hashedPassword, //to pass the hashed password instead
     role: role || 'user' //assign role or default(user)
    })

    await newlyCreatedUser.save();

    if(newlyCreatedUser) {
      res.status(201).json({
        success : true,
        message : 'User registered successfully!'
      });
    } else {
      res.status(400).json({
        success :false,
        message : 'User registration failed. Please try again!'
      });
    }

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success : false,
      message : 'Some error occured! please try again later'
    })
    
  }
};

//login controller
const loginUser = async (req, res) => {
  try {
    const {username, password} = req.body;

    //find if the current user exists in the database
    const user = await User.findOne({username});
    if(!user) {
      return res.status(401).json({
        success : false,
        message : 'Invalid username or password'
      });
    }

    //if password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch) {
      return res.status(401).json({
        success : false,
        message : 'Invalid username or password'
      });
    }

    //create token
    const accessToken = jwt.sign({
      userId : user._id,
      username : user.username,
      role : user.role
    }, process.env.JWT_SECRET_KEY, {
      expiresIn : '15m'
    })

    res.status(200).json({
      success : true,
      message : 'Logged in successfully',
      accessToken
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success : false,
      message : 'Some error occured! please try again later'
    });
  }
};

//change password
const changePassword = async (req, res) => {
 try {
   const userId = req.userInfo.userId;

   //extract old and new paswword
   const {oldPassword, newPassword} = req.body;

   //find the current logged in user
   const user = await User.findById(userId);

   if (!user) {
    return res.status(401).json({
      success : false,
      message : 'User not found'
    });
   }

   //check if the old password is correct
   const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

   if (!isPasswordMatch) {
    return res.status(400).json({
      success : false,
      message : 'Incorrect password! Try again'
    });
   }

   //hash the new paswword
   const salt = await bcrypt.genSalt(10);
   const newHashedPassword = await bcrypt.hash(newPassword, salt);

   //update user password
   user.password = newHashedPassword
   await user.save();

    res.status(200).json({
     success : true,
     message : 'Password changed successfulyy'
    });

 } catch (e) {
    console.log(e);
    res.status(500).json({
      success : false,
      message : 'some error occured! Please try again later', 
    });
 } 
}
module.exports = { registerUser, loginUser, changePassword};