module.exports = (err, req, res, next) => {
  if (err?.name === "ValidationError") {
    const details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: "Validación fallida.", details });
  }
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "ID no válido." });
  }
  return res.status(500).json({ message: "Error interno.", error: err.message });
};
