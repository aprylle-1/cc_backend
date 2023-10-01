"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Story = require("../models/story");
const { createToken } = require("../helpers/token.js")
const testJobIds = [];

async function commonBeforeAll() {

  await db.query("DELETE FROM following");
  await db.query("DELETE FROM stories");
  await db.query("DELETE FROM users");

  await User.register("test", "test", "test", "test");
  await Story.save("test", "test", "test", "test");
  await User.register("test2", "test", "test", "test");
  await Story.save("test2", "test", "test", "test");
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const token = createToken({
    username: "test" 
})

async function createStory () {
    const createStory = await Story.save("test", "test", "test", "test");
    return createStory.id
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  token,
  createStory
};