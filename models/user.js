const { Schema, default: mongoose } = require("mongoose")
require("../config/config")

const userSchema = new Schema(
    {
        username: { type: String },
        password: { type: String },
        name: { type: String },
        approved: { type: Boolean, default: false },
        role: { type: String, default: "user" }
    },
    {
        timestamps: true
    }
);

const users = mongoose.model("users", userSchema, "users");

module.exports = users;