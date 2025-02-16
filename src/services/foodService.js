const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Food = require('../models/foodModel');
const connectDB = require('../config/db');

const importFoodData = async (filePath) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const foodItems = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        foodItems.push({
          name: row['name'],
          ingredients: row['ingredients'],
          cook_time: parseInt(row['cook_time']),
          prep_time: parseInt(row['prep_time']),          
          region: row['region'] || "Unknown",
          course: row['course'] || "Unknown",
          diet: row['diet'] || "Unknown",      
          flavor_profile: row['flavor_profile'] || "Unknown", 
          state: row['state'] || "Unknown" 

        });
      })
      .on('end', async () => {
        try {
          await Food.insertMany(foodItems);
          console.log("✅ CSV data imported successfully!");
        } catch (error) {
          console.error("❌ Error inserting data into MongoDB:", error.message);
        }
      });
  } catch (error) {
    console.error("❌ Error processing CSV:", error.message);
  }
};

module.exports = importFoodData;


