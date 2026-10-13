const User = require("../models/user");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

const getDashboard = async (req, res) => {
    try {
        const [totalUsers, totalRoles, totalPermissions] = await Promise.all([
            User.countDocuments(),
            Role.countDocuments(),
            Permission.countDocuments()
        ]);

        res.json({ totalUsers, totalRoles, totalPermissions });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .populate("roles", "name");

        res.json(users);
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await Role.find()
            .populate("permissions", "name description")
            .sort({ name: 1 });

        res.json(roles);
    } catch (error) {
        console.error("Get roles error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find().sort({ name: 1 });
        res.json(permissions);
    } catch (error) {
        console.error("Get permissions error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const createRole = async (req, res) => {
    try {
        const { name, description = "", permissions = [] } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Role name is required"
            });
        }

        if (!Array.isArray(permissions)) {
            return res.status(400).json({
                message: "Permissions must be an array"
            });
        }

        const normalizedName = name.trim().toLowerCase();
        const exists = await Role.findOne({ name: normalizedName });

        if (exists) {
            return res.status(409).json({
                message: "Role already exists"
            });
        }

        const validPermissions = await Permission.find({
            _id: { $in: permissions }
        }).select("_id");

        if (validPermissions.length !== new Set(permissions).size) {
            return res.status(400).json({
                message: "One or more permissions are invalid"
            });
        }

        const role = await Role.create({
            name: normalizedName,
            description: description.trim(),
            permissions
        });

        const savedRole = await Role.findById(role._id)
            .populate("permissions", "name description");

        res.status(201).json({
            message: "Role created successfully",
            role: savedRole
        });
    } catch (error) {
        console.error("Create role error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Role already exists"
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};

const updateRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    message: "Role name is required"
                });
            }

            const normalizedName = name.trim().toLowerCase();

            const exists = await Role.findOne({
                name: normalizedName,
                _id: { $ne: role._id }
            });

            if (exists) {
                return res.status(409).json({
                    message: "Role name already exists"
                });
            }

            role.name = normalizedName;
        }

        if (description !== undefined) {
            role.description = description.trim();
        }

        if (permissions !== undefined) {
            if (!Array.isArray(permissions)) {
                return res.status(400).json({
                    message: "Permissions must be an array"
                });
            }

            const validPermissions = await Permission.find({
                _id: { $in: permissions }
            }).select("_id");

            if (validPermissions.length !== new Set(permissions).size) {
                return res.status(400).json({
                    message: "One or more permissions are invalid"
                });
            }

            role.permissions = permissions;
        }

        await role.save();

        const updatedRole = await Role.findById(role._id)
            .populate("permissions", "name description");

        res.json({
            message: "Role updated successfully",
            role: updatedRole
        });
    } catch (error) {
        console.error("Update role error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Role name already exists"
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};

const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                message: "Role not found"
            });
        }

        if (["admin", "user"].includes(role.name)) {
            return res.status(400).json({
                message: "Cannot delete the default admin or user role"
            });
        }

        await User.updateMany(
            { roles: role._id },
            { $pull: { roles: role._id } }
        );

        await role.deleteOne();

        res.json({
            message: "Role deleted successfully and removed from assigned users"
        });
    } catch (error) {
        console.error("Delete role error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const createPermission = async (req, res) => {
    try {
        const { name, description = "" } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Permission name is required"
            });
        }

        const normalizedName = name.trim().toLowerCase();

        const exists = await Permission.findOne({
            name: normalizedName
        });

        if (exists) {
            return res.status(409).json({
                message: "Permission already exists"
            });
        }

        const permission = await Permission.create({
            name: normalizedName,
            description: description.trim()
        });

        res.status(201).json({
            message: "Permission created successfully",
            permission
        });
    } catch (error) {
        console.error("Create permission error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Permission already exists"
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};

const updatePermission = async (req, res) => {
    try {
        const { name, description } = req.body;
        const permission = await Permission.findById(req.params.id);

        if (!permission) {
            return res.status(404).json({
                message: "Permission not found"
            });
        }

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    message: "Permission name is required"
                });
            }

            const normalizedName = name.trim().toLowerCase();

            const exists = await Permission.findOne({
                name: normalizedName,
                _id: { $ne: permission._id }
            });

            if (exists) {
                return res.status(409).json({
                    message: "Permission name already exists"
                });
            }

            permission.name = normalizedName;
        }

        if (description !== undefined) {
            permission.description = description.trim();
        }

        await permission.save();

        res.json({
            message: "Permission updated successfully",
            permission
        });
    } catch (error) {
        console.error("Update permission error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Permission already exists"
            });
        }

        res.status(500).json({ message: "Server error" });
    }
};

const deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);

        if (!permission) {
            return res.status(404).json({
                message: "Permission not found"
            });
        }

        await Role.updateMany(
            { permissions: permission._id },
            { $pull: { permissions: permission._id } }
        );

        await permission.deleteOne();

        res.json({
            message: "Permission deleted successfully and removed from assigned roles"
        });
    } catch (error) {
        console.error("Delete permission error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getDashboard,
    getUsers,
    getRoles,
    getPermissions,
    createRole,
    updateRole,
    deleteRole,
    createPermission,
    updatePermission,
    deletePermission
};