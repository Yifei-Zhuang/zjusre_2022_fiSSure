const express = require("express");
const app = express();
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const dashboard = require("./routes/dashboard");
const connectDB = require("./db/connect");
const notFound = require("./middleware/notfound");
const errorHandlerMiddleware = require("./middleware/error-handler");
const config = require("./config");

require("dotenv").config();

app.use(xss());
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/", dashboard);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4538;
// const MONGO_HOST = "localhost"
const MONGO_HOST = "127.0.0.1";
const MONGO_PORT = 27017;
const MONGO_DB_NAME = "DoubleC";
const MONGO_URI = config.DEBUG
  ? process.env.MONGO_URI ||
    "mongodb://" + MONGO_HOST + ":" + MONGO_PORT + "/" + MONGO_DB_NAME
  : config.MONGO_URI;

const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(port, console.log(`server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
