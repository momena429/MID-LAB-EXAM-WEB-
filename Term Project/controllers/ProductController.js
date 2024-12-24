const Product = require("../models/product.model");
const Category = require("../models/category.model");
const multer = require("multer");
const path = require("path");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Directory to store files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Create a unique filename
  }
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept image files
  } else {
    cb(new Error("Invalid file type, only images are allowed"), false);
  }
};

// Multer upload middleware configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Controller for rendering dashboard
exports.dashboard = (req, res) => {
  res.render("admin/dashboard", { layout: "admin-layout" });
};

// Controller to delete a product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.redirect("back");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller to render edit form with product data and categories
exports.editProductForm = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id).populate("category");
    let categories = await Category.find(); // Get all categories
    return res.render("admin/product-edit-form", {
      product,
      categories, // Pass categories to the form
      layout: "admin-layout",
    });
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller for handling product update
exports.editProduct = [
  upload.single("file"), // File upload middleware
  async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send("Product not found");
      }

      // Update product fields
      product.title = req.body.title;
      product.description = req.body.description;
      product.price = req.body.price;
      product.isFeatured = Boolean(req.body.isFeatured);
      product.category = req.body.category; // Update the category

      // If a new file is uploaded, update the picture field
      if (req.file) {
        product.picture = `/uploads/${req.file.filename}`; // Save the uploaded file's path
      }

      await product.save();
      return res.redirect("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).send("Internal Server Error");
    }
  },
];

// Controller to render product creation form with categories
exports.createProductForm = async (req, res) => {
  try {
    let categories = await Category.find(); // Get all categories
    res.render("admin/product-form", { layout: "admin-layout", categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller for creating a new product
exports.createProduct = [
  upload.single("file"), // File upload middleware
  async (req, res) => {
    try {
      let newProduct = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        isFeatured: Boolean(req.body.isFeatured),
        picture: req.file ? `/uploads/${req.file.filename}` : null, // Handle file upload
      });

      await newProduct.save();
      return res.redirect("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error.message);
      res.status(500).send("Internal Server Error");
    }
  },
];

// Controller for listing all products with pagination and search
exports.listProducts = async (req, res) => {
  try {
    let searchQuery = req.query.search || ""; // Default to empty string if no search query
    let page = req.query.page ? Number(req.query.page) : 1;
    let pageSize = 2;

    // Search for products matching the search query
    let products = await Product.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for title
        { description: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for description
      ],
    })
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    let totalRecords = await Product.countDocuments({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    });

    let totalPages = Math.ceil(totalRecords / pageSize);

    res.render("admin/products", {
      layout: "admin-layout",
      products,
      searchQuery, // Pass the search query to the view
      page,
      totalRecords,
      totalPages,
    });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller for cart page
exports.cart = (req, res) => {
  res.render("admin/cart", { layout: "admin-layout", noHeader: true, noFooter: true });
};
