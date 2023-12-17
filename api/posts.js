const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getPosts = async (res) => {
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
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(401).json({ error: "Server Error." });
  }
};

const storePost = async (title, content, userId, res) => {
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
};

const getPost = async (postId, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
    return res.status(404).json({ message: "That post is not found." });
  }
};

const updatePost = async (params, res) => {
  const { title, content, postId } = params;

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
      },
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

const deletePost = async (postId, res) => {
  try {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

const getPostByTitle = async (title) => {
  return await prisma.post.findFirst({ where: { title: title } });
};

module.exports = {
  getPosts,
  storePost,
  getPost,
  updatePost,
  getPostByTitle,
  deletePost,
};
