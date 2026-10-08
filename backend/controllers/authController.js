const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @desc Register new user
// @route POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({ name, email, password });
        if (user) {
            res.status(201).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: error.message });
    }
}

// @desc Login user
// @route POST /api/auth/login
// @access Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            businessName: user.businessName || "",
            address: user.address || "",
            phone: user.phone || "",
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
}

// @desc Get current user
// @route GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            businessName: user.businessName || "",
            address: user.address || "",
            phone: user.phone || "",
        })
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// @desc Update user profile
// @route PUT /api/auth/me
// @access Private
exports.updateProfile = async (req, res) => {
    const { name, businessName, address, phone } = req.body;
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = name || user.name;
            user.businessName = businessName || user.businessName;
            user.address = address || user.address;
            user.phone = phone || user.phone;

            const updatedUser = await user.save();

            res.json({
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                businessName: updatedUser.businessName,
                address: updatedUser.address,
                phone: updatedUser.phone,
            });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// Helper: generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
