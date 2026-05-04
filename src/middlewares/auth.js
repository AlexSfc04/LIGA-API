const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authJWT = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No hay token. Acceso denegado." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Token inválido." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido." });
  }
};

const authRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ 
      message: `Rol requerido: ${roles.join(" o ")}` 
    });
  }
  next();
};

module.exports = { authJWT, authRole };