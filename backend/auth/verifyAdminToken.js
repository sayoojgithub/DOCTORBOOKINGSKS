import Jwt from "jsonwebtoken";

export const AdminAuthenticate = async (req, res, next) => {
    //get token from headers
    const authToken = req.headers.authorization;
    //check token is exist
    if (!authToken || !authToken.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ success: false, message: "No token, authorization denied" });
    }
    try {
      const token = authToken.split(" ")[1];
      const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN);
      req.userId = decoded.id;
      req.role = decoded.role;
      
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token is Expired" });
      }
  
      return res.status(401).json({ success: false, message: "invalid token" });
    }
  };