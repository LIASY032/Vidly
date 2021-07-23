require("express-async-errors");
require("winston-mongodb");
const winston = require("winston");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const app = express();
const config = require("config");
const error = require("./middleware/error");

// process.on("uncaughtException", (ex) => {
//   winston.error(ex.message, ex);
//   process.exit(1);
// });

process.on("unhandledRejection", (ex) => {
  throw ex;
  // winston.error(ex.message, ex);
  // process.exit(1);
});

winston.exceptions.handle(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);
// I had the same issue, what I did was to replace this statement:

// winston.add(winston.transports.File, { filename: 'logfile.log' });
// to this:

// winston.add(new winston.transports.File({ filename: 'logfile.log' }));
// This happens in the latest major update of winston i.e 3.x.x and above.

// Hope this helps!

winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/vidly",
    level: "info",
  })
);

const p = Promise.reject(new Error("Something failed miserably!"));
p.then(() => console.log("Done"));

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}
mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
