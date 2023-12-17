const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middleware/isAuthenticated");
const {
  getPosts,
  getPost,
  storePost,
  updatePost,
  deletePost,
} = require("../api/posts");

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const result = await getPosts(res);
  return result;
});

router.post("/", isAuthenticated, async (req, res) => {
  const { title, content, userId } = req.body;
  if (!title | !content)
    return res.status(400).json({ message: "Title and content are required." });

  const result = await storePost(title, content, userId, res);
  return result;
});

router.get("/:id", async (req, res) => {
  const postId = Number(req.params.id);
  const result = await getPost(postId, res);
  return result;
});

router.patch("/:id", isAuthenticated, async (req, res) => {
  if (!req.body?.title || !req.body?.content)
    return res.status(400).json({ message: "Title and content are required." });

  const params = { ...req.body, postId: Number(req.params.id) };
  const result = await updatePost(params, res);
  return result;
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  const postId = Number(req.params.id);
  if (!postId)
    return res.status(400).json({ message: "PostId was not found." });

  const result = await deletePost(postId, res);
  return result;
});

module.exports = router;
