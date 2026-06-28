const express = require("express");
const cors = require("cors");

const documentRoutes = require("./routes/document.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/documents", documentRoutes);

const matchRoutes =
  require(
    "./routes/match.routes"
  );

app.use(
  "/api/match",
  matchRoutes
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Running"
  });
});

module.exports = app;