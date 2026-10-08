const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    )
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Check if token exists
            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            // Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get User from token
            const user = await User.findById(decoded.id).select('-password');

            // Check if user exists
            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            // Attach user to request
            req.user = user;

            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
}

module.exports = authMiddleware;