const express = require('express');
const CategoryController = require('../../controllers/CategoryController');
const router = express.Router();
const authorization = require('../../middlewares/authorization');  // Import the authorization middleware

// Protect routes for categories (if needed)
router.use(authorization);

// Routes for categories
router.get('/', CategoryController.getAllCategories);
router.get('/new', CategoryController.renderCreateForm);    
router.post('/create', CategoryController.createCategory);
router.get('/:id/edit', CategoryController.renderEditForm);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;
