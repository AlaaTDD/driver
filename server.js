const path=require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const http= require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require('compression')

dotenv.config({ path: "config.env" });

const ApiError = require("./utils/apiError");
const globalerror = require("./middlewares/errorMiddleware");
const DBConnection = require("./config/database");
const mountRoutes=require('./routes/index');
const {RealTimeDB} = require("./config/realtimeso");


// connection DB

DBConnection();

// express
const app = express();
app.use(cors());
app.options('*',cors());
app.use(compression());
// midelware
app.use(express.json());
app.use(express.static(path.join(__dirname,'uploads')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode dev ${process.env.NODE_ENV}`);
}
const serverr=http.createServer(app);
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const io =require('socket.io')(serverr);

mountRoutes(app);
RealTimeDB(app,io),

app.all("*", (req, res, next) => {
  next(new ApiError(`Cant find this route:${req.originalUrl}`, 400));
});

app.use(globalerror);

const PORT = process.env.PORT || 5000;
const server = serverr.listen(PORT, () => {
  console.log(`App Running ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
