
import React, { useCallback, useEffect, useState } from "react";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const Dashboard = ({ user, onBack }) => {
    const [tab, setTab] = useState("roles");
    const [stats, setStats] = useState({});
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [roleForm, setRoleForm] = useState({
        id: "",
        name: "",
        description: "",
        permissions: []
    });

    const [permissionForm, setPermissionForm] = useState({
        id: "",
        name: "",
        description: ""
    });

    const token = localStorage.getItem("token");
    const rolesOfUser = (user?.roles || []).map((role) =>
        typeof role === "string" ? role.toLowerCase() : role?.name?.toLowerCase()
    );

    const isAdmin = rolesOfUser.includes("admin");
    const roleName = isAdmin
        ? "Admin"
        : rolesOfUser.includes("moderator")
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

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            if (isAdmin) {
                const [dashboardData, roleData, permissionData] = await Promise.all([
                    apiRequest("/dashboard"),
                    apiRequest("/roles"),
                    apiRequest("/permissions")
                ]);

                setStats(dashboardData);
                setRoles(roleData);
                setPermissions(permissionData);
            } else {
                setRoles([]);
                setPermissions([]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, isAdmin]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const showNotice = (message) => {
        setNotice(message);
        setError("");
    };

    const resetRoleForm = () => {
        setRoleForm({
            id: "",
            name: "",
            description: "",
            permissions: []
        });
    };

    const resetPermissionForm = () => {
        setPermissionForm({
            id: "",
            name: "",
            description: ""
        });
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
            const path = editing ? `/roles/${roleForm.id}` : "/roles";

            const result = await apiRequest(path, {
                method: editing ? "PUT" : "POST",
                body: JSON.stringify({
                    name: roleForm.name,
                    description: roleForm.description,
                    permissions: roleForm.permissions
                })
            });

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
            permissions: (role.permissions || []).map((permission) => permission._id)
        });

        setTab("roles");
        setNotice("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
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
            if (roleForm.id === role._id) resetRoleForm();
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
            const path = editing
                ? `/permissions/${permissionForm.id}`
                : "/permissions";

            const result = await apiRequest(path, {
                method: editing ? "PUT" : "POST",
                body: JSON.stringify({
                    name: permissionForm.name,
                    description: permissionForm.description
                })
            });

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
        setNotice("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const removePermission = async (permission) => {
        if (!window.confirm(`Delete "${permission.name}"?`)) return;

        setError("");
        setNotice("");

        try {
            const result = await apiRequest(`/permissions/${permission._id}`, {
                method: "DELETE"
            });

            showNotice(result.message || "Permission deleted successfully");
            if (permissionForm.id === permission._id) resetPermissionForm();
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-[70vh] bg-gray-50 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <button
                    onClick={onBack}
                    className="mb-6 text-sm text-gray-600 hover:text-pink-600"
                >
                    ← Back to Home
                </button>

                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-wider text-pink-600">
                            FormalFit Control Panel
                        </p>
                        <h1 className="mt-2 text-3xl font-bold">
                            {roleName} Dashboard
                        </h1>
                        <p className="mt-2 text-gray-500">
                            Welcome, {user?.name || "User"}
                        </p>
                    </div>

                    <button
                        onClick={loadData}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {notice && (
                    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {notice}
                    </div>
                )}

                {loading ? (
                    <p className="mt-8 text-gray-500">Loading dashboard...</p>
                ) : !isAdmin ? (
                    <div className="mt-8 rounded-xl border bg-white p-6">
                        <h2 className="text-xl font-semibold">My Account</h2>
                        <p className="mt-2 text-gray-600">
                            Your dashboard and features depend on your assigned role.
                        </p>
                        <p className="mt-3 text-sm text-gray-500">
                            Email: {user?.email}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            {[
                                ["Total Users", stats.totalUsers],
                                ["Total Roles", stats.totalRoles],
                                ["Total Permissions", stats.totalPermissions]
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-xl border bg-white p-5 shadow-sm">
                                    <p className="text-sm text-gray-500">{label}</p>
                                    <p className="mt-2 text-3xl font-bold">
                                        {value ?? 0}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3 border-b">
                            <button
                                onClick={() => setTab("roles")}
                                className={`border-b-2 px-4 py-3 text-sm font-medium ${tab === "roles"
                                    ? "border-pink-500 text-pink-600"
                                    : "border-transparent text-gray-500"
                                    }`}
                            >
                                Role Management
                            </button>

                            <button
                                onClick={() => setTab("permissions")}
                                className={`border-b-2 px-4 py-3 text-sm font-medium ${tab === "permissions"
                                    ? "border-pink-500 text-pink-600"
                                    : "border-transparent text-gray-500"
                                    }`}
                            >
                                Permission Management
                            </button>
                        </div>

                        {tab === "roles" && (
                            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
                                <form
                                    onSubmit={saveRole}
                                    className="h-fit rounded-xl border bg-white p-5 shadow-sm"
                                >
                                    <h2 className="text-xl font-semibold">
                                        {roleForm.id ? "Edit Role" : "Create Role"}
                                    </h2>

                                    <label className="mt-5 block text-sm font-medium">
                                        Role name
                                    </label>
                                    <input
                                        value={roleForm.name}
                                        onChange={(e) =>
                                            setRoleForm({ ...roleForm, name: e.target.value })
                                        }
                                        placeholder="e.g. support"
                                        required
                                        className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-pink-500"
                                    />

                                    <label className="mt-4 block text-sm font-medium">
                                        Description
                                    </label>
                                    <textarea
                                        value={roleForm.description}
                                        onChange={(e) =>
                                            setRoleForm({
                                                ...roleForm,
                                                description: e.target.value
                                            })
                                        }
                                        placeholder="Describe this role"
                                        rows={3}
                                        className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-pink-500"
                                    />

                                    <div className="mt-5">
                                        <p className="text-sm font-medium">
                                            Assign permissions
                                        </p>

                                        {permissions.length === 0 ? (
                                            <p className="mt-2 text-sm text-gray-500">
                                                Create permissions first.
                                            </p>
                                        ) : (
                                            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-lg border p-3">
                                                {permissions.map((permission) => (
                                                    <label
                                                        key={permission._id}
                                                        className="flex cursor-pointer items-start gap-2 text-sm"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={roleForm.permissions.includes(permission._id)}
                                                            onChange={() => togglePermission(permission._id)}
                                                            className="mt-1 accent-pink-500"
                                                        />
                                                        <span>
                                                            <span className="block font-medium">
                                                                {permission.name}
                                                            </span>
                                                            {permission.description && (
                                                                <span className="text-xs text-gray-500">
                                                                    {permission.description}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                        >
                                            {saving
                                                ? "Saving..."
                                                : roleForm.id
                                                    ? "Update Role"
                                                    : "Create Role"}
                                        </button>

                                        {roleForm.id && (
                                            <button
                                                type="button"
                                                onClick={resetRoleForm}
                                                className="rounded-lg border px-4 py-2 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>

                                <div className="rounded-xl border bg-white p-5 shadow-sm">
                                    <h2 className="text-xl font-semibold">All Roles</h2>

                                    <div className="mt-4 space-y-4">
                                        {roles.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                No roles found.
                                            </p>
                                        ) : (
                                            roles.map((role) => (
                                                <div
                                                    key={role._id}
                                                    className="rounded-lg border p-4"
                                                >
                                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                                        <div>
                                                            <h3 className="font-semibold capitalize">
                                                                {role.name}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {role.description || "No description"}
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-3 text-sm">
                                                            <button
                                                                onClick={() => editRole(role)}
                                                                className="font-medium text-blue-600 hover:underline"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => removeRole(role)}
                                                                disabled={["admin", "user"].includes(role.name)}
                                                                className="font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-300"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                                                        Permissions
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {(role.permissions || []).length === 0 ? (
                                                            <span className="text-sm text-gray-400">
                                                                No permissions assigned
                                                            </span>
                                                        ) : (
                                                            role.permissions.map((permission) => (
                                                                <span
                                                                    key={permission._id}
                                                                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                                                                >
                                                                    {permission.name}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {tab === "permissions" && (
                            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
                                <form
                                    onSubmit={savePermission}
                                    className="h-fit rounded-xl border bg-white p-5 shadow-sm"
                                >
                                    <h2 className="text-xl font-semibold">
                                        {permissionForm.id
                                            ? "Edit Permission"
                                            : "Create Permission"}
                                    </h2>

                                    <label className="mt-5 block text-sm font-medium">
                                        Permission name
                                    </label>
                                    <input
                                        value={permissionForm.name}
                                        onChange={(e) =>
                                            setPermissionForm({
                                                ...permissionForm,
                                                name: e.target.value
                                            })
                                        }
                                        placeholder="e.g. product.create"
                                        required
                                        className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-pink-500"
                                    />

                                    <label className="mt-4 block text-sm font-medium">
                                        Description
                                    </label>
                                    <textarea
                                        value={permissionForm.description}
                                        onChange={(e) =>
                                            setPermissionForm({
                                                ...permissionForm,
                                                description: e.target.value
                                            })
                                        }
                                        placeholder="Describe this permission"
                                        rows={3}
                                        className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-pink-500"
                                    />

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                        >
                                            {saving
                                                ? "Saving..."
                                                : permissionForm.id
                                                    ? "Update Permission"
                                                    : "Create Permission"}
                                        </button>

                                        {permissionForm.id && (
                                            <button
                                                type="button"
                                                onClick={resetPermissionForm}
                                                className="rounded-lg border px-4 py-2 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>

                                <div className="rounded-xl border bg-white p-5 shadow-sm">
                                    <h2 className="text-xl font-semibold">
                                        All Permissions
                                    </h2>

                                    <div className="mt-4 space-y-3">
                                        {permissions.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                No permissions found.
                                            </p>
                                        ) : (
                                            permissions.map((permission) => (
                                                <div
                                                    key={permission._id}
                                                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                                                >
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {permission.name}
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {permission.description || "No description"}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-3 text-sm">
                                                        <button
                                                            onClick={() => editPermission(permission)}
                                                            className="font-medium text-blue-600 hover:underline"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => removePermission(permission)}
                                                            className="font-medium text-red-600 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
