const jwt = require("jsonwebtoken");

function isAuth(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken._id;
    // req.guide = decodedToken._id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token." });
  }
}

module.exports = isAuth;
