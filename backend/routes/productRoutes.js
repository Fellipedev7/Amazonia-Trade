// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload'); 
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, upload.single('image'), productController.createProduct);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;


