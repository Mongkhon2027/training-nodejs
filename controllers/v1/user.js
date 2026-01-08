require("../../config/config");
const Users = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// Constants
const SALT_ROUNDS = 10;

// [POST] - User login
const login = async (req, res) => {
    try {
        console.log("[POST] User logging in ...");
        const { username, password } = req.body

        const user = await Users.findOne({ username });
        if (!user) {
            console.log("[warning] Username not found");
            return res.status(401).json({
                status: 401,
                message: "Invalid username or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("[warning] Invalid password");
            return res.status(401).json({
                status: 401,
                message: "Invalid username or password"
            })
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, approved: user.approved },
            GLOBAL_VALUE.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log(`[success] User ${user.name} Login`);
        return res.status(200).json({
            status: 200,
            message: "Login success",
            token: token
        });
    } catch (error) {
        console.error("[error] Failed to login:", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

// [POST] - User register
const registerUser = async (req, res) => {
    try {
        console.log("[POST] User is registering ...");
        const { username, password, name, } = req.body;

        // Check exist username
        const exist = await Users.findOne({ username });
        if (exist) {
            console.log("[warining] This user name already exist!");
            return res.status(400).json({
                status: 400,
                message: "Username already exist"
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const userData = {
            username,
            password: hashedPassword,
            name,
        }

        const user = await Users.create(userData);

        userResponse = {
            username: user.username,
            name: user.name,
            role: user.role,
            approved: user.approved,
        }

        console.log(`[success] User ${user.name} is registered`);
        return res.status(201).json({
            status: 201,
            message: "Register successfully!",
            data: userResponse,
        })
    } catch (error) {
        console.error("[error] Failed to register:", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

// [PUT] - Approve user (Admin only)
const approveUser = async (req, res) => {
    try {
        console.log("[PUT] Admin is approving ...")
        if (req.user.role !== 'admin') {
            return res.status(401).json({
                status: 401,
                message: "Only admin can approve"
            })
        }

        const { id } = req.params;

        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            })
        }

        user.approved = true;
        await user.save();

        const approveResponse = {
            username: user.username,
            name: user.name,
            approved: user.approved
        }

        console.log(`[success] User ${user.name} has been approved`);
        return res.status(200).json({
            status: 200,
            message: "User approved successfully",
            data: approveResponse
        })
    } catch (error) {
        console.error("[error] Falied to approve:", error.message);
        return res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}

module.exports = {
    registerUser,
    login,
    approveUser,
}