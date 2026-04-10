const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
    // Read the token from the cookie we named "token" earlier
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please login to access this resource" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user was set by your isAuthenticated middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }
    next();
  };
};