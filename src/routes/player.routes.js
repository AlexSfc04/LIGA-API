const router = require("express").Router();
const Player = require("../models/Player");

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (e) { next(e); }
});

// READ ALL (populate team)
router.get("/", async (req, res, next) => {
  try {
    const players = await Player.find().populate("team");
    res.json(players);
  } catch (e) { next(e); }
});

// READ ONE (populate team)
router.get("/:id", async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id).populate("team");
    if (!player) return res.status(404).json({ message: "Jugador no encontrado." });
    res.json(player);
  } catch (e) { next(e); }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("team");
    if (!player) return res.status(404).json({ message: "Jugador no encontrado." });
    res.json(player);
  } catch (e) { next(e); }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: "Jugador no encontrado." });
    res.json({ message: "Jugador eliminado." });
  } catch (e) { next(e); }
});

module.exports = router;
