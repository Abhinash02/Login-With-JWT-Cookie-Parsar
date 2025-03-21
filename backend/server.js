const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const requestInterceptor = require("./requestInterceptor"); // Import Interceptor

const app = express();
const port = 5000;
const JWT_SECRET = "your_secret_key"; // Change this to a strong secret key

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestInterceptor); // ✅ Apply interceptor globally

// Hardcoded Users with Different Roles
const users = [
  { id: 1, username: "admin", password: "123", role: "admin" },
  { id: 2, username: "user", password: "457", role: "user" },
  { id: 3, username: "Abhinash", password: "111", role: "user" },
  { id: 4, username: "Abhinash", password: "112", role: "admin" },
  { id: 5, username: "sam", password: "1234", role: "user" },
];

// Authentication Middleware
const authenticateJWT = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" }); // Interceptor already verifies JWT
  next();
};

// Role-Based Access Control Middleware
const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ error: "Access denied" });
  next();
};

// Login Route
app.post("/", (req, res) => {
  const { username, password, role } = req.body;
  const user = users.find((u) => u.username === username && u.password === password && u.role === role);

  if (!user) return res.status(401).json({ error: "Invalid credentials or role mismatch" });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, { httpOnly: true, secure: false });
  res.json({ role: user.role });
});

// Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logged out" });
});

// Admin-only Route
app.get("/admin", authenticateJWT, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

// User-only Route
app.get("/user", authenticateJWT, authorizeRole("user"), (req, res) => {
  res.json({ message: "Welcome User", user: req.user });
});

// General Protected Route
app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Start Server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));