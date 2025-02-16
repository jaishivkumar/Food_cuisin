const Food = require('../models/foodModel');
const importFoodData = require('../services/foodService');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../middleware/logger");
require('dotenv').config()



let dataLoaded = false;
const filePath = './src/data/indian_food.csv';

const loadDataIfNeeded = async () => {
  if (!dataLoaded) {
    const count = await Food.countDocuments();
    if (count === 0) {
      logger.info("No data in MongoDB. Importing from CSV...");
      await importFoodData(filePath);
    }
    dataLoaded = true;
  }
};

// Helper function to build MongoDB query from LHS bracket notation
const buildNumericQuery = (query, allowedFields) => {
  const mongoQuery = {};
  allowedFields.forEach(field => {
    if (query[field] && typeof query[field] === 'object') {
      const operators = {};
      if (query[field].gte) operators.$gte = Number(query[field].gte);
      if (query[field].lte) operators.$lte = Number(query[field].lte);
      if (query[field].gt) operators.$gt = Number(query[field].gt);
      if (query[field].lt) operators.$lt = Number(query[field].lt);
      mongoQuery[field] = operators;
    }
  });
  return mongoQuery;
};

const getAllDishes = async (req, res) => {
  await loadDataIfNeeded();
  try {
    logger.info("Fetching all dishes...");

 
    const allowedFields = ["cook_time", "prep_time"];
    const numericQuery = buildNumericQuery(req.query, allowedFields);

    const otherFilters = {};
    if (req.query.course) otherFilters.course = req.query.course;
    const query = { ...otherFilters, ...numericQuery };

    const dishes = await Food.find(query);
    logger.info(`✅ Fetched ${dishes.length} dishes successfully.`);
    
    res.json(dishes);
  } catch (error) {
    logger.error(`❌ Error fetching dishes: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch dishes" });
  }
};
/**
 * Get dish by name
 */
const getDishById = async (req, res) => {
  try {
    logger.info(`Fetching dish with ID: ${req.params.id}`);
    const dish = await Food.findById(req.params.id);
    if (!dish) {
      logger.warn("❌ Dish not found.");
      return res.status(404).json({ message: "Dish not found" });
    }
    logger.info("✅ Dish fetched successfully.");
    res.json(dish);
  } catch (error) {
    logger.error(`❌ Error fetching dish: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch dish" });
  }
};



/**
 * Find dishes that can be made with given ingredients
 */

const getDishesByAvailableIngredients = async (req, res) => {
  try {
    const { ingredients } = req.query;

    logger.info(`Received request to fetch dishes with ingredients: ${ingredients}`);

    if (!ingredients) {
      logger.warn("No ingredients provided in the request query.");
      return res.status(400).json({ message: "Please provide at least one ingredient." });
    }

    // Convert the ingredients list into an array
    const ingredientList = ingredients.split(",").map(ing => ing.trim());
    logger.info(`Converted ingredients to array: [${ingredientList.join(", ")}]`);

    // Find dishes where all ingredients exist in the provided list
    const dishes = await Food.find({ ingredients: { $all: ingredientList } });
    logger.info(`Found ${dishes.length} matching dishes`);

    if (dishes.length === 0) {
      logger.warn("No matching dishes found with the given ingredients.");
      return res.status(404).json({ message: "No matching dishes found with the given ingredients." });
    }

    res.json({ totalDishes: dishes.length, items: dishes });
  } catch (error) {
    logger.error("❌ Error fetching dishes:", error.message);
    res.status(500).json({ error: "Failed to fetch dishes", details: error.message });
  }
};




const getDishesByRegion = async (req, res) => {
  try {
    const { sort_by, order, max_cook_time, include_ingredient, exclude_ingredient, count, flavor_profile } = req.query;

    logger.info("Received getDishesByRegion request", { query: req.query });

    if (!flavor_profile) {
      logger.warn("Flavor profile not provided in query.");
      return res.status(400).json({ message: "Please provide a search query." });
    }

    // Search Conditions
    let searchConditions = {
      flavor_profile: { $regex: flavor_profile, $options: "i" }
    };

    // Apply additional filters if provided
    if (max_cook_time) {
      searchConditions.cook_time = { $lte: parseInt(max_cook_time, 10) };
      logger.info(`Added max_cook_time filter: ${max_cook_time}`);
    }

    if (include_ingredient) {
      searchConditions.ingredients = { $in: include_ingredient.split(",").map(i => i.trim()) };
      logger.info(`Added include_ingredient filter: ${include_ingredient}`);
    }

    if (exclude_ingredient) {
      // If there are already ingredients filters, add $nin to the existing object; otherwise, create one.
      if (!searchConditions.ingredients) {
        searchConditions.ingredients = {};
      }
      searchConditions.ingredients.$nin = exclude_ingredient.split(",").map(i => i.trim());
      logger.info(`Added exclude_ingredient filter: ${exclude_ingredient}`);
    }

    // Sorting logic
    let sortCondition = {};
    if (sort_by) {
      sortCondition[sort_by] = order === "desc" ? -1 : 1;
      logger.info(`Sorting by: ${sort_by} in ${order} order`);
    }

    // Fetch dishes using the `Food` model
    const dishes = await Food.find(searchConditions).sort(sortCondition);
    logger.info(`Found ${dishes.length} matching dishes.`);

    if (dishes.length === 0) {
      logger.warn("No matching dishes found.");
      return res.status(404).json({ message: "No matching dishes found." });
    }

    // If count=true, include total count in response
    if (count === "true") {
      logger.info("Count parameter is true, returning count along with items.");
      return res.json({
        totalDishes: dishes.length,
        items: dishes
      });
    }

    res.json(dishes);
  } catch (error) {
    logger.error("❌ Search API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch dish", details: error.message });
  }
};








