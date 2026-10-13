
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    permissionMiddleware("profile.view"),
    (req, res) => {
        res.json({
            message: "Profile access successful",
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                roles: req.userRoles
            }
        });
    }
);

module.exports = router;
