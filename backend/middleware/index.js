const jwt = require("jsonwebtoken");
exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    // NOTE: if bydefault bearer then split
    const token = req.headers.authorization.split(" ")[1].split('"')[1]
      ? req.headers.authorization.split(" ")[1].split('"')[1]
      : req.headers.authorization.split(" ")[1];
    const secret = req.baseUrl.match("/trainer")
      ? process.env.TRAINERJWTSECRET
      : req.baseUrl.match("/admin")
      ? process.env.ADMINJWTSECRET
      : process.env.JWTSECRET;
    // const token = req.headers.authorization;
    jwt.verify(token, secret, (error, data) => {
      if (error) {
        res.json({
          statusCode: 498,
          success: false,
          message: "Invalid token",
        });
      } else {
        req.user = data;
        next();
      }
    });
  } else {
    res.json({
      statusCode: 499,
      success: false,
      message: "Authorization (Bearer token) required",
    });
  }
};
