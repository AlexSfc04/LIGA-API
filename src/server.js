require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./db");

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
})();
