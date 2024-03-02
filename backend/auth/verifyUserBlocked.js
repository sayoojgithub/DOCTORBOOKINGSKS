import Jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const verifyUserBlocked = async (req, res, next) => {
  // get token from headers
  const authToken = req.headers.authorization;

  // check if token exists
  if (!authToken || !authToken.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const token = authToken.split(" ")[1];
    const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY_PATIENT);
    const userId = decoded.id;

    // Check if the user is blocked
    const user = await User.findById(userId);
    if (!user || user.isBlocked) {
      return res
        .status(403)
        .json({ success: false, message: "User is blocked by admin" });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is Expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
