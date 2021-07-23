require("winston-mongodb");
require("express-async-errors");
const winston = require("winston");

module.exports = function () {
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
};
