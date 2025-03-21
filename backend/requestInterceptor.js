const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key"; // Same as in server.js

const requestInterceptor = (req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);

  // Public routes that don't need authentication
  const publicRoutes = ["/", "/login", "/register", "/logout"];
  if (publicRoutes.includes(req.path)) return next();

  // Get JWT token from cookies
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized - No token provided" });

  // Verify JWT token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded; // Attach user data to request
    next();
  });
};

module.exports = requestInterceptor;
