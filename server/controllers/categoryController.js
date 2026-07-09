 
const Category = require("../models/category")

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body
        const category = await Category.create({ name })
        res.status(201).json({
            success: true,
            message: "Category created",
            data: category
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: err.message
        })
    }
}

// GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json({
            success: true,
            data: categories
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: err.message
        })
    }
}

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body
         const category = await Category.findByIdAndUpdate(id, { name }, { returnDocument: "after" })
        res.status(200).json({
            success: true,
            message: "Category Updated",
            data: category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Update failed",
            error: error.message
        })
    }
}

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
    try {
         const { id } = req.params
        await Category.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "Category deleted"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete failed",
            error: error.message
        })
    }
}