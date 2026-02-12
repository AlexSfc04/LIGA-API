const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  kickoff: { type: Date, required: [true, "La fecha/hora del partido es obligatoria."] },
  round: {
    type: Number,
    required: [true, "La jornada es obligatoria."],
    min: [1, "La jornada mínima es 1."],
    max: [38, "La jornada máxima es 38."]
  },
  status: {
    type: String,
    default: "scheduled",
    enum: { values: ["scheduled", "live", "finished"], message: "Estado '{VALUE}' no válido." }
  },
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: [true, "homeTeam es obligatorio."] },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: [true, "awayTeam es obligatorio."] },
  homeGoals: { type: Number, default: 0, min: [0, "homeGoals no puede ser negativo."], max: [30, "homeGoals demasiado alto (máx 30)."] },
  awayGoals: { type: Number, default: 0, min: [0, "awayGoals no puede ser negativo."], max: [30, "awayGoals demasiado alto (máx 30)."] },
  isDerby: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Match", matchSchema);
