import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("RAW AUTH HEADER:", req.headers.authorization);
    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("DECODED TOKEN:", decoded);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    console.log("USER FROM DB:", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    next(err);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("REQUIRED ROLES:", roles);
    console.log("USER ROLE:", req.user?.role);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  };
};
