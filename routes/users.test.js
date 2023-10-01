"use strict";

const request = require("supertest");

const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  token,
  createStory
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /register */

describe("POST /users/following", function () {
  test("get all users being followed by logged in user", async function () {
    const user1 = await User.register("test3", "test", "test", "test");
    const user2 = await User.register("test4", "test", "test", "test");
    await User.follow("test3", "test4")

    const resp = await request(app)
        .post("/users/following")
        .send({username : "test3"});
        expect(resp.body.followingList.length).toEqual(1);
    });
});

describe("POST /users/follow", function () {
    test("follow a user", async function () {
      const user1 = await User.register("test3", "test", "test", "test");
      const user2 = await User.register("test4", "test", "test", "test");
  
      const resp = await request(app)
          .post("/users/follow")
          .send(
            {
                followerUsername : "test3",
                followingUsername : "test4"
            }
            );
            expect(resp.statusCode).toEqual(201);
            expect(resp.body.message).toEqual("successfully followed");
      });
  });

  describe("DELETE /users/unfollow", function () {
    test("unfollow a user", async function () {
      const user1 = await User.register("test3", "test", "test", "test");
      const user2 = await User.register("test4", "test", "test", "test");
      await User.follow("test3", "test4")
  
      const resp = await request(app)
          .delete("/users/unfollow")
          .send(
            {
                followerUsername : "test3",
                followingUsername : "test4"
            }
            );
            expect(resp.statusCode).toEqual(201);
            expect(resp.body.message).toEqual("successfully unfollowed");
      });
  });