const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5000;
const JWT_SECRET = "your_secret_key";

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Hardcoded Users with Different Roles
const users = [
  { id: 1, username: "admin", password: "123", role: "admin" },
  { id: 2, username: "user", password: "457", role: "user" }
];

// Middleware for Authentication
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// Middleware for Role-Based Access
const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: "Access denied" });
  }
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

// Protected Route Example
app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
