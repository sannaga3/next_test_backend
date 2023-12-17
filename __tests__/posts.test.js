const request = require("supertest");
const { createApp } = require("../createApp");
const { getUser } = require("../api/auth");
const { getPostByTitle, deletePost } = require("../api/posts");

describe("Post test", () => {
  let server;
  let authInfo;
  let testPost;

  beforeAll(async () => {
    server = createApp();
    server.listen(5003);

    const user = await getUser("testEmail@test.com");

    res = await request(server).post("/api/auth/login").send({
      email: user.email,
      password: "password",
    });
    authInfo = res.body;
    testPost = {
      title: "testTitle",
      content: "testContent",
      userId: authInfo.user.id,
    };
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  describe("Get posts", () => {
    it("Register user successful.", async () => {
      const res = await request(server).get("/api/posts");
      const posts = res.body;

      expect(res.statusCode).toBe(200);
      expect(posts.length > 0).toBe(true);
      expect(posts[0]).toHaveProperty("id");
      expect(posts[0]).toHaveProperty("title");
      expect(posts[0]).toHaveProperty("content");
      expect(posts[0].user).toHaveProperty("id");
      expect(posts[0].user).toHaveProperty("username");
    });
  });

  describe("Store post", () => {
    it("Register user successful.", async () => {
      const storedRes = await request(server)
        .post("/api/posts")
        .set("Authorization", `Bearer ${authInfo.token}`)
        .send({
          title: testPost.title,
          content: testPost.content,
          userId: testPost.userId,
        });
      const post = storedRes.body;

      expect(res.statusCode).toBe(200);
      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("title", testPost.title);
      expect(post).toHaveProperty("content", testPost.content);
      expect(post).toHaveProperty("userId", testPost.userId);
    });

    describe("Get post", () => {
      it("Register user successful.", async () => {
        const storedRes = await request(server)
          .post("/api/posts")
          .set("Authorization", `Bearer ${authInfo.token}`)
          .send({
            title: testPost.title,
            content: testPost.content,
            userId: testPost.userId,
          });
        const storedPost = storedRes.body;

        const res = await request(server).get(
          `/api/posts/${storedRes.body.id}`
        );
        const post = res.body;

        expect(res.statusCode).toBe(200);
        expect(post).toHaveProperty("id", storedPost.id);
        expect(post).toHaveProperty("title", storedPost.title);
        expect(post).toHaveProperty("content", storedPost.content);
        expect(post.user).toHaveProperty("id", storedPost.userId);
      });
    });

    describe("Update post", () => {
      it("Update post successful.", async () => {
        const fetchedPost = await getPostByTitle(testPost.title);
        const params = {
          title: "updated title",
          content: "updated content",
        };

        const res = await updatePostTest(
          server,
          authInfo,
          fetchedPost.id,
          params
        );
        const post = res.body;

        expect(res.statusCode).toBe(200);
        expect(post).toHaveProperty("id", fetchedPost.id);
        expect(post).toHaveProperty("title", params.title);
        expect(post).toHaveProperty("content", params.content);
      });

      it("Title is required", async () => {
        const fetchedPost = await getPostByTitle(testPost.title);
        const params = {
          title: null,
          content: "updated content",
        };

        const res = await updatePostTest(
          server,
          authInfo,
          fetchedPost.id,
          params
        );

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Title and content are required.");
      });
    });

    describe("Delete post", () => {
      it("Delete Post successful.", async () => {
        const fetchedPost = await getPostByTitle(testPost.title);
        const res = await request(server)
          .delete(`/api/posts/${fetchedPost.id}`)
          .set("Authorization", `Bearer ${authInfo.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id", fetchedPost.id);
      });
    });
  });
});

const updatePostTest = async (server, authInfo, postId, params) => {
  const res = await request(server)
    .patch(`/api/posts/${postId}`)
    .set("Authorization", `Bearer ${authInfo.token}`)
    .send({
      title: params.title,
      content: params.content,
    });
  return res;
};