// create  ingredient 

const addDish = async (req, res) => {
  try {
    const { name, ingredients, password, region, course, diet, flavor_profile, state } = req.body;
    
    logger.info("Received request to add a new dish", { name, ingredients, region, course, diet, flavor_profile, state });

    if (!name || !ingredients || !password) {
      logger.warn("Missing required fields: name, ingredients, or password.");
      return res.status(400).json({ message: "Name, ingredients, and password are required." });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDish = new Food({
      name,
      ingredients,
      password: hashedPassword,
      region,
      course,
      diet,
      flavor_profile,
      state
    });

    await newDish.save();
    logger.info("Dish added successfully", { dishId: newDish._id });

    res.status(201).json({ message: "Dish added successfully", dish: newDish });
  } catch (error) {
    logger.error("Error adding dish:", error.message);
    res.status(500).json({ error: "Failed to add dish.", details: error.message });
  }
};
// login 

const login = async (req, res) => {
  try {
    const { name, password } = req.body;
    logger.info("Login attempt", { name });

    if (!name || !password) {
      logger.warn("Missing required fields for login", { name });
      return res.status(400).json({ message: "Name and password are required." });
    }

    // Find dish by name
    const dish = await Food.findOne({ name });
    if (!dish) {
      logger.warn(`Dish not found for login: ${name}`);
      return res.status(404).json({ message: "Dish not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, dish.password);
    if (!isMatch) {
      logger.warn(`Invalid credentials provided for: ${name}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: dish._id, name: dish.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    logger.info("Login successful", { name });

    res.json({ message: "Login successful", token });
  } catch (error) {
    logger.error("Login failed", { error: error.message, name: req.body.name });
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

// Update dish ingredients with logging
const updateDishIngredients = async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredients } = req.body;
    logger.info("Update dish ingredients request", { id, ingredients });

    if (!ingredients) {
      logger.warn("Invalid input: Ingredients missing for update", { id });
      return res.status(400).json({ message: "Invalid input. Ingredients must be an array." });
    }

    const updatedDish = await Food.findByIdAndUpdate(id, { ingredients }, { new: true });

    if (!updatedDish) {
      logger.warn(`Dish not found for update`, { id });
      return res.status(404).json({ message: "Dish not found" });
    }

    logger.info("Dish updated successfully", { id });
    res.json({ message: "Dish updated successfully", dish: updatedDish });
  } catch (error) {
    logger.error("Error updating dish", { error: error.message, id: req.params.id });
    res.status(500).json({ error: "Failed to update dish", details: error.message });
  }
};

// Delete dish with logging
const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info("Delete dish request", { id });

    const deletedDish = await Food.findByIdAndDelete(id);

    if (!deletedDish) {
      logger.warn(`Dish not found for deletion`, { id });
      return res.status(404).json({ message: "Dish not found" });
    }

    logger.info("Dish deleted successfully", { id });
    res.json({ message: "Dish deleted successfully" });
  } catch (error) {
    logger.error("Error deleting dish", { error: error.message, id: req.params.id });
    res.status(500).json({ error: "Failed to delete dish", details: error.message });
  }
};

module.exports = {
  
  getAllDishes,
  getDishById,
  getDishesByAvailableIngredients,
  addDish,
  login,
  updateDishIngredients,
  deleteDish,
  getDishesByRegion
};
