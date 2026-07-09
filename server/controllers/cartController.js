const Cart = require("../models/cart")

// GET USER CART
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate("items.bookId")
        res.status(200).json({
            success: true,
            data: cart
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
            error: err.message
        })
    }
}

// ADD TO CART
exports.addToCart = async (req, res) => {
    try {
        const { bookId, quantity } = req.body
        let cart = await Cart.findOne({ userId: req.user.id })
        if (!cart) {
            cart = await Cart.create({
                userId: req.user.id,
                items: [{ bookId, quantity }]
            })
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.bookId.toString() === bookId
            )
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity
            } else {
                cart.items.push({ bookId, quantity })
            }
            await cart.save()
        }
        res.status(200).json({
            success: true,
            message: "Item added to cart",
            data: cart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add to cart",
            error: error.message
        });
    }
}

// UPDATE QUANTITY
exports.updateCart = async (req, res) => {
    try {
        const { bookId, quantity } = req.body
        const cart = await Cart.findOne({ userId: req.user.id })
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" })
        }
        const itemIndex = cart.items.findIndex(
            item => item.bookId.toString() === bookId
        )
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity
        }
        await cart.save()
        const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.bookId")
        res.status(200).json({
            success: true,
            message: "Cart updated",
            data: updatedCart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update cart",
            error: error.message
        });
    }
}

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.params
        const cart = await Cart.findOne({ userId: req.user.id })
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" })
        }
        cart.items = cart.items.filter(
            item => item.bookId.toString() !== bookId
        )
        await cart.save()
        const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.bookId")
        res.status(200).json({
            success: true,
            message: "Item removed",
            data: updatedCart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove item",
            error: error.message
        });
    }
}