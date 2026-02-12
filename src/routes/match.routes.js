const router = require("express").Router();
const Match = require("../models/Match");

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (e) { next(e); }
});

// READ ALL
router.get("/", async (req, res, next) => {
  try {
    const matches = await Match.find()
      .populate("homeTeam")
      .populate("awayTeam");
    res.json(matches);
  } catch (e) { next(e); }
});

// READ ONE
router.get("/:id", async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("homeTeam")
      .populate("awayTeam");
    if (!match) return res.status(404).json({ message: "Partido no encontrado." });
    res.json(match);
  } catch (e) { next(e); }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    .populate("homeTeam")
    .populate("awayTeam");
    if (!match) return res.status(404).json({ message: "Partido no encontrado." });
    res.json(match);
  } catch (e) { next(e); }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ message: "Partido no encontrado." });
    res.json({ message: "Partido eliminado." });
  } catch (e) { next(e); }
});

module.exports = router;
