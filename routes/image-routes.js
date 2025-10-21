
const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');
const {uploadImageController, fetchImageController, deleteImageController} = require('../controllers/image-controllers');

const router = express.Router()

//upload imgae
router.post('/upload', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImageController);

//delete image
router.delete('/:id', authMiddleware, adminMiddleware, deleteImageController);

//get all images
router.get('/get', authMiddleware, fetchImageController);

module.exports = router 