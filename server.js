const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require('cors');

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const cars = require("./routes/cars");
const reservations = require("./routes/reservations");
const auth = require("./routes/auth");
const carcare = require("./routes/carcares");


app.use("/api/v1/cars", cars);
app.use("/api/v1/auth", auth);
app.use("/api/v1/reservations", reservations);
app.use("/api/v1/carcares", carcare);



const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () =>
  console.log(
    "Server running in",
    process.env.NODE_ENV,
    "on " + process.env.HOST + " :" + PORT)
);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0' ,
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'Car Booking API'
    },
    server: [
      {
        url: process.env.HOST + ':' + PORT + '/api/v1'
      }
    ],
  },
  apis:['./routes/*.js']
};

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
