require("../config/config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: 401,
                message: "No token provided",
            })
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: 401,
                message: "Invalid token format",
            })
        }

        const decoded = jwt.verify(token, GLOBAL_VALUE.JWT_SECRET);

        if (!decoded.approved) {
            return res.status(401).json({
                status: 401,
                message: "Your account is not approve"
            })
        }

        req.user = decoded
        next();
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized",
        })
    }
}

module.exports = authMiddleware