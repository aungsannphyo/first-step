const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    if (req.header("Authorization") === undefined) {
      throw new Error("Please Authenticate");
    } else {
      const checkType = req.header("Authorization").includes("Bearer");
      if (!checkType) {
        res.status(400).send({
          error: "Please support the bearer token type",
        });
      }
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.TOKEN_SECURE);

      const admin = await Admin.findOne({
        _id: decoded._id,
        token: token,
      });

      if (!admin) {
        throw new Error("Invalid Token!. Please Authenticate");
      }

      req.admin = admin;
      req.token = token;
      next();
    }
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};

module.exports = auth;
