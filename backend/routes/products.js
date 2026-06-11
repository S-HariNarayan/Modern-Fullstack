const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   GET api/products
// @desc    Get all products (with optional search and category filters)
// @access  Public
router.get('/', async (req, res) => {
  const { category, search, sort } = req.query;
  let query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  try {
    let productsQuery = Product.find(query);

    // Sorting options
    if (sort === 'price_asc') {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      productsQuery = productsQuery.sort({ price: -1 });
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 }); // default newest first
    }

    const products = await productsQuery;
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/products/:id
// @desc    Get single product details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/products
// @desc    Create a product (Admin only)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  try {
    // Check if requesting user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized: Admin only' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
      stock
    });

    const product = await newProduct.save();

    try {
      const newNotification = new Notification({
        user: null,
        title: 'New Product Added! 🍎',
        message: `Fresh ${product.name} is now available in category ${product.category}. Shop now!`,
        type: 'new_product',
        link: `/products/${product._id.toString()}`
      });
      await newNotification.save();
    } catch (notifErr) {
      console.error('Error creating product notification:', notifErr.message);
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/products/:id
// @desc    Update a product (Admin only)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  try {
    // Check if requesting user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized: Admin only' });
    }

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (image) product.image = image;
    if (stock !== undefined) product.stock = stock;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if requesting user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Not authorized: Admin only' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
