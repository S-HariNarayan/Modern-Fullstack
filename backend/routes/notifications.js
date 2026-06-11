const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/notifications
// @desc    Get all notifications for logged in user (personal + global)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { user: req.user.id },
        { user: null }
      ]
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user) {
      // Personal notification
      if (notification.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      notification.isRead = true;
    } else {
      // Global notification
      if (!notification.readBy.includes(req.user.id)) {
        notification.readBy.push(req.user.id);
      }
    }

    await notification.save();
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/notifications/offer
// @desc    Create a custom offer announcement (Admin only)
// @access  Private
router.post('/offer', auth, async (req, res) => {
  const { title, message, link, couponCode, discountPercentage } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: 'Please include title and message' });
  }

  try {
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized: Admin only' });
    }

    const newNotification = new Notification({
      user: null, // Global
      title,
      message,
      type: 'offer',
      link: link || '/products',
      couponCode: couponCode || '',
      discountPercentage: discountPercentage ? Number(discountPercentage) : 0
    });

    const notification = await newNotification.save();
    res.status(201).json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/notifications/coupon/:code
// @desc    Validate a coupon code and get discount details
// @access  Private
router.get('/coupon/:code', auth, async (req, res) => {
  try {
    const code = req.params.code.trim();
    // Case-insensitive match on offer announcements having that couponCode
    const offer = await Notification.findOne({
      type: 'offer',
      couponCode: { $regex: new RegExp(`^${code}$`, 'i') }
    });

    if (!offer) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    res.json({
      couponCode: offer.couponCode,
      discountPercentage: offer.discountPercentage,
      title: offer.title
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/notifications/:id
// @desc    Delete a notification/offer (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized: Admin only' });
    }

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.deleteOne({ _id: req.params.id });
    res.json({ message: 'Notification / offer removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
