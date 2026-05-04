const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio."],
    unique: true,
    minlength: [3, "Mínimo 3 caracteres."],
    maxlength: [20, "Máximo 20 caracteres."]
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria."],
    minlength: [6, "Mínimo 6 caracteres."]
  },
  role: {
    type: String,
    enum: { values: ["user", "admin"], message: "Rol inválido ('user' o 'admin')." },
    default: "user"
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
  // Solo hashear si la contraseña ha cambiado
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);