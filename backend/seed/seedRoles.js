
require("dotenv").config();

const mongoose = require("mongoose");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

const Permissions = [
    { name: "user.view", description: "View users" },
    { name: "user.manage", description: "Manage users" },
    { name: "role.view", description: "View roles" },
    { name: "role.create", description: "Create roles" },
    { name: "role.update", description: "Update roles" },
    { name: "role.delete", description: "Delete roles" },
    { name: "permission.view", description: "View permissions" },
    { name: "permission.manage", description: "Manage permissions" },
    { name: "product.view", description: "View products" },
    { name: "product.manage", description: "Manage products" },
    { name: "order.view", description: "View orders" },
    { name: "order.manage", description: "Manage orders" },
    { name: "profile.view", description: "View own profile" },
    { name: "profile.update", description: "Update own profile" },
    { name: "cart.manage", description: "Manage own cart" }
];

async function seedRoles() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const permissionIds = {};

        for (const item of Permissions) {
            const permission = await Permission.findOneAndUpdate(
                { name: item.name },
                { $set: { description: item.description } },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            permissionIds[item.name] = permission._id;
        }

        const rolePermissions = {
            admin: Permissions.map(p => p.name),
            moderator: [
                "user.view",
                "product.view",
                "product.manage",
                "order.view",
                "profile.view"
            ],
            user: [
                "product.view",
                "profile.view",
                "profile.update",
                "cart.manage"
            ]
        };

        for (const [name, permissionNames] of Object.entries(rolePermissions)) {
            await Role.findOneAndUpdate(
                { name },
                {
                    $set: {
                        description: `${name} role`,
                        permissions: permissionNames.map(p => permissionIds[p])
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
        }

        console.log("Roles and permissions seeded successfully");
    } catch (error) {
        console.error("Seed error:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedRoles();
