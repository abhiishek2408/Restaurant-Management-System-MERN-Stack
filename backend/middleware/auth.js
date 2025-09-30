import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    // Token Header se nikalo
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // yaha req.user set hoga
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
