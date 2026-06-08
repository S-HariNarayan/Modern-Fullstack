const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// @route   POST api/contact
// @desc    Submit a contact form message
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    const savedContact = await newContact.save();
    res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully!',
      contact: savedContact
    });
  } catch (err) {
    console.error('[Contact Submit Error]:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Check if requesting user is admin
    const User = require('../models/User');
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized: Admin only' });
    }

    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('[Contact Fetch Error]:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
