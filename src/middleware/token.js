const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  // Retrieve the Authorization header from the incoming request
  const authHeader = req.headers["authorization"];

  // Check if the header exists and follows the "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Return 403 Forbidden if no token is provided
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  // Extract the token by splitting the header string ("Bearer <token>")
  const token = authHeader.split(" ")[1];

  // Verify the token using the secret key from the environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Return 401 Unauthorized if token verification fails
      return res.status(401).json({ message: "Invalid token." });
    }

    // Attach the decoded token (user data) to the request object for further use
    req.user = decoded;
    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = { verifyToken };
