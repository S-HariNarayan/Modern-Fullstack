const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const defaultProducts = require('./products.json');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/epic-grocery';

async function seedDatabase(uri, label) {
  try {
    console.log(`Seed: Connecting to ${label}...`);
    await mongoose.connect(uri);
    console.log(`Seed: Connected successfully to ${label}.`);

    // Clear existing products
    await Product.deleteMany({});
    console.log('Seed: Cleared old products.');

    // Insert new products
    await Product.insertMany(defaultProducts);
    console.log('Seed: Successfully seeded products database.');

    await mongoose.connection.close();
    console.log('Seed: Connection closed.');
    return true;
  } catch (err) {
    console.error(`Seed: Failed to seed ${label}:`, err.message);
    return false;
  }
}

async function run() {
  const success = await seedDatabase(MONGODB_URI, 'primary URI / Atlas');
  if (!success) {
    console.log('Seed: Attempting local MongoDB fallback seeding...');
    const localSuccess = await seedDatabase('mongodb://127.0.0.1:27017/epic-grocery', 'local MongoDB');
    if (!localSuccess) {
      console.error('Seed: Both Atlas and local MongoDB seed attempts failed.');
      process.exit(1);
    }
  }
  process.exit(0);
}

run();
