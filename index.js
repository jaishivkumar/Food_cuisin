const express = require('express');
const connectDB = require('./src/config/db');
const dishRoutes = require('./src/routes/dishroute');
const setupSwagger = require("./src/config/swagger.js");

const cors = require('cors');
require('dotenv').config();

const PORT =  3000;

const app = express();
app.use(cors());
app.use(express.json());
setupSwagger(app);
app.use('/dishes', dishRoutes);

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

