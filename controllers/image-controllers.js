//import models
const Image = require('../models/image');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');


const uploadImageController = async (req,res) => {
  try {
    //check if file is missing in req object
    if(!req.file) {
      return res.status(400).json({
        success : true,
        messgae : 'File is required. Please upload an image'
      });
    }

    //upload to cloudinary
    const {url, publicId} = await uploadToCloudinary(req.file.path)

    //store the image url and public id along with uploaded user id
    const newlyUploadedImage = new Image({
     url,
     publicId,
     uploadedBy : req.userInfo.userId
    });

    await newlyUploadedImage.save();

    //delete the file from localstorage(uploads-folder)
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success : true,
      message : 'Image uploaded successfully',
      image : newlyUploadedImage
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success : false,
      message : 'Something went wrong! Please try again',
      error : error.message || error //to state the main error
    });
  }
}


const fetchImageController = async (req,res) => {
  try {
    const images = await Image.find({});

    if(images) {
      res.status(201).json({
       success : true,
       data : images
      });
    }
      
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success : false,
      message : 'Something went wrong! Please try again'
    });
  }
}

/*
const deleteImageController = async (req,res) => {
  try {
    const getCurrentIdOfImageToBeUploaded = req.params.id;
    //const image = await Image.findById(getCurrentIdOfImageToBeUploaded);
    await image.deleteOne();

    if(!image) {
      return res.status(403).json({
        success : false,
        message : 'Image not found'
      });
    }

    //check if image is uploaded by the current user
    if(image.uploadedBy.toString() !== req.userInfo.userId) {
      return res.status(404).json({
        success : false,
        message : 'You are not authorized to delete thi image'
      });
    }

    //delete  from cloudinary, but first require clodinary
    await cloudinary.uploader.destroy(image.publicId);

    //delete from mongodb
    await image.findByIdAndDelete(getCurrentIdOfImageToBeUploaded);

    res.status(200).json({
      success : true,
      message : 'Image deleted successfully'
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success : false,
      message : 'Something went wrong! Please try again'
    });
  }
}
  */
 

//gbt
const deleteImageController = async (req, res) => {
  try {
    const imageId = req.params.id; // from URL params
    const userId = req.userInfo.userId; // from token

    //Find image by ID
    const foundImage = await Image.findById(imageId);
    if (!foundImage) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    //Ensure only uploader or admin can delete
    if (foundImage.uploadedBy.toString() !== userId && req.userInfo.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this image',
      });
    }

    //Delete from Cloudinary
    await cloudinary.uploader.destroy(foundImage.publicId);

    //Delete from MongoDB
    await Image.findByIdAndDelete(imageId);

    //Return success
    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error(' Error while deleting image:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again',
      error: error.message,
    });
  }
};


module.exports = {
  uploadImageController,
  fetchImageController,
  deleteImageController
};