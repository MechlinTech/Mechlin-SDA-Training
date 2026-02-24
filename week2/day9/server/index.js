const ExpressApp = require("./app");

const PORT = process.env.PORT || 5000;

const app = new ExpressApp();
app.start(PORT);