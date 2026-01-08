const { Schema, default: mongoose } = require("mongoose")
require("../config/config")

const productSchema = new Schema(
    {
        name: { type: String },
        price: { type: Number },
        stock: { type: Number },
    },
    {
        timestamps: true
    }
);

const products = mongoose.model("products", productSchema, "products");

module.exports = products;