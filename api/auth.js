const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const createUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
    },
  });
};

const loginUser = async (email, password, res) => {
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

  return { token: token, user: user };
};

const validateUser = async (user, requestedPassword) => {
  const isPasswordValid = await bcrypt.compare(
    requestedPassword,
    user.password
  );
  if (!isPasswordValid) return true;
  return false;
};

const isExistUser = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  return Object.keys(user).length > 0 ? true : false;
};

module.exports = { createUser, loginUser, isExistUser };
