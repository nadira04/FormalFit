
import React, { useCallback, useEffect, useState } from "react";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const emptyProductForm = {
    name: "",
    description: "",
    price: "",
    currency: "USD",
    category: "",
    image: ""
};

const emptyRoleForm = {
    id: "",
    name: "",
    description: "",
    permissions: []
};

const emptyPermissionForm = {
    id: "",
    name: "",
    description: ""
};

const Dashboard = ({ user, onBack }) => {
    const [tab, setTab] = useState("overview");

    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userSaving, setUserSaving] = useState(false);
    const [productSaving, setProductSaving] = useState(false);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [userRoleSelections, setUserRoleSelections] = useState({});
    const [roleForm, setRoleForm] = useState(emptyRoleForm);
    const [permissionForm, setPermissionForm] = useState(emptyPermissionForm);
    const [productForm, setProductForm] = useState(emptyProductForm);
    const [editingProductId, setEditingProductId] = useState("");

    const token = localStorage.getItem("token");

    const rolesOfUser = (user?.roles || []).map((role) =>
        typeof role === "string"
            ? role.toLowerCase()
            : role?.name?.toLowerCase()
    );

    const isAdmin = rolesOfUser.includes("admin");
    const isModerator = rolesOfUser.includes("moderator");

    const roleName = isAdmin
        ? "Admin"
        : isModerator
            ? "Moderator"
            : "User";

    const apiRequest = useCallback(async (path, options = {}) => {
        const response = await fetch(`${API_URL}/api/admin${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(options.headers || {})
            }
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }

        return data;
    }, [token]);

    const loadProducts = useCallback(async () => {
        const response = await fetch(`${API_URL}/api/products`);

        const data = await response.json().catch(() => []);

        if (!response.ok) {
            throw new Error(data.message || "Failed to load products");
        }

        setProducts(Array.isArray(data) ? data : data.products || []);
    }, []);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            if (isAdmin) {
                const [
                    dashboardData,
                    roleData,
                    permissionData,
                    userData
                ] = await Promise.all([
                    apiRequest("/dashboard"),
                    apiRequest("/roles"),
                    apiRequest("/permissions"),
                    apiRequest("/users")
                ]);

                setStats(dashboardData);
                setRoles(roleData);
                setPermissions(permissionData);
                setUsers(userData);

                const selections = {};

                userData.forEach((item) => {
                    selections[item._id] = item.roles?.[0]?._id || "";
                });

                setUserRoleSelections(selections);
            }

            if (isModerator) {
                await loadProducts();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, isAdmin, isModerator, loadProducts]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const showNotice = (message) => {
        setNotice(message);
        setError("");
    };

    const resetRoleForm = () => {
        setRoleForm({ ...emptyRoleForm });
    };

    const resetPermissionForm = () => {
        setPermissionForm({ ...emptyPermissionForm });
    };

    const cancelProductEdit = () => {
        setEditingProductId("");
        setProductForm({ ...emptyProductForm });
    };

    const togglePermission = (id) => {
        setRoleForm((previous) => ({
            ...previous,
            permissions: previous.permissions.includes(id)
                ? previous.permissions.filter((item) => item !== id)
                : [...previous.permissions, id]
        }));
    };

    const saveRole = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");

        try {
            const editing = Boolean(roleForm.id);

            const result = await apiRequest(
                editing ? `/roles/${roleForm.id}` : "/roles",
                {
                    method: editing ? "PUT" : "POST",
                    body: JSON.stringify({
                        name: roleForm.name,
                        description: roleForm.description,
                        permissions: roleForm.permissions
                    })
                }
            );

            resetRoleForm();
            showNotice(result.message || "Role saved successfully");
            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const editRole = (role) => {
        setRoleForm({
            id: role._id,
            name: role.name,
            description: role.description || "",
            permissions: (role.permissions || []).map(
                (permission) => permission._id
            )
        });

        setTab("roles");
        setError("");
        setNotice("");
    };

    const removeRole = async (role) => {
        if (!window.confirm(`Delete the "${role.name}" role?`)) return;

        setError("");
        setNotice("");

        try {
            const result = await apiRequest(`/roles/${role._id}`, {
                method: "DELETE"
            });

            showNotice(result.message || "Role deleted successfully");

            if (roleForm.id === role._id) {
                resetRoleForm();
            }

            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const savePermission = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");

        try {
            const editing = Boolean(permissionForm.id);

            const result = await apiRequest(
                editing
                    ? `/permissions/${permissionForm.id}`
                    : "/permissions",
                {
                    method: editing ? "PUT" : "POST",
                    body: JSON.stringify({
                        name: permissionForm.name,
                        description: permissionForm.description
                    })
                }
            );

            resetPermissionForm();
            showNotice(result.message || "Permission saved successfully");
            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const editPermission = (permission) => {
        setPermissionForm({
            id: permission._id,
            name: permission.name,
            description: permission.description || ""
        });

        setTab("permissions");
        setError("");
        setNotice("");
    };

    const removePermission = async (permission) => {
        if (!window.confirm(`Delete "${permission.name}"?`)) return;

        setError("");
        setNotice("");

        try {
            const result = await apiRequest(
                `/permissions/${permission._id}`,
                { method: "DELETE" }
            );

            showNotice(result.message || "Permission deleted successfully");

            if (permissionForm.id === permission._id) {
                resetPermissionForm();
            }

            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const assignRoleToUser = async (userId) => {
        const roleId = userRoleSelections[userId];

        if (!roleId) {
            setError("Please select a role first.");
            return;
        }

        setUserSaving(true);
        setError("");
        setNotice("");

        try {
            const result = await apiRequest(`/users/${userId}/role`, {
                method: "PUT",
                body: JSON.stringify({ roleId })
            });

            showNotice(result.message || "User role updated successfully");
            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setUserSaving(false);
        }
    };

    const deleteUserAccount = async (listedUser) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${listedUser.name}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        setUserSaving(true);
        setError("");
        setNotice("");

        try {
            const result = await apiRequest(`/users/${listedUser._id}`, {
                method: "DELETE"
            });

            showNotice(result.message || "User deleted successfully");
            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setUserSaving(false);
        }
    };

    const saveProduct = async (event) => {
        event.preventDefault();
        setProductSaving(true);
        setError("");
        setNotice("");

        try {
            const editing = Boolean(editingProductId);

            const response = await fetch(
                editing
                    ? `${API_URL}/api/products/${editingProductId}`
                    : `${API_URL}/api/products`,
                {
                    method: editing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...productForm,
                        price: Number(productForm.price)
                    })
                }
            );

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || "Failed to save product");
            }

            cancelProductEdit();
            await loadProducts();

            showNotice(
                result.message ||
                (editing
                    ? "Product updated successfully"
                    : "Product added successfully")
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setProductSaving(false);
        }
    };

    const editProduct = (product) => {
        setEditingProductId(product._id);

        setProductForm({
            name: product.name || "",
            description: product.description || "",
            price: String(product.price ?? ""),
            currency: product.currency || "USD",
            category: product.category || "",
            image: product.image || ""
        });

        setError("");
        setNotice("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const removeProduct = async (product) => {
        const confirmed = window.confirm(
            `Delete "${product.name}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        setError("");
        setNotice("");

        try {
            const response = await fetch(
                `${API_URL}/api/products/${product._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete product");
            }

            setProducts((previous) =>
                previous.filter((item) => item._id !== product._id)
            );

            if (editingProductId === product._id) {
                cancelProductEdit();
            }

            showNotice(result.message || "Product deleted successfully");
        } catch (err) {
            setError(err.message);
        }
    };

    const inputClass =
        "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black";

    const buttonClass =
        "rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40";

    const secondaryButtonClass =
        "rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-gray-100";

    const deleteButtonClass =
        "rounded-md border border-red-600 bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40";

    const tabs = [
        ["overview", "Overview"],
        ["users", "Users"],
        ["roles", "Roles"],
        ["permissions", "Permissions"]
    ];

    return (
        <div className="min-h-screen bg-white px-4 py-8 text-black sm:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                            FORMALFIT
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            {roleName} Dashboard
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Welcome, {user?.name || "User"}
                        </p>
                    </div>

                    <button onClick={onBack} className={secondaryButtonClass}>
                        Back to Home
                    </button>
                </div>

                {error && (
                    <div className="mb-5 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {notice && (
                    <div className="mb-5 rounded-md border border-gray-300 bg-gray-50 p-4 text-sm text-black">
                        {notice}
                    </div>
                )}

                {isAdmin && (
                    <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                        {tabs.map(([value, label]) => (
                            <button
                                key={value}
                                onClick={() => setTab(value)}
                                className={`rounded-md px-4 py-2.5 text-sm font-medium transition ${tab === value
                                        ? "bg-black text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-100 hover:text-black"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
                        Loading dashboard...
                    </div>
                ) : isAdmin ? (
                    <>
                        {tab === "overview" && (
                            <section>
                                <h2 className="mb-5 text-xl font-semibold">
                                    Dashboard Overview
                                </h2>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {[
                                        ["Total Users", stats.totalUsers],
                                        ["Total Roles", stats.totalRoles],
                                        ["Total Permissions", stats.totalPermissions]
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="rounded-lg border border-gray-200 bg-white p-6"
                                        >
                                            <p className="text-sm text-gray-500">{label}</p>
                                            <p className="mt-3 text-3xl font-semibold">
                                                {value ?? 0}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold">
                                        Quick Management
                                    </h3>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {[
                                            ["users", "Manage Users"],
                                            ["roles", "Manage Roles"],
                                            ["permissions", "Manage Permissions"]
                                        ].map(([value, label]) => (
                                            <button
                                                key={value}
                                                onClick={() => setTab(value)}
                                                className="rounded-md border border-gray-200 p-5 text-left transition hover:border-black hover:bg-gray-50"
                                            >
                                                <p className="font-medium">{label}</p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    View and manage {value}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {tab === "users" && (
                            <section>
                                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl font-semibold">User Management</h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Registered users and their assigned roles.
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <span className="rounded-md border border-gray-200 px-3 py-2 text-sm">
                                            Total: {users.length} users
                                        </span>
                                        <button onClick={loadData} className={secondaryButtonClass}>
                                            Refresh
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full min-w-[850px] text-left text-sm">
                                        <thead className="border-b border-gray-200 bg-gray-50">
                                            <tr>
                                                <th className="px-5 py-4">User</th>
                                                <th className="px-5 py-4">Email</th>
                                                <th className="px-5 py-4">Current Role</th>
                                                <th className="px-5 py-4">Assign Role</th>
                                                <th className="px-5 py-4">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                            {users.map((listedUser) => {
                                                const currentRoleIds = (listedUser.roles || []).map(
                                                    (role) => role._id
                                                );

                                                const selectedRole =
                                                    userRoleSelections[listedUser._id] || "";

                                                const unchanged =
                                                    currentRoleIds.length === 1 &&
                                                    currentRoleIds[0] === selectedRole;

                                                const isSelf =
                                                    String(listedUser._id) ===
                                                    String(user?._id || user?.id);

                                                return (
                                                    <tr key={listedUser._id} className="hover:bg-gray-50">
                                                        <td className="px-5 py-4">
                                                            <p className="font-medium">{listedUser.name}</p>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                ID: {listedUser._id}
                                                            </p>
                                                        </td>
                                                        <td className="px-5 py-4 text-gray-600">
                                                            {listedUser.email}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {(listedUser.roles || [])
                                                                .map((role) => role.name)
                                                                .join(", ") || "No role"}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <select
                                                                value={selectedRole}
                                                                disabled={isSelf || userSaving}
                                                                onChange={(event) =>
                                                                    setUserRoleSelections((previous) => ({
                                                                        ...previous,
                                                                        [listedUser._id]: event.target.value
                                                                    }))
                                                                }
                                                                className="w-40 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:bg-gray-100"
                                                            >
                                                                <option value="">Select role</option>
                                                                {roles.map((role) => (
                                                                    <option key={role._id} value={role._id}>
                                                                        {role.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex flex-wrap gap-2">
                                                                {isSelf ? (
                                                                    <span className="text-xs text-gray-500">
                                                                        Your account
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            onClick={() => assignRoleToUser(listedUser._id)}
                                                                            disabled={userSaving || !selectedRole || unchanged}
                                                                            className={buttonClass}
                                                                        >
                                                                            Assign
                                                                        </button>
                                                                        <button
                                                                            onClick={() => deleteUserAccount(listedUser)}
                                                                            disabled={userSaving}
                                                                            className={deleteButtonClass}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {users.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                                                        No registered users found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {tab === "roles" && (
                            <section>
                                <h2 className="mb-5 text-xl font-semibold">Role Management</h2>

                                <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
                                    <form onSubmit={saveRole} className="h-fit rounded-lg border border-gray-200 p-5">
                                        <h3 className="text-lg font-semibold">
                                            {roleForm.id ? "Edit Role" : "Create Role"}
                                        </h3>

                                        <label className="mt-5 block text-sm font-medium">
                                            Role Name
                                            <input
                                                value={roleForm.name}
                                                onChange={(e) => setRoleForm({
                                                    ...roleForm,
                                                    name: e.target.value
                                                })}
                                                required
                                                placeholder="e.g. moderator"
                                                className={inputClass}
                                            />
                                        </label>

                                        <label className="mt-4 block text-sm font-medium">
                                            Description
                                            <textarea
                                                value={roleForm.description}
                                                onChange={(e) => setRoleForm({
                                                    ...roleForm,
                                                    description: e.target.value
                                                })}
                                                rows={3}
                                                className={inputClass}
                                            />
                                        </label>

                                        <div className="mt-5">
                                            <p className="text-sm font-medium">Assign Permissions</p>
                                            <div className="mt-3 max-h-72 space-y-3 overflow-y-auto rounded-md border border-gray-200 p-3">
                                                {permissions.map((permission) => (
                                                    <label key={permission._id} className="flex cursor-pointer items-start gap-3 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={roleForm.permissions.includes(permission._id)}
                                                            onChange={() => togglePermission(permission._id)}
                                                            className="mt-1 accent-black"
                                                        />
                                                        <span>
                                                            <span className="block font-medium">{permission.name}</span>
                                                            {permission.description && (
                                                                <span className="text-xs text-gray-500">
                                                                    {permission.description}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </label>
                                                ))}
                                                {permissions.length === 0 && (
                                                    <p className="text-sm text-gray-500">No permissions found.</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            <button type="submit" disabled={saving} className={buttonClass}>
                                                {saving ? "Saving..." : roleForm.id ? "Update Role" : "Create Role"}
                                            </button>
                                            {roleForm.id && (
                                                <button type="button" onClick={resetRoleForm} className={secondaryButtonClass}>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>

                                    <div className="rounded-lg border border-gray-200 p-5">
                                        <h3 className="text-lg font-semibold">All Roles</h3>
                                        <div className="mt-4 space-y-3">
                                            {roles.map((role) => (
                                                <div key={role._id} className="rounded-md border border-gray-200 p-4">
                                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                                        <div>
                                                            <h4 className="font-semibold capitalize">{role.name}</h4>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {role.description || "No description"}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => editRole(role)} className={secondaryButtonClass}>
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => removeRole(role)}
                                                                disabled={["admin", "user"].includes(role.name.toLowerCase())}
                                                                className={deleteButtonClass}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                        Permissions
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {(role.permissions || []).map((permission) => (
                                                            <span key={permission._id} className="rounded-md border border-gray-200 px-2 py-1 text-xs">
                                                                {permission.name}
                                                            </span>
                                                        ))}
                                                        {(!role.permissions || role.permissions.length === 0) && (
                                                            <span className="text-sm text-gray-500">
                                                                No permissions assigned
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {roles.length === 0 && (
                                                <p className="text-sm text-gray-500">No roles found.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {tab === "permissions" && (
                            <section>
                                <h2 className="mb-5 text-xl font-semibold">Permission Management</h2>

                                <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
                                    <form onSubmit={savePermission} className="h-fit rounded-lg border border-gray-200 p-5">
                                        <h3 className="text-lg font-semibold">
                                            {permissionForm.id ? "Edit Permission" : "Create Permission"}
                                        </h3>

                                        <label className="mt-5 block text-sm font-medium">
                                            Permission Name
                                            <input
                                                value={permissionForm.name}
                                                onChange={(e) => setPermissionForm({
                                                    ...permissionForm,
                                                    name: e.target.value
                                                })}
                                                required
                                                placeholder="e.g. user.delete"
                                                className={inputClass}
                                            />
                                        </label>

                                        <label className="mt-4 block text-sm font-medium">
                                            Description
                                            <textarea
                                                value={permissionForm.description}
                                                onChange={(e) => setPermissionForm({
                                                    ...permissionForm,
                                                    description: e.target.value
                                                })}
                                                rows={3}
                                                className={inputClass}
                                            />
                                        </label>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            <button type="submit" disabled={saving} className={buttonClass}>
                                                {saving ? "Saving..." : permissionForm.id ? "Update Permission" : "Create Permission"}
                                            </button>
                                            {permissionForm.id && (
                                                <button type="button" onClick={resetPermissionForm} className={secondaryButtonClass}>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>

                                    <div className="rounded-lg border border-gray-200 p-5">
                                        <h3 className="text-lg font-semibold">All Permissions</h3>
                                        <div className="mt-4 space-y-3">
                                            {permissions.map((permission) => (
                                                <div key={permission._id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-200 p-4">
                                                    <div>
                                                        <h4 className="font-medium">{permission.name}</h4>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {permission.description || "No description"}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => editPermission(permission)} className={secondaryButtonClass}>
                                                            Edit
                                                        </button>
                                                        <button onClick={() => removePermission(permission)} className={deleteButtonClass}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {permissions.length === 0 && (
                                                <p className="text-sm text-gray-500">No permissions found.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <section>
                        <div className="rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold">My Account</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Your dashboard features depend on your assigned role.
                            </p>
                            <p className="mt-3 text-sm">Email: {user?.email}</p>
                            <p className="mt-1 text-sm">Role: {roleName}</p>
                        </div>

                        {isModerator && (
                            <>
                                <div className="mt-6 rounded-lg border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold">
                                        {editingProductId ? "Edit Product" : "Add New Product"}
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Enter the product details below.
                                    </p>

                                    <form onSubmit={saveProduct} className="mt-6 space-y-5">
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <label className="block text-sm font-medium">
                                                Product Name
                                                <input
                                                    value={productForm.name}
                                                    onChange={(e) => setProductForm({
                                                        ...productForm,
                                                        name: e.target.value
                                                    })}
                                                    required
                                                    className={inputClass}
                                                />
                                            </label>

                                            <label className="block text-sm font-medium">
                                                Category
                                                <input
                                                    value={productForm.category}
                                                    onChange={(e) => setProductForm({
                                                        ...productForm,
                                                        category: e.target.value
                                                    })}
                                                    placeholder="e.g. Shirts, Trousers, Suits"
                                                    required
                                                    className={inputClass}
                                                />
                                            </label>
                                        </div>

                                        <label className="block text-sm font-medium">
                                            Description
                                            <textarea
                                                value={productForm.description}
                                                onChange={(e) => setProductForm({
                                                    ...productForm,
                                                    description: e.target.value
                                                })}
                                                rows={4}
                                                required
                                                className={inputClass}
                                            />
                                        </label>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <label className="block text-sm font-medium">
                                                Price
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={productForm.price}
                                                    onChange={(e) => setProductForm({
                                                        ...productForm,
                                                        price: e.target.value
                                                    })}
                                                    required
                                                    className={inputClass}
                                                />
                                            </label>

                                            <label className="block text-sm font-medium">
                                                Currency
                                                <select
                                                    value={productForm.currency}
                                                    onChange={(e) => setProductForm({
                                                        ...productForm,
                                                        currency: e.target.value
                                                    })}
                                                    className={inputClass}
                                                >
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="GBP">GBP (£)</option>
                                                    <option value="BDT">BDT (৳)</option>
                                                </select>
                                            </label>
                                        </div>

                                        <label className="block text-sm font-medium">
                                            Product Image URL
                                            <input
                                                type="url"
                                                value={productForm.image}
                                                onChange={(e) => setProductForm({
                                                    ...productForm,
                                                    image: e.target.value
                                                })}
                                                placeholder="https://example.com/product.jpg"
                                                required
                                                className={inputClass}
                                            />
                                        </label>

                                        {productForm.image && (
                                            <div>
                                                <p className="mb-2 text-sm font-medium">Image Preview</p>
                                                <img
                                                    src={productForm.image}
                                                    alt="Product preview"
                                                    className="h-40 w-40 rounded-md border border-gray-200 object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                    onLoad={(e) => {
                                                        e.currentTarget.style.display = "block";
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            <button type="submit" disabled={productSaving} className={buttonClass}>
                                                {productSaving
                                                    ? "Saving..."
                                                    : editingProductId
                                                        ? "Update Product"
                                                        : "Add Product"}
                                            </button>

                                            {editingProductId && (
                                                <button
                                                    type="button"
                                                    onClick={cancelProductEdit}
                                                    className={secondaryButtonClass}
                                                >
                                                    Cancel Edit
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                <div className="mt-6 rounded-lg border border-gray-200 p-6">
                                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <h2 className="text-xl font-semibold">All Products</h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                View, edit or delete products.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => loadProducts().catch((err) => setError(err.message))}
                                            className={secondaryButtonClass}
                                        >
                                            Refresh Products
                                        </button>
                                    </div>

                                    <p className="mb-4 text-sm text-gray-500">
                                        Total Products: {products.length}
                                    </p>

                                    {products.length === 0 ? (
                                        <p className="py-8 text-center text-gray-500">
                                            No products found.
                                        </p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[750px] text-left text-sm">
                                                <thead className="border-b border-gray-200 bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3">Product</th>
                                                        <th className="px-4 py-3">Category</th>
                                                        <th className="px-4 py-3">Price</th>
                                                        <th className="px-4 py-3">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {products.map((product) => (
                                                        <tr key={product._id}>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        src={product.image}
                                                                        alt={product.name}
                                                                        className="h-14 w-14 rounded object-cover"
                                                                    />
                                                                    <div>
                                                                        <p className="font-medium">{product.name}</p>
                                                                        <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                                                                            {product.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">{product.category}</td>
                                                            <td className="whitespace-nowrap px-4 py-3">
                                                                {product.currency === "BDT"
                                                                    ? "৳"
                                                                    : product.currency === "EUR"
                                                                        ? "€"
                                                                        : product.currency === "GBP"
                                                                            ? "£"
                                                                            : "$"}
                                                                {product.price}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => editProduct(product)}
                                                                        className={secondaryButtonClass}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeProduct(product)}
                                                                        className={deleteButtonClass}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {!isModerator && (
                            <div className="mt-6 rounded-lg border border-gray-200 p-6">
                                <p className="text-sm text-gray-600">
                                    No additional dashboard features are available for your current role.
                                </p>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
