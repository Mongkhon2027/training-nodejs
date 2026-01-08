const { Schema, default: mongoose } = require("mongoose")
require("../config/config")

const orderSchema = new Schema(
    {
        product_id: { type: Schema.Types.ObjectId },
        quantity: { type: Number },
        price: { type: Number }
    },
    {
        timestamps: true
    }
);

const orders = mongoose.model("orders", orderSchema, "orders");

module.exports = orders;