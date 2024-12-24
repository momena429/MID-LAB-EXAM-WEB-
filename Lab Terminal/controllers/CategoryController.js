const Category = require('../models/category.model');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('admin/categories/allCategories', { categories, layout: 'admin-layout' });
    } catch (error) {
        res.status(500).send('error', { message: 'Error fetching categories', layout: 'admin-layout' });
    }
};

// Render create category form
exports.renderCreateForm = (req, res) => {
    res.render('admin/categories/addCategory', { layout: 'admin-layout' });
};

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, gender } = req.body;
        const category = new Category({ name, gender });
        console.log(category);
        await category.save();
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
    }
};

// Render edit category form
exports.renderEditForm = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).render('error', { message: 'Category not found', layout: 'admin-layout' });
        res.render('admin/categories/editCategories', { category, layout: 'admin-layout' });
    } catch (error) {
        console.log(error);
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const { name, gender } = req.body;
        await Category.findByIdAndUpdate(req.params.id, { name, gender });
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (error) {
        console.log(error);
    }
};
