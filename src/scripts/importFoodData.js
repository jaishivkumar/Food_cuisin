require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const importFoodData = require('../services/foodService');

const filePath = './src/data/indian_food.csv'; 

const startImport = async () => {
  await connectDB();
  await importFoodData(filePath);
  mongoose.connection.close();
};


startImport();
