
const User = require("../models/user");
const Role = require("../models/Role");
require("../models/Permission");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain uppercase, lowercase and a number, and be at least 6 characters"
            });
        }

        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                message: "Please enter a valid name"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const userRole = await Role.findOne({ name: "user" });

        if (!userRole) {
            return res.status(500).json({
                message: "Default user role is not configured"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            roles: [userRole._id]
        });

        res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: ["user"]
            }
        });

    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Please enter your password"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({
                message: "Account not found. Please register first."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        const populatedUser = await User.findById(user._id)
            .populate({
                path: "roles",
                populate: {
                    path: "permissions",
                    select: "name"
                }
            });

        if (!populatedUser) {
            return res.status(500).json({
                message: "User data could not be loaded"
            });
        }

        const roles = populatedUser.roles
            .filter(role => role)
            .map(role => role.name);

        const permissions = [
            ...new Set(
                populatedUser.roles
                    .filter(role => role)
                    .flatMap(role =>
                        (role.permissions || [])
                            .filter(permission => permission)
                            .map(permission => permission.name)
                    )
            )
        ];

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles,
                permissions
            }
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    signup,
    login
};
