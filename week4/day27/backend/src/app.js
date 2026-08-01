const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const routes = require("./routes");
const app = express();
const errorHandler = require("./middleware/error.middleware");


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));





app.use("/api", routes);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Day 27 AI Capstone Backend Running 🚀",
  });
});

module.exports = app;