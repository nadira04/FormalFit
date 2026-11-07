const Subscriber = require("../models/Subscriber");
const nodemailer = require("nodemailer");

// Gmail transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
};

// Send Welcome Email
const sendWelcomeEmail = async (email) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        throw new Error("Gmail credentials are missing.");
    }

    const transporter = createTransporter();

    const mailOptions = {
        from: `"FormalFit" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to FormalFit Newsletter! 🎉",

        text: `Welcome to FormalFit!

Thank you for subscribing to our newsletter.

You will receive updates about our latest collections, fashion trends, special offers, and exclusive discounts.

Stay stylish with FormalFit!

Best Regards,
FormalFit Team`,

        html: `
            <div style="
                max-width: 600px;
                margin: auto;
                padding: 30px;
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                color: #333;
                border-radius: 10px;
            ">
                <h1 style="color: #2f7d3c; text-align: center;">
                    Welcome to FormalFit!
                </h1>

                <h2 style="text-align: center;">
                    Thank You for Subscribing! 🎉
                </h2>

                <p style="font-size: 16px; line-height: 1.7;">
                    We're excited to have you as part of our community.
                </p>

                <p style="font-size: 16px; line-height: 1.7;">
                    You'll receive updates about our latest collections,
                    fashion trends, special offers, and exclusive discounts.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a
                        href="https://formal-fit.vercel.app/"
                        style="
                            background-color: #2f7d3c;
                            color: white;
                            padding: 12px 25px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        "
                    >
                        Visit FormalFit
                    </a>
                </div>

                <p style="text-align: center; color: #777;">
                    Stay Stylish with FormalFit!
                </p>

                <hr style="border: 1px solid #ddd;">

                <p style="
                    text-align: center;
                    font-size: 12px;
                    color: #999;
                ">
                    © ${new Date().getFullYear()} FormalFit. All rights reserved.
                </p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};


// Create Subscription
const createSubscription = async (req, res) => {
    try {
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate email
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Check duplicate email
        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            return res.status(409).json({
                success: false,
                message: "This email is already subscribed."
            });
        }

        // Save subscriber to MongoDB
        const newSubscriber = await Subscriber.create({ email });

        // Send welcome email
        try {
            await sendWelcomeEmail(email);

            return res.status(201).json({
                success: true,
                emailSent: true,
                message: "Successfully subscribed! Please check your email."
            });

        } catch (emailError) {
            console.error("Welcome Email Error:", emailError);

            return res.status(201).json({
                success: true,
                emailSent: false,
                message: "Subscription successful, but the welcome email could not be sent."
            });
        }

    } catch (error) {
        console.error("Subscription Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This email is already subscribed."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};


// Get All Subscribers (For Admin Dashboard)
const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
            .select("email createdAt")
            .sort({ createdAt: -1 });

        const totalSubscribers = await Subscriber.countDocuments();

        return res.status(200).json({
            success: true,
            totalSubscribers,
            subscribers
        });

    } catch (error) {
        console.error("Get Subscribers Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch subscribers."
        });
    }
};


module.exports = {
    createSubscription,
    getSubscribers
};