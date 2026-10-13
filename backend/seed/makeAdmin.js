
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");
const Role = require("../models/Role");
require("../models/Permission");

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = "admin@formalfit.com";

        const user = await User.findOne({ email: email.toLowerCase() });
        const adminRole = await Role.findOne({ name: "admin" });

        if (!user) {
            console.log("User not found. Please sign up first.");
            return;
        }

        if (!adminRole) {
            console.log("Admin role not found. Run seedRoles.js first.");
            return;
        }

        user.roles = [adminRole._id];
        await user.save();

        console.log("Admin role assigned successfully!");
        console.log("Admin email:", user.email);
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

makeAdmin();
