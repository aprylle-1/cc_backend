"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgres://ccdatabase_msx5_user:e6r9zkHIDOeV7Zm04Ht3cVAeJwKJ05J1@dpg-ckc8t3kiibqc73ahcesg-a.singapore-postgres.render.com/ccdatabase_msx5"
      : process.env.DATABASE_URL || "postgres://ccdatabase_msx5_user:e6r9zkHIDOeV7Zm04Ht3cVAeJwKJ05J1@dpg-ckc8t3kiibqc73ahcesg-a.singapore-postgres.render.com/ccdatabase_msx5";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
