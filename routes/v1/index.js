const express = require("express");
const v1Router = express.Router();
const userRouter = require("./users");
const productRouter = require("./products");
const orderRouter = require("./orders");
const authMiddleware = require("../../middleware/auth");

// ======== PUBLIC ROUTES ======= //
v1Router.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        message: "this is api/v1"
    })
})
v1Router.use("/users", userRouter);

// ======== AUTH REQUIRED ======= //
v1Router.use(authMiddleware)

// ======== PROTECTED ROUTES ======= //
v1Router.use("/products", productRouter);
v1Router.use("/orders", orderRouter);

module.exports = v1Router;