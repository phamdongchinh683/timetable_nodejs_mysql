const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const YAML = require("yamljs");
const app = express();
require("dotenv").config();
const corsOptions = require("./src/config/corsOptions");
const PORT = process.env.PORT;
const router = require("./src/routers/router");
const { connectDB } = require("./src/config/database.config");
const initSocket = require("./src/socket");
const swaggerDocument = YAML.load("./src/config/swagger.yaml");

initSocket(app);

app.get("/", function (req, res) {
  res.redirect("/api-docs");
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const START_SERVER = () => {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("combined"));
  router(app);

  const mode =
    process.env.BUILD_MODE === "production" ? "Production" : "Development";
  const message =
    mode === "Production"
      ? `Hi ${process.env.AUTHOR}, Back-end Server is running successfully at Port: ${PORT}`
      : `Back-end Server is running successfully at Port: ${PORT}`;

  app.listen(PORT, () => console.log(`${mode}: ${message}`));
};
connectDB();
START_SERVER();
