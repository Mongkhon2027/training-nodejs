require("../../config/config");
const Orders = require("../../models/orders");
const Products = require("../../models/products");

// [GET] /api/v1/orders
const getOrders = async (req, res) => {
    try {
        console.log("[GET] Orders from all products ...");

        const pipeline = [
            {
                $group: {
                    _id: "$product_id",
                    quantity: { $sum: "$quantity" },
                    price: { $sum: "$price" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $project: {
                    _id: 0,
                    product_id: "$_id",
                    product_name: "$product.name",
                    quantity: 1,
                    price: 1
                }
            },
            {
                $sort: { product_id: 1 }
            }
        ]

        const ordersResponse = await Orders.aggregate(pipeline);

        console.log("[success] fetch Orders from all products");
        return res.status(200).json({
            status: 200,
            message: "success",
            data: ordersResponse
        })
    } catch (error) {
        console.error("[error] Failed to fetch orders:", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

// [GET] /api/v1/products/:id/orders
const getOrderByIdProduct = async (req, res) => {
    try {
        console.log("[GET] Order by product (id) ...");

        const { id } = req.params;
        const product = await Products.findById(id);
        if (!product) {
            console.log("[warning] Product not found");
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            })
        }

        const orders = await Orders.find({ product_id: id });

        const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);
        const totalPrice = orders.reduce((sum, order) => sum + order.price, 0);

        const orderResponse = {
            product_id: product._id,
            product_name: product.name,
            quantity: totalQuantity,
            price: totalPrice
        };
        console.log("[success] Fetch order from product (id)");
        return res.status(200).json({
            status: 200,
            message: "success",
            data: orderResponse
        })
    } catch (error) {
        console.error("[error] Failed to fetch order from product (id):", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

// [POST] /api/v1/products/:id/orders
const addOrder = async (req, res) => {
    try {
        console.log("[POST] Add order ...");
        const { id } = req.params;
        const { quantity } = req.body;

        const product = await Products.findById(id);
        if (!product) {
            console.log("[warning] Product not found");
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            })
        }
        if (quantity > product.stock) {
            console.log(`[warning] Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`);
            return res.status(400).json({
                status: 400,
                message: `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`
            })
        }

        // คำนวณราคาของจำนวน order ที่สั่ง
        const totalPrice = product.price * quantity;

        const orderData = {
            product_id: id,
            quantity,
            price: totalPrice
        };

        const order = await Orders.create(orderData);

        // ลบ stock ใน product
        await Products.findByIdAndUpdate(id, {
            $inc: { stock: -quantity }
        });

        const orderResponse = {
            product_id: order.product_id,
            quantity: order.quantity,
            price: order.price
        }

        console.log(`[success] Order has been added`);
        return res.status(201).json({
            status: 201,
            message: "Order add success",
            data: orderResponse
        })
    } catch (error) {
        console.error("[error] Failed to add order:", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

module.exports = {
    addOrder,
    getOrders,
    getOrderByIdProduct,
}