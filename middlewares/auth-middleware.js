const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    console.log(req.cookies.accessToken);
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    };

    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!decode) {
        return res.status(400).json({
            message: "Invalid token"
        });
    }
    console.log(decode);

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Access denied. No token provided",
    });
  }
};

module.exports = authMiddleware;