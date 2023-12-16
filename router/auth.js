const router = require("express").Router();
const { createUser, loginUser } = require("../api/auth");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await createUser(username, email, password);

  return res.json({ user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userInfo = await loginUser(email, password, res);

  if (userInfo?.token) return res.json(userInfo);
  return res;
});

module.exports = router;
