const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/epic-grocery';

async function syncProducts(uri, label) {
  try {
    console.log(`Sync: Connecting to ${label}...`);
    await mongoose.connect(uri);
    console.log(`Sync: Connected successfully.`);

    // Fetch all products from database (excluding mongoose version key and timestamps)
    const products = await Product.find({}, { __v: 0, createdAt: 0, updatedAt: 0 }).lean();
    console.log(`Sync: Found ${products.length} products in database.`);

    if (products.length === 0) {
      console.warn('Sync: Warning! No products found in the database. Aborting to avoid clearing products.json.');
      await mongoose.connection.close();
      return true;
    }

    // Write to products.json
    const filePath = path.join(__dirname, 'products.json');
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    console.log(`Sync: Successfully wrote products to ${filePath}`);

    await mongoose.connection.close();
    return true;
  } catch (err) {
    console.error(`Sync error on ${label}:`, err.message);
    return false;
  }
}

async function run() {
  const success = await syncProducts(MONGODB_URI, 'primary URI / Atlas');
  if (!success) {
    console.log('Sync: Attempting local MongoDB fallback...');
    await syncProducts('mongodb://127.0.0.1:27017/epic-grocery', 'local MongoDB');
  }
  process.exit(0);
}

run();
