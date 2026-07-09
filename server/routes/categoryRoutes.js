const express=require("express")
const router=express.Router()
const{createCategory,getCategories,updateCategory,deleteCategory}=require("../controllers/categoryController")

//authMiddleware  re user login karichiki nahi check hue
const authMiddleware = require("../middleware/authMiddleware")
//user login karichi jie se admin na nahi thn se book add ki delete n update kripariba
const adminMiddleware=require("../middleware/adminMiddleware")

router.get("/",getCategories)

///it will check whether user logged in or not and after that check user is admin or not
router.post("/",authMiddleware,adminMiddleware,createCategory)
router.put("/:id",authMiddleware,adminMiddleware,updateCategory)
router.delete("/:id",authMiddleware,adminMiddleware,deleteCategory)

module.exports=router
