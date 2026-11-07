
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const {
    getDashboard,
    getUsers,
    getRoles,
    getPermissions,
    assignUserRole,
    deleteUser,
    createRole,
    updateRole,
    deleteRole,
    createPermission,
    updatePermission,
    deletePermission
} = require("../controllers/adminController");
const {
    getContacts,
    updateContactStatus,
    deleteContact
} = require("../controllers/contactController");
const {
    getSubscribers
} = require("../controllers/subscriptionController");

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

router.put(
    "/users/:id/role",
    authMiddleware,
    permissionMiddleware("user.update"),
    assignUserRole
);

router.delete(
    "/users/:id",
    authMiddleware,
    permissionMiddleware("user.delete"),
    deleteUser
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
router.get(
    "/contacts",
    authMiddleware,
    permissionMiddleware("contact.view"),
    getContacts
);

router.put(
    "/contacts/:id",
    authMiddleware,
    permissionMiddleware("contact.update"),
    updateContactStatus
);

router.delete(
    "/contacts/:id",
    authMiddleware,
    permissionMiddleware("contact.delete"),
    deleteContact
);


router.get(
    "/subscribers",
    authMiddleware,
    permissionMiddleware("user.view"),
    getSubscribers
);
module.exports = router;