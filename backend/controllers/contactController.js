const Contact = require("../models/Contact");

const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                message: "Name, email and message are required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        const contact = await Contact.create({
            name,
            email,
            subject: subject || "No Subject",
            message
        });

        res.status(201).json({
            message: "Your message has been sent successfully",
            contact
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({
            createdAt: -1
        });

        const totalMessages = await Contact.countDocuments();

        const unreadMessages = await Contact.countDocuments({
            status: "Unread"
        });

        res.status(200).json({
            totalMessages,
            unreadMessages,
            contacts
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Read", "Unread"].includes(status)) {
            return res.status(400).json({
                message: "Invalid message status"
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            message: "Message status updated successfully",
            contact
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            message: "Message deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createContact,
    getContacts,
    updateContactStatus,
    deleteContact
};