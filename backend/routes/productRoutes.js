
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();

// Public: view all products
router.get("/", getProducts);

// Moderator/Admin with permission: create product
router.post(
    "/",
    authMiddleware,
    permissionMiddleware("product.create"),
    createProduct
);

// Moderator/Admin with permission: edit product
router.put(
    "/:id",
    authMiddleware,
    permissionMiddleware("product.update"),
    updateProduct
);

// Moderator/Admin with permission: delete product
router.delete(
    "/:id",
    authMiddleware,
    permissionMiddleware("product.delete"),
    deleteProduct
);

module.exports = router;
