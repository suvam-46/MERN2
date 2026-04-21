const jwt = require("jsonwebtoken");
const User = require("../model/userModel"); // Import your User model

exports.isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please login to access this resource" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        // FETCH THE FULL USER: This makes sure req.user has the .role property
        req.user = await User.findById(decoded.id); 

        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Now req.user.role will definitely exist because we fetched it from DB
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }
    next();
  };
};