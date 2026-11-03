import React, { useState } from "react";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccess("");
        setError("");

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.message.trim()
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        setSending(true);

        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    subject: form.subject.trim(),
                    message: form.message.trim()
                })
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to send your message."
                );
            }

            setSuccess(
                result.message || "Your message has been sent successfully!"
            );

            setForm({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const inputClass =
        "mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black";

    return (
        <section className="bg-white px-4 py-16 text-gray-900 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                        GET IN TOUCH
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Contact Us
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
                        Have a question or need assistance? Send us a message
                        and our team will get back to you.
                    </p>
                </div>

                <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-200 p-6 shadow-sm sm:p-8">
                    {success && (
                        <div className="mb-5 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="block text-sm font-medium">
                                Your Name
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                    className={inputClass}
                                />
                            </label>

                            <label className="block text-sm font-medium">
                                Email Address
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                    className={inputClass}
                                />
                            </label>
                        </div>

                        <label className="block text-sm font-medium">
                            Subject
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="Enter message subject"
                                className={inputClass}
                            />
                        </label>

                        <label className="block text-sm font-medium">
                            Message
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Write your message here..."
                                rows={6}
                                required
                                className={inputClass}
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {sending ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;