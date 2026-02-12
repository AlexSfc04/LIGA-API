const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const teamRoutes = require("./routes/team.routes");
const playerRoutes = require("./routes/player.routes");
const matchRoutes = require("./routes/match.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ message: "API Liga OK" }));

app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/matches", matchRoutes);

app.use(errorHandler);

module.exports = app;
