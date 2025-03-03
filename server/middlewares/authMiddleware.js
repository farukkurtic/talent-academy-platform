const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded user from token:", decoded); // Debugging
    next();
  } catch (err) {
    console.error("Error verifying token:", err); // Debugging
    res.status(400).json({ error: "Invalid token" });
  }
};
