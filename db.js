"use strict"

/**
 * Contains db configuration
 */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

db = new Client({
  connectionString: "postgres://ccdatabase_msx5_user:e6r9zkHIDOeV7Zm04Ht3cVAeJwKJ05J1@dpg-ckc8t3kiibqc73ahcesg-a.singapore-postgres.render.com/ccdatabase_msx5?ssl=true"
});

// if (process.env.NODE_ENV === "production") {
//     db = new Client({
//       connectionString: getDatabaseUri(),
//       ssl: {
//         rejectUnauthorized: false
//       }
//     });
//   } else {
//     db = new Client({
//       connectionString: getDatabaseUri()
//     });
// }
  
db.connect();
  
module.exports = db;