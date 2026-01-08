const express = require("express");
const v2Router = express.Router();

// ======== PUBLIC ROUTES ======= //
v2Router.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        message: "this is api/v2"
    })
})

module.exports = v2Router;