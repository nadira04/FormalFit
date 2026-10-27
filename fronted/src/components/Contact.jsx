
import React, { useState } from "react";

const Contact = ({ showToast }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [sending, setSending] = useState(false);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            showToast("Please fill in all required fields", "error");
            return;
        }

        setSending(true);

        // Frontend demonstration only. No message is sent to a server.
        setTimeout(() => {
            setSending(false);
            showToast(
                "Form validated. Connect a backend to send your message.",
                "success"
            );
            setForm({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
        }, 400);
    };

    const inputClass =
        "mt-2 w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500";

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
            <div className="mb-12 text-center">
                <p className="mb-3 text-sm tracking-[0.25em] text-pink-500">
                    GET IN TOUCH
                </p>
                <h1 className="text-4xl font-semibold">
                    Contact <span className="text-pink-500">Us</span>
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500">
                    Have a question or suggestion about FormalFit? Fill out the form
                    below and let us know.
                </p>
            </div>

            <div className="grid gap-10 md:grid-cols-2">
                <div className="bg-gray-50 p-8 sm:p-10">
                    <h2 className="text-2xl font-semibold">We'd love to hear from you</h2>
                    <p className="mt-4 leading-7 text-gray-600">
                        Contact us with questions, feedback, or suggestions about your
                        shopping experience.
                    </p>

                    <div className="mt-8 space-y-6">
                        <div>
                            <h3 className="font-medium">Website</h3>
                            <p className="mt-1 text-sm text-gray-500">FormalFit Online Store</p>
                        </div>

                        <div>
                            <h3 className="font-medium">Support</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Use the contact form to prepare your message.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="contact-name" className="text-sm font-medium">
                            Full Name *
                        </label>
                        <input
                            id="contact-name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-email" className="text-sm font-medium">
                            Email Address *
                        </label>
                        <input
                            id="contact-email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-subject" className="text-sm font-medium">
                            Subject
                        </label>
                        <input
                            id="contact-subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="What is this about?"
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-message" className="text-sm font-medium">
                            Message *
                        </label>
                        <textarea
                            id="contact-message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            className={inputClass}
                            rows="5"
                            placeholder="Write your message..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full rounded-md bg-black px-6 py-3 font-medium text-white transition hover:bg-pink-500 disabled:opacity-60"
                    >
                        {sending ? "Please wait..." : "Submit Message"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
