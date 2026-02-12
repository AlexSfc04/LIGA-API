const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "El nombre completo es obligatorio."],
    minlength: [3, "El nombre completo debe tener al menos 3 caracteres."],
    maxlength: [60, "El nombre completo no puede superar 60 caracteres."]
  },
  position: {
    type: String,
    required: [true, "La posición es obligatoria."],
    enum: { values: ["POR", "DEF", "MED", "DEL"], message: "Posición '{VALUE}' no válida." }
  },
  jerseyNumber: {
    type: Number,
    required: [true, "El dorsal es obligatorio."],
    min: [1, "El dorsal debe ser como mínimo 1."],
    max: [99, "El dorsal debe ser como máximo 99."]
  },
  isCaptain: { type: Boolean, default: false },
  birthDate: { type: Date, required: [true, "La fecha de nacimiento es obligatoria."] },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: [true, "El jugador debe pertenecer a un equipo."]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Player", playerSchema);
