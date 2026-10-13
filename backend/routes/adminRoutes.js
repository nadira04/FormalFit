
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const {
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
} = require("../controllers/adminController");

const router = express.Router();

router.get(
    "/dashboard",
    authMiddleware,
    permissionMiddleware("user.view"),
    getDashboard
);

router.get(
    "/users",
    authMiddleware,
    permissionMiddleware("user.view"),
    getUsers
);

router.get(
    "/roles",
    authMiddleware,
    permissionMiddleware("role.view"),
    getRoles
);

router.post(
    "/roles",
    authMiddleware,
    permissionMiddleware("role.create"),
    createRole
);

router.put(
    "/roles/:id",
    authMiddleware,
    permissionMiddleware("role.update"),
    updateRole
);

router.delete(
    "/roles/:id",
    authMiddleware,
    permissionMiddleware("role.delete"),
    deleteRole
);

router.get(
    "/permissions",
    authMiddleware,
    permissionMiddleware("permission.view"),
    getPermissions
);

router.post(
    "/permissions",
    authMiddleware,
    permissionMiddleware("permission.manage"),
    createPermission
);

router.put(
    "/permissions/:id",
    authMiddleware,
    permissionMiddleware("permission.manage"),
    updatePermission
);

router.delete(
    "/permissions/:id",
    authMiddleware,
    permissionMiddleware("permission.manage"),
    deletePermission
);

module.exports = router;
