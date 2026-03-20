const Contact = require("../models/Contact");

const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await Contact.create({ name, email, message });

        res.status(201).json({ message: "Message sent successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json(contacts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitContact, getAllContacts };