const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware to diagnose API hits
app.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    // Clone and sanitize body to avoid logging plain passwords in console logs
    const debugBody = { ...req.body };
    if (debugBody.password) debugBody.password = '********';
    console.log('Body:', debugBody);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', require('./routes/notifications'));

// Health Check / API home
app.get('/', (req, res) => {
  res.json({ message: 'Epic Grocery API is running successfully' });
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/epic-grocery';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully to Atlas / primary URI');
  })
  .catch((err) => {
    console.error('MongoDB Atlas Connection Error:', err.message);
    console.log('Attempting local MongoDB fallback connection (mongodb://127.0.0.1:27017/epic-grocery)...');
    mongoose.connect('mongodb://127.0.0.1:27017/epic-grocery')
      .then(() => {
        console.log('Connected to local MongoDB successfully');
      })
      .catch((localErr) => {
        console.error('Local MongoDB fallback connection failed as well:', localErr.message);
      });
  });

// Start listening immediately so the server is up even if DB connection is in progress or falling back
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
