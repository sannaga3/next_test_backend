const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middleware/isAuthenticated");

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      take: 10,
      orderBy: { id: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    return res.json(posts);
  } catch (err) {
    if (!user) return res.status(401).json({ error: "User is not found." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(req.params.id),
      },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "That post is not found." });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  const { title, content, userId } = req.body;

  if (!content | content)
    return res.status(400).json({ message: "Title and content are required." });

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId,
      },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: "Server error." });
  }
});

router.patch("/:id", isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;

  if (!title || !content)
    return res.status(400).json({ message: "Title and content are required." });

  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
      },
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ message: "Id was not found." });

  try {
    const post = await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
