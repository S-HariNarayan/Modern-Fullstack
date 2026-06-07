const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { fullName, email, mobile, password, address } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    user = new User({
      fullName,
      email,
      mobile,
      password,
      address: address || ""
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // If first user, make admin (for testing purposes, or keep default false)
    const count = await User.countDocuments();
    if (count === 0) {
      user.isAdmin = true;
    }

    await user.save();

    // Create JWT token
    const payload = {
      id: user.id,
      isAdmin: user.isAdmin
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecretjwtkey',
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            mobile: user.mobile,
            isAdmin: user.isAdmin,
            address: user.address
          }
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message || 'Server error occurred during registration' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      id: user.id,
      isAdmin: user.isAdmin
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecretjwtkey',
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            mobile: user.mobile,
            isAdmin: user.isAdmin,
            address: user.address
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Server error occurred during login' });
  }
});

// @route   POST api/auth/reset-password
// @desc    Reset password (Forget Password flow)
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'No registered account found with this email' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: err.message || 'Server error occurred during password reset' });
  }
});

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: err.message || 'Server error occurred while fetching profile' });
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { fullName, mobile, address, password } = req.body;

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;
    if (address !== undefined) user.address = address;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      address: user.address
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: err.message || 'Server error occurred while updating profile' });
  }
});

// @route   GET api/auth/users
// @desc    Get all users (Admin only)
// @access  Private
router.get('/users', auth, async (req, res) => {
  try {
    // Ensure requesting user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized: Admin only' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: err.message || 'Server error occurred while fetching users' });
  }
});

// @route   PUT api/auth/users/:id/role
// @desc    Toggle user admin role (Admin only)
// @access  Private
router.put('/users/:id/role', auth, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized: Admin only' });
    }

    let userToToggle = await User.findById(req.params.id);
    if (!userToToggle) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent toggling self
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot remove your own admin status' });
    }

    userToToggle.isAdmin = !userToToggle.isAdmin;
    await userToToggle.save();

    res.json({ message: `User role updated successfully. Admin role: ${userToToggle.isAdmin}`, user: userToToggle });
  } catch (err) {
    console.error('Toggle role error:', err);
    res.status(500).json({ message: err.message || 'Server error occurred while toggling user role' });
  }
});

module.exports = router;
