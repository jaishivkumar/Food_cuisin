const express = require("express");
const { verifyToken } = require("../middleware/token");
const {
  getAllDishes,
  getDishById,
  addDish,
  login,
  updateDishIngredients,
  deleteDish,
  getDishesByRegion,
  getDishesByAvailableIngredients,
} = require("../controllers/foodController");
const { body, param, validationResult } = require("express-validator");

const router = express.Router();

// Custom middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * /dishes:
 *   get:
 *     summary: Get all dishes
 *     tags: [Dishes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all dishes
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get("/", 
  validate, verifyToken, getAllDishes);

  
/**
 * @swagger
 * /dishes/by-ingredients:
 *   get:
 *     summary: Retrieve dishes based on available ingredients.
 *     description: >
 *       Fetch all possible dishes that can be prepared using the provided list of ingredients.
 *       The ingredients should be provided as a comma-separated list in the query parameter.
 *     parameters:
 *       - in: query
 *         name: ingredients
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of available ingredients (e.g., "Rice flour,coconut,jaggery").
 *     responses:
 *       200:
 *         description: Dishes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDishes:
 *                   type: integer
 *                   example: 2
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Food'
 *       400:
 *         description: Ingredients query parameter is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please provide at least one ingredient."
 *       404:
 *         description: No matching dishes found with the given ingredients.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No matching dishes found with the given ingredients."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */

router.get(
  "/by-ingredients",
  validate, verifyToken,
  getDishesByAvailableIngredients
);



/**
 * @swagger
 * /dishes/add:
 *   post:
 *     summary: Add a new dish
 *     tags: [Dishes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Paneer Butter Masala"
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Paneer", "Tomato", "Cream"]
 *               password:
 *                 type: string
 *                 example: "password123"
 *               region:
 *                 type: string
 *                 example: "North India"
 *               course:
 *                 type: string
 *                 example: "Main Course"
 *               diet:
 *                 type: string
 *                 example: "Vegetarian"
 *               flavor_profile:
 *                 type: string
 *                 example: "Spicy"
 *               state:
 *                 type: string
 *                 example: "Punjab"
 *     responses:
 *       201:
 *         description: Dish added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dish added successfully"
 *                 dish:
 *                   $ref: '#/components/schemas/Food'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name, ingredients, and password are required."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to add dish."
 *                 details:
 *                   type: string
 *                   example: "Detailed error message"
 */

router.post(
  "/add",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("ingredients").isArray().withMessage("Ingredients must be an array"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate, 
  addDish
);

/**
 * @swagger
 * /dishes/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Login failed
 */
router.post(
  "/login",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

/**
 * @swagger
 * /dishes/update/{id}:
 *   put:
 *     summary: Update dish ingredients
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dish ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               ingredients: ["hhdddcccddd"]
 *     responses:
 *       200:
 *         description: Dish updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dish updated successfully"
 *                 dish:
 *                   $ref: '#/components/schemas/Food'
 *       404:
 *         description: Dish not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dish not found"
 */
router.put(
  "/update/:id",
  [
    // Validate that the 'id' is a valid MongoDB ObjectId
    param("id").isMongoId().withMessage("Invalid dish id"),
    body("ingredients").isArray().withMessage("Ingredients must be an array"),
  ],
  validate,
  verifyToken,
  updateDishIngredients
);



/**
 * @swagger
 * /dishes/deletedish/{id}:
 *   delete:
 *     summary: Delete a dish by ID
 *     description: Deletes a dish from the database using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The dish ID to delete.
 *     responses:
 *       200:
 *         description: Dish deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dish deleted successfully"
 *       404:
 *         description: Dish not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dish not found"
 *       500:
 *         description: Failed to delete dish.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */
router.delete(
  "/deletedish/:id",
  param("id").isMongoId().withMessage("Invalid dish id"),
  validate, verifyToken,
  deleteDish
);
/**
 * @swagger
 * /dishes/search:
 *   get:
 *     summary: "Get dishes based on filters"
 *     description: "Retrieve dishes based on various filters such as flavor profile, state, cooking time, and ingredients."
 *     parameters:
 *       - name: flavor_profile
 *         in: query
 *         description: "Filter dishes by flavor profile (e.g., sweet, spicy, sour, bitter)"
 *         schema:
 *           type: string
 *         example: "spicy"
 *       - name: state
 *         in: query
 *         description: "Filter dishes by state (e.g., Maharashtra, Tamil Nadu)"
 *         schema:
 *           type: string
 *         example: "Punjab"
 *       - name: sort_by
 *         in: query
 *         description: "Sort dishes by either prep_time or cook_time"
 *         schema:
 *           type: string
 *           enum: [prep_time, cook_time]
 *         example: "prep_time"
 *       - name: order
 *         in: query
 *         description: "Sort order (ascending or descending)"
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         example: "asc"
 *       - name: max_cook_time
 *         in: query
 *         description: "Filter dishes with a maximum cooking time (in minutes)"
 *         schema:
 *           type: integer
 *         example: 30
 *       - name: include_ingredient
 *         in: query
 *         description: "Filter dishes that contain a specific ingredient"
 *         schema:
 *           type: string
 *         example: "paneer"
 *       - name: exclude_ingredient
 *         in: query
 *         description: "Filter dishes that do not contain a specific ingredient"
 *         schema:
 *           type: string
 *         example: "garlic"
 *       - name: count
 *         in: query
 *         description: "If true, returns the total count of matching dishes inside the dishes object"
 *         schema:
 *           type: boolean
 *         example: true
 *     responses:
 *       "200":
 *         description: "List of filtered dishes with total count inside the response"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dishes:
 *                   type: object
 *                   properties:
 *                     totalDishes:
 *                       type: integer
 *                    
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                    
 *                           ingredients:
 *                             type: array
 *                             items:
 *                               type: string
 *                         
 *                           prep_time:
 *                             type: integer
 *                          
 *                           cook_time:
 *                             type: integer
 *                           
 *                           region:
 *                             type: string
 *                           
 *                           course:
 *                             type: string
 *                           
 *                           diet:
 *                             type: string
 *                          
 *                           flavor_profile:
 *                             type: string
 *                           
 *                           state:
 *                             type: string
 *                        
 *       "500":
 *         description: "Internal server error"
 */
router.get("/search",   verifyToken, getDishesByRegion);

/**
 * @swagger
 * /dishes/{id}:
 *   get:
 *     summary: Get dish by ID
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: Dish details
 *       404:
 *         description: Dish not found
 */
router.get("/:id", verifyToken, getDishById);

module.exports = router;
