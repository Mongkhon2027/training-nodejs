require("../../config/config");
const Products = require("../../models/products");

// Constants
const ALLOWED_ROLES = ["user", "admin"];


// [GET] /api/v1/products
const getProducts = async (req, res) => {
    try {
        console.log("[GET] All products ...");
        const products = await Products.find();

        const productResponse = products.map(product => ({
            name: product.name,
            price: product.price,
            stock: product.stock
        }))

        console.log("[success] Fetch products");
        return res.status(200).json({
            status: 200,
            message: "success",
            data: productResponse
        })
    } catch (error) {
        console.error("[error] Failed to fetch products");
        return res.status(500).json({
            status: 500,
            message: error.message,
        })
    }
}

// [GET] /api/v1/products/:id
const getProductById = async (req, res) => {
    try {
        console.log("[GET] product by id ...");
        const { id } = req.params;
        const product = await Products.findById(id);

        if (!product) {
            console.log("[warning] Product not found");
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            })
        }

        const productResponse = {
            name: product.name,
            price: product.price,
            stock: product.stock
        }

        console.log("[success] fetch product by id");
        return res.status(200).json({
            status: 200,
            message: "success",
            data: productResponse
        })
    } catch (error) {
        console.error("[error] Failed to fetch product by id:", error.message);
        return res.statuss(500).json({
            status: 500,
            message: error.message
        })
    }
}

// [POST] /api/v1/products
const createProduct = async (req, res) => {
    try {
        console.log("[POST] Create product ...");
        const { name, price, stock } = req.body

        const existingProduct = await Products.findOne({ name });
        if (existingProduct) {
            console.log("[warining] Product name already exist");
            return res.status(400).json({
                status: 400,
                message: "Product name already exist"
            })
        }

        const productData = {
            name,
            price,
            stock
        }
        const product = await Products.create(productData);

        const productResponse = {
            name: product.name,
            price: product.price,
            stock: product.stock
        }

        console.log("[success] Product has been created");
        return res.status(201).json({
            status: 201,
            message: `Add product ${productResponse.name} success`,
            data: productResponse
        })
    } catch (error) {
        console.error("[error] Failed to create product", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message,
        })
    }
}

// [PUT] /api/v1/products/:id
const updateProduct = async (req, res) => {
    try {
        console.log("[PUT] Update product ...");
        const { id } = req.params;
        const { name, price, stock } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (price !== undefined) updateData.price = price;
        if (stock !== undefined) {
            updateData.$inc = { stock: stock }
        }

        const product = await Products.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            console.log("[warning] Product not found");
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            })
        }
        const productResponse = {
            name: product.name,
            price: product.price,
            stock: product.stock
        }

        console.log("[success] product has been updated");
        return res.status(200).json({
            status: 200,
            message: "Product updated success",
            data: productResponse
        })
    } catch (error) {
        console.error("[error] Failed to update product", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

// [DELETE] /api/v1/products/:id
const deleteProduct = async (req, res) => {
    try {
        console.log("[DELETE] Product by id ...");
        const { id } = req.params;

        const product = await Products.findByIdAndDelete(id);
        if (!product) {
            console.log("[warning] Product not found");
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            })
        }

        console.log("[success] Product has been deleted");
        return res.status(200).json({
            status: 200,
            messsage: `Product ${product.name} delete success`
        })
    } catch (error) {
        console.error("[error] Failed to delete product", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
}