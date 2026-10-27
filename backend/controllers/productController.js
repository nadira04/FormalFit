
const Product = require("../models/Product");

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, currency, category, image } = req.body;

        if (
            !name?.trim() ||
            !description?.trim() ||
            price === undefined ||
            price === "" ||
            !category?.trim() ||
            !image?.trim()
        ) {
            return res.status(400).json({
                message: "Please provide all required product fields"
            });
        }

        const numericPrice = Number(price);
        const selectedCurrency = currency || "USD";

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                message: "Price must be a valid non-negative number"
            });
        }

        if (!["USD", "EUR", "GBP", "BDT"].includes(selectedCurrency)) {
            return res.status(400).json({
                message: "Currency must be USD, EUR, GBP, or BDT"
            });
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: numericPrice,
            currency: selectedCurrency,
            category: category.trim(),
            image: image.trim(),
            createdBy: req.user._id
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, currency, category, image } = req.body;

        if (
            !name?.trim() ||
            !description?.trim() ||
            price === undefined ||
            price === "" ||
            !category?.trim() ||
            !image?.trim()
        ) {
            return res.status(400).json({
                message: "Please provide all required product fields"
            });
        }

        const numericPrice = Number(price);
        const selectedCurrency = currency || "USD";

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                message: "Price must be a valid non-negative number"
            });
        }

        if (!["USD", "EUR", "GBP", "BDT"].includes(selectedCurrency)) {
            return res.status(400).json({
                message: "Currency must be USD, EUR, GBP, or BDT"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: name.trim(),
                description: description.trim(),
                price: numericPrice,
                currency: selectedCurrency,
                category: category.trim(),
                image: image.trim()
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Update product error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        res.status(500).json({ message: "Server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete product error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
