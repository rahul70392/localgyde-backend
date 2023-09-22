const jwt = require("jsonwebtoken");

function guideAuth(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.guide = decodedToken._id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token." });
  }
}

module.exports = guideAuth;
