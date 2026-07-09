const express = require("express")
const router =express.Router()

const authRoutes= require("../routes/authRoutes")
const bookRoutes=require("../routes/bookRoutes")
const categoryRoutes=require("../routes/categoryRoutes")
const cartRoutes=require("../routes/cartRoutes")
const orderRoutes=require("../routes/orderRoutes")
const paymentRoutes = require("../routes/paymentRoutes");

router.use("/auth",authRoutes)
router.use("/books",bookRoutes)
router.use("/categories",categoryRoutes)
router.use("/cart",cartRoutes)
router.use("/orders",orderRoutes)
router.use("/payment", paymentRoutes);

module.exports=router