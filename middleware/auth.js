import User from "../models/User.js";

const auth = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  req.user = await User.findById(req.session.userId).select("-password");
  if (!req.user) return res.status(401).json({ message: "User not found" });
  next();
};

export default auth;
