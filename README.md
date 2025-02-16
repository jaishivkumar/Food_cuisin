# Adapt Ready Backend Challenge - Aurelia

## Overview
This project is a backend service designed to assist users in exploring Indian cuisine. It provides API endpoints to fetch information about Indian dishes, including details about ingredients, cooking time, and origin. The API also allows users to find dishes they can prepare based on available ingredients.
 `I Implemented both Mandatory $ Optional `
## Features
### Mandatory Features:
- Fetch all dishes available in the dataset.
- Fetch details about a specific dish by name.
- Find possible dishes based on a given set of ingredients.

### Optional Features:
- Additional interactions that might be useful.
- Design and implement `Create`, `Update`, or `Delete` operations.
- Implement authorization mechanisms.

## Technologies Used
- **Node.js** (Backend framework)
- **Javascript** (language)
- **MongoDB** (Database for storing dish data)
- **Express.js** (For handling HTTP requests)
- **swagger** (For the API ui testing)

## Project Structure
```
/src
  ├── controller/foodController  # Business logic and request handling
  |---- data/indian_food_csv      # i stored into the csv data 
  |    
  ├── models/dishModel.js        # Database schema definitions
  ├── route/foodroute.js          # API route definitions
  ├── config/db.js              # Configuration settings
  ├── middleware/token.js/logger.js      #Authorization and logger 
  ├── Services/foodService.js
  |---  index.js  (main)
  
  
    
```

## Installation
### Prerequisites
- Node.js (v20+)
- MongoDB instance (Local or Cloud)

### Steps
1. Clone the repository:
   ```sh
   git clone github url
   ```
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```
       PORT = 3000;
       MONGO_URI = mongodb+srv://jaishivkumar4:UOSKYfPyzjb8ugAM@cluster0.mmngc.mongodb.net/food_cuisin
 
       JWT_SECRET= secret
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

######    to Run  test the api in Postman $ Swagger ############### ---------
`use url for postman ` -` http://localhost:3000/dishes/ `
`Swagger url`  :         ` http://localhost:3000/api-docs/ `

## API Endpoints
### 1. Fetch All Dishes
- **Endpoint:** `GET /dishes`  ``  `http://localhost:3000/dishes?cook_time[gte]=20&cook_time[lte]=30`
- **Response:**
  ```json
  [
    { "name": "Biryani", "ingredients": ["Rice", "Chicken", "Spices"], "origin": "India" },
    { "name": "Paneer Butter Masala", "ingredients": ["Paneer", "Tomato", "Cream"], "origin": "Punjab" }
  ]
  ```

### 2. Fetch a Specific Dish by ID
- **Endpoint:** `GET /dishes/:id`  `http://localhost:3000/dishes/67ae1b7eb007b0488e40744e`
- **Response:**
  ```json
  { "name": "Biryani", "ingredients": ["Rice", "Chicken", "Spices"], "origin": "India" }
  ```

### 3. Find Dishes by Ingredients
- **Endpoint:** `GET  http://localhost:3000/dishes/by-ingredients?ingredients=coconut,jaggery`
- **Response:**
  ```json
  [
    { "name": "Modak" },
    { "name": "Kajjikaya" }
  ]
  ```
  ###  4 create Add  Dish 
   - **Endpoint:**  `POST  http://localhost:3000/dishes/add`
   {
  "name": "Spaghetti Carbonara",
  "ingredients": ["Pasta, Egg, Cheese, Bacon"],
  "password": "securepassword123",
  "region": "Italy",
  "course": "Main",
  "diet": "Non-Vegetarian",
  "flavor_profile": "Savory",
  "state": "Rome"
}

## 5 LOGIN the user 
 - **Endpoint:**  `http://localhost:3000/dishes/login`
    {
  "name": "Spaghetti Carbonara",
     "password": "securepassword123"
}
    

 ## 6 Update a dish  By ID 
   - **Endpoint:**  `PUT  http://localhost:3000/dishes/update/:id`
    {
    "ingredients":["hhdddcccddd", "kaju"]  
}

##  7 Delete the dish  by ID 
     - **Endpoint:**      ` DELETE   http://localhost:3000/dishes/deletedish/67ae1b7eb007b0488e407447 `
      
 ##  8 Search the Dishes  
  - **Endpoint:**  `  GET http://localhost:3000/dishes/search?flavor_profile=sweet&max_cook_time=25`





## Running Tests
To run unit tests:
```sh
npm test
```

## Future Enhancements
- Implemented  `Create`, `Update`, and `Delete` operations.
- Added  user authentication and authorization.
- Improve search functionality with fuzzy matching.
- Optimize database queries for better performance.



## License
This project is licensed under the MIT License.
