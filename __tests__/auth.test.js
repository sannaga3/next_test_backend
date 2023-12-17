const request = require("supertest");
const { createUser, isExistUser } = require("../api/auth");
const { createApp } = require("../createApp");

describe("Auth test", () => {
  let server;

  beforeAll(() => {
    server = createApp();
    server.listen(5002);
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  describe("Register test", () => {
    it("Register user successful.", async () => {
      const email = createEmail();
      req = {
        username: "testuser",
        email: email,
        password: "abcdefg",
      };

      const res = await request(server).post("/api/auth/register").send({
        username: req.username,
        email: req.email,
        password: req.password,
      });
      const user = res.body.user;

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("username", req.username);
      expect(user).toHaveProperty("email", req.email);
      expect(user).toHaveProperty("password");
    });
  });

  describe("Login test", () => {
    const testUser = {
      username: "testUser",
      email: "testEmail@test.com",
      password: "password",
    };

    beforeAll(async () => {
      const isExist = await isExistUser(testUser.email);
      if (!isExist)
        await createUser(testUser.username, testUser.email, testUser.password);
    });

    it("Login successful.", async () => {
      const res = await request(server).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });
      const user = res.body.user;

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("username", testUser.username);
      expect(user).toHaveProperty("email", testUser.email);
      expect(user).toHaveProperty("password");
    });

    it("User not found.", async () => {
      const res = await request(server).post("/api/auth/login").send({
        email: "testEmail@atest.com",
        password: testUser.password,
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Login failed. User not found");
    });

    it("Password doesn't match.", async () => {
      const res = await request(server).post("/api/auth/login").send({
        email: "testEmail@test.com",
        password: "password1",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Login failed. password doesn't match");
    });
  });
});

const createEmail = () => {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let strings = "";
  for (var i = 0; i < 8; i++) {
    strings += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${strings}@example.com`;
};
