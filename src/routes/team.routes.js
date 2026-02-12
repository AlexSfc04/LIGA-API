const router = require("express").Router();
const Team = require("../models/Team");

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (e) { next(e); }
});

// READ ALL
router.get("/", async (req, res, next) => {
  try {
    res.json(await Team.find());
  } catch (e) { next(e); }
});

// READ ONE
router.get("/:id", async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Equipo no encontrado." });
    res.json(team);
  } catch (e) { next(e); }
});

// UPDATE (runValidators para validar en updates)
router.put("/:id", async (req, res, next) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!team) return res.status(404).json({ message: "Equipo no encontrado." });
    res.json(team);
  } catch (e) { next(e); }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: "Equipo no encontrado." });
    res.json({ message: "Equipo eliminado." });
  } catch (e) { next(e); }
});

module.exports = router;
