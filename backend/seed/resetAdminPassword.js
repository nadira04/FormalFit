require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = "admin@formalfit.com";
        const newPassword = "FormalFit@123";

        const user = await User.findOne({ email });

        if (!user) {
            console.log("Admin user not found!");
            return;
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        console.log("Admin password reset successfully!");
        console.log("Email:", email);
        console.log("New password:", newPassword);
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

resetPassword();