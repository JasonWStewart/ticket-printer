const express = require("express");
const bodyParser = require("body-parser");
const ticketRoutes = require("./routes/ticketRoutes");
const apiKeyAuth = require("./middleware/apiKeyAuth");
const config = require("../config");
const ticketModel = require("./models/ticketModel");
const { printReadyStatus } = require("./utils/printerUtils");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(apiKeyAuth);
app.use(morgan("dev"));

ticketModel.createTable();

// printReadyStatus();

app.use(config.api.prefix, ticketRoutes, apiKeyAuth);

app.use("/", express.static(path.join(__dirname, "..", "..", "client", "dist")));

app.listen(config.api.port, () => {
  console.log(`SRV: Listening on port ${config.api.port}`);
});
