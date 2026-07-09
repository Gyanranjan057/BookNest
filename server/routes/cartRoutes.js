
const express = require("express")
const router = express.Router()
const { getCart, addToCart, updateCart, removeFromCart } = require("../controllers/cartController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/", authMiddleware, getCart)
router.post("/add", authMiddleware, addToCart)
router.put("/update", authMiddleware, updateCart)
router.delete("/remove/:bookId", authMiddleware, removeFromCart)

module.exports = router