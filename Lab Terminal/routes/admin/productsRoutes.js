const express = require("express");
let router = express.Router();
const productController = require("../../controllers/ProductController");
const authorization = require("../../middlewares/authorization");  // Import the authorization middleware

// Protect all routes in the admin section (dashboard, product management, etc.)
router.use(authorization);  // This will protect all admin routes

// Dashboard route
router.get("/dashboard", productController.dashboard);

// Product delete route
router.get("/products/delete/:id", productController.deleteProduct);

// Product edit form route
router.get("/products/edit/:id", productController.editProductForm);

// Product update route
router.post("/products/edit/:id", productController.editProduct);  // Action for editing a product

// Product create form route
router.get("/products/create", productController.createProductForm);

// Product create route
router.post("/products/create", productController.createProduct); // Action for creating a new product

// List products route with pagination and search
router.get("/products", productController.listProducts);

// Cart route
router.get("/cart", productController.cart);

module.exports = router;
