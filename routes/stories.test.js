"use strict";

const request = require("supertest");

const app = require("../app");

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

describe("POST /getall", function () {
  test("get all stories that is not the logged in user", async function () {
    const resp = await request(app)
        .post("/stories/getall")
        .send({username : "test"});
        expect(resp.body.data.length).toEqual(1);
    });
});

describe("GET /:username", function () {
    test("get stories by username", async function () {
      const resp = await request(app)
          .get("/stories/test")
          expect(resp.body.stories.length).toEqual(1);
      });
  });

describe("GET /:username/recent", function () {
    test("get recent stories of username", async function () {
      const resp = await request(app)
          .get("/stories/test/recent")
          expect(resp.body.stories.length).toEqual(1);
      });
  });

describe("POST /stories/save ", function () {
    test("save a story", async function () {
      const resp = await request(app)
          .post("/stories/save")
          .send({
            prompt : "test",
            title : "test",
            content : "test"
          })
          .set("authorization", `Bearer ${token}`)
          expect(resp.statusCode).toEqual(201);
          expect(resp.body).toEqual({
            story : {
                id : expect.any(Number),
                title : expect.any(String),
                content : expect.any(String)
            }
          })
      });
  });

  describe("GET /:id/read", function () {
    test("get story by id", async function () {
        const id = await createStory()
      const resp = await request(app)
          .get(`/stories/${id}/read`);
          expect(resp.statusCode).toEqual(200);
          expect(resp.body.story).toEqual({
            title : expect.any(String),
            content : expect.any(String),
            username : expect.any(String),
            updated_on : expect.any(String),
            created_on : expect.any(String),
            prompt : expect.any(String)
          });
      });
  });

  describe("PATCH /:id/update", function () {
    test("updated story", async function () {
        const id = await createStory()
      const resp = await request(app)
            .patch(`/stories/${id}/update`)
            .send({
                title : "updated",
                content : "updated",
                username : "test"
            })
            .set("authorization", `Bearer ${token}`)
          expect(resp.statusCode).toEqual(200);
          expect(resp.body.updated_story).toEqual({
            title : expect.any(String),
            content : expect.any(String),
            updated_on : expect.any(String),
            created_on : expect.any(String)
          });
      });
  });