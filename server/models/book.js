const mongoose = require("mongoose")
const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        author: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        stock: { type: Number, required: true, default: 0 },
        image: { type: String },
        isAvailable: { type: Boolean, default: true }   
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model("Book", bookSchema)

 