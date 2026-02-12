const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre del equipo es obligatorio."],
    minlength: [3, "El nombre debe tener al menos 3 caracteres."],
    maxlength: [40, "El nombre no puede superar 40 caracteres."]
  },
  city: {
    type: String,
    required: [true, "La ciudad es obligatoria."],
    minlength: [2, "La ciudad debe tener al menos 2 caracteres."],
    maxlength: [40, "La ciudad no puede superar 40 caracteres."]
  },
  category: {
    type: String,
    required: [true, "La categoría es obligatoria."],
    enum: { values: ["primera", "segunda", "tercera"], message: "Categoría '{VALUE}' no válida." }
  },
  foundedYear: {
    type: Number,
    min: [1850, "El año de fundación debe ser >= 1850."],
    max: [2026, "El año de fundación no puede ser mayor que 2026."]
  },
  budgetM: {
    type: Number,
    default: 0,
    min: [0, "El presupuesto no puede ser negativo."],
    max: [2000, "El presupuesto parece irreal (máx 2000M)."]
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Team", teamSchema);
