"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /register */

describe("POST /register", function () {
  const newUser = {
    username : "test1",
    firstname : "test",
    lastname : "test",
    password : "password"
  };

  test("ok to register new user", async function () {
    const resp = await request(app)
        .post("/auth/register")
        .send(newUser);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token : expect.any(String)
    });

    });

  test("error if duplicate user", async function () {
    const dupeUser = {
        username : "test",
        firstname : "test",
        lastname : "test",
        password : "password"
      };
    const resp = await request(app)
        .post("/auth/register")
        .send(dupeUser);
    expect(resp.statusCode).toEqual(400);
    // expect(resp.body).toEqual({
    //   token : expect.any(String)
    // });

    });

//   test("bad request with missing data", async function () {
//     const resp = await request(app)
//         .post("/companies")
//         .send({
//           handle: "new",
//           numEmployees: 10,
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("bad request with invalid data", async function () {
//     const resp = await request(app)
//         .post("/companies")
//         .send({
//           ...newCompany,
//           logoUrl: "not-a-url",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });
});

describe("POST /login", function () {
    const newUser = {
      username : "test",
      password : "test"
    };
  
    test("ok to login", async function () {
      const resp = await request(app)
          .post("/auth/token")
          .send(newUser);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual({
        token : expect.any(String)
      });
  
      });
  
    test("error if duplicate user", async function () {
      const badUser = {
          username : "test",
          password : "password"
        };
      const resp = await request(app)
          .post("/auth/token")
          .send(badUser);
      expect(resp.statusCode).toEqual(401);
      });
  });