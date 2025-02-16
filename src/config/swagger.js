const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Indian Cuisine API",
      version: "1.0.0",
      description: "API for managing Indian cuisine dishes",
    },
    servers: [{ url: "http://localhost:3000" }],


    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/dishroute.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);


const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};




module.exports = setupSwagger;
