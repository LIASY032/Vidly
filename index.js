const express = require("express");
const app = express();
const config = require("config");

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();

// const p = Promise.reject(new Error("Something failed miserably!"));
// p.then(() => console.log("Done"));

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
