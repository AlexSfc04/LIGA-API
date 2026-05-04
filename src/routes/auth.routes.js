const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Registro
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Usuario ya existe." });
    }

    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ message: "Usuario creado." });
  } catch (e) {
    next(e);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // Token de acceso (corto)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // Token de refresco (largo)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    res.json({
      token,
      refreshToken,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (e) {
    next(e);
  }
});

// Refresh token
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    const newToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.json({ token: newToken });
  } catch (e) {
    res.status(401).json({ message: "Refresh token inválido." });
  }
});

module.exports = router;