import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const AuthModal = ({
    mode,
    onClose,
    onSwitchMode,
    onSuccess,
    showToast
}) => {
    const isLogin = mode === "login";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

        if (!emailRegex.test(formData.email)) {
            showToast(
                "Please enter a valid email address",
                "error"
            );
            return;
        }

        if (!isLogin && !passwordRegex.test(formData.password)) {
            showToast(
                "Password must contain uppercase, lowercase and a number, and be at least 6 characters",
                "error"
            );
            return;
        }

        if (isLogin && formData.password.length === 0) {
            showToast(
                "Please enter your password",
                "error"
            );
            return;
        }

        if (!isLogin && formData.name.trim().length < 2) {
            showToast(
                "Please enter your name",
                "error"
            );
            return;
        }

        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const endpoint = isLogin
                ? `${API_URL}/api/auth/login`
                : `${API_URL}/api/auth/signup`;

            const body = isLogin
                ? {
                    email: formData.email,
                    password: formData.password
                }
                : {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Something went wrong"
                );
            }

            if (isLogin) {
                localStorage.setItem("token", data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                onSuccess(data.user);
            } else {
                showToast(
                    "Account created successfully",
                    "success"
                );

                setFormData({
                    name: "",
                    email: "",
                    password: ""
                });

                onSwitchMode("login");
            }

        } catch (error) {

            if (error.message === "Failed to fetch") {
                showToast(
                    "Server connection error",
                    "error"
                );
            } else {
                showToast(
                    error.message,
                    "error"
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="auth-overlay">

            <div className="auth-modal">

                <button
                    type="button"
                    className="auth-close"
                    onClick={onClose}
                >
                    <FiX />
                </button>

                <div className="auth-content">

                    <h2>
                        {isLogin
                            ? "Welcome Back"
                            : "Create Account"}
                    </h2>

                    <p className="auth-description">
                        {isLogin
                            ? "Login to continue with FormalFit"
                            : "Join FormalFit and discover your style"}
                    </p>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {!isLogin && (
                            <div className="auth-field">

                                <label>Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    required
                                />

                            </div>
                        )}

                        <div className="auth-field">

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />

                        </div>

                        <div className="auth-field">

                            <label>Password</label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete={
                                    isLogin
                                        ? "current-password"
                                        : "new-password"
                                }
                                required
                                minLength={6}
                            />

                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Please wait..."
                                : isLogin
                                    ? "Login"
                                    : "Create Account"}
                        </button>

                    </form>

                    <div className="auth-switch">

                        {isLogin ? (
                            <>
                                Don't have an account?

                                <button
                                    type="button"
                                    onClick={() =>
                                        onSwitchMode("signup")
                                    }
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?

                                <button
                                    type="button"
                                    onClick={() =>
                                        onSwitchMode("login")
                                    }
                                >
                                    Login
                                </button>
                            </>
                        )}

                    </div>

                </div>

            </div>

        </div>,
        document.body
    );
};

export default AuthModal;