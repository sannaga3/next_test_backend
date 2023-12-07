const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, Please Login." });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Not authorized, Please Login." });
    }

    req.userId = decoded.id;

    next();
  });
}

module.exports = isAuthenticated;