
const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
 username : {
  type : String,
  required: true,
  unique: true, //to allow unique username for each user
  trim: true
 },

 email : {
  type: String,
  required: true,
  unique: true, 
  trim: true,
  lowercase: true
 },

 password : {
  type: String,
  required: true,
 },

 role : {
  type: String,
  enum: ['user', 'admin',], //to only allow user or admin roles
  default: 'user'
 }

}, {timestamps : true });

module.exports = mongoose.model('User', Userschema);