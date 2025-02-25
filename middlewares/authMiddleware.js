import JWT from "jsonwebtoken";

//Protected route jwt token based
export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (token?.startsWith("Bearer ")) {
      token = token.slice(7);
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "UnAuthorized Access token not found",
      });
    } else {
      JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: "UnAuthorized Access wrong token",
          });
        }
        req.user = decoded;
        next();
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
