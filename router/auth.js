const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
    },
  });

  return res.json({ user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(401).json({ error: "Login failed. User not found" });

  const error = await validateUser(user, password);
  if (error)
    return res
      .status(401)
      .json({ error: "Login failed. password doesn't match" });

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({ token: token, user: user });
});

const validateUser = async (user, requestedPassword) => {
  const isPasswordValid = await bcrypt.compare(
    requestedPassword,
    user.password
  );
  if (!isPasswordValid) return true;
  return false;
};

module.exports = router;
