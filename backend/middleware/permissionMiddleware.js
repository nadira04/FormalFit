
const User = require("../models/user");

const permissionMiddleware = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id)
                .populate({
                    path: "roles",
                    populate: {
                        path: "permissions",
                        select: "name"
                    }
                });

            if (!user) {
                return res.status(401).json({
                    message: "User not found"
                });
            }

            const permissions = (user.roles || [])
                .filter(role => role)
                .flatMap(role =>
                    (role.permissions || [])
                        .filter(permission => permission)
                        .map(permission => permission.name)
                );

            if (!permissions.includes(requiredPermission)) {
                return res.status(403).json({
                    message: "You do not have permission to perform this action"
                });
            }

            next();
        } catch (error) {
            console.error("Permission error:", error);
            res.status(500).json({
                message: "Server error"
            });
        }
    };
};

module.exports = permissionMiddleware;
