var express = require("express");
var passport = require("passport");
const jwt = require("jsonwebtoken");
var crypto = require("crypto");
var router = express.Router();
const moment = require("moment");
const { check, validationResult } = require("express-validator");
var EmailValidator = require("email-validator");
const conn = require("../database/connection.db");
const helper = require("../helper/helper");
var JWTSECRET = process.env.TRAINERJWTSECRET;
var async = require("async");
const { requireSignin } = require("../middleware");

router.post(
  "/sign-up",
  [
    check("first_name").exists(),
    check("last_name").exists(),
    check("email").exists(),
    check("newpassword").exists(),
    check("retypepassword").exists(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 401, message: err });
      return;
    } else {
      var { first_name, last_name, email, newpassword } = req.body;
      email = email.toLowerCase();
      if (EmailValidator.validate(email)) {
        let data = {
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: crypto
            .createHash("sha256")
            .update(newpassword, "utf8")
            .digest("hex"),
          is_active: 1,
        };
        let sql = "SELECT * FROM trainers WHERE email = ?";
        conn.query(sql, [email], (err, results) => {
          if (err) {
            res.json({ status: 400, message: err });
          } else {
            if (results.length > 0) {
              res.json({ status: 400, message: "Email Already Exits" });
            } else {
              let sql1 = "INSERT INTO trainers SET ?";
              conn.query(sql1, data, (err, results1) => {
                if (err) {
                  res.json({ status: 400, message: err });
                } else {
                  if (results1.affectedRows === 1) {
                    res.json({ status: 200, message: "Signup successfully" });
                  } else {
                    res.json({ status: 400, message: "Signup failed" });
                  }
                }
              });
            }
          }
        });
      } else {
        res.json({ status: 400, message: "Invalid email address." });
      }
    }
  }
);

router.post(
  "/social_login",
  [
    check("email").exists(),
    check("password").exists(),
    check("first_name").exists(),
    check("last_name").exists(),
    check("is_active").exists(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 401, message: err });
      return;
    } else {
      let value = req.body;
      value.email = value.email.toLowerCase();
      if (EmailValidator.validate(value.email)) {
        value.password = crypto
          .createHash("sha256")
          .update(value.password, "utf8")
          .digest("hex");

        conn.query(
          `SELECT * FROM trainers WHERE email=? AND password=?`,
          [value.email, value.password],
          async (err, resuser) => {
            if (err) {
              res.json({ status: 501, message: err });
            } else if (resuser.length > 0) {
              if (resuser[0]["is_active"] == 2) {
                res.json({ status: 201, message: "account is blocked." });
              } else if (resuser[0]["is_active"] == 0) {
                res.json({ status: 201, message: "account is not active." });
              } else {
                var jwtdata = {
                  trainer_id: resuser[0].trainer_id,
                  firstname: resuser[0].first_name,
                  email: resuser[0].email,
                };
                var token = jwt.sign(
                  { jwtdata, IsTrainerLogin: true },
                  JWTSECRET,
                  { expiresIn: "10d" }
                );
                res.json({
                  status: 200,
                  message: "Welcome",
                  data: resuser[0],
                  TrainerToken: token,
                  IsTrainerLogin: true,
                });
              }
            } else {
              conn.query(`INSERT INTO trainers SET ?`, value, async (err) => {
                if (err) {
                  res.json({ status: 400, message: err });
                } else {
                  var jwtdata = {
                    trainer_id: resuser[0].trainer_id,
                    firstname: resuser[0].first_name,
                    email: resuser[0].email,
                  };
                  var token = jwt.sign(
                    { jwtdata, IsTrainerLogin: true },
                    JWTSECRET,
                    { expiresIn: "10d" }
                  );
                  res.json({
                    status: 200,
                    message: "Welcome",
                    data: resuser[0],
                    TrainerToken: token,
                    IsTrainerLogin: true,
                  });
                }
              });
            }
          }
        );
      } else {
        res.json({ status: 400, message: "Invalid email address." });
      }
    }
  }
);

router.post(
  "/login",
  [check("email").exists(), check("password").exists()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 401, message: err });
      return;
    } else {
      var { email, password } = req.body;
      email = email.toLowerCase();
      conn.query(
        "select * from trainers where email=? and password=?",
        [
          email,
          crypto.createHash("sha256").update(password, "utf8").digest("hex"),
        ],
        async (err, resuser) => {
          if (err) {
            res.json({ status: 501, message: err });
          } else if (resuser.length > 0) {
            if (resuser[0]["is_active"] == 2) {
              res.json({ status: 201, message: "account is blocked." });
            } else if (resuser[0]["is_active"] == 0) {
              res.json({ status: 201, message: "account is not active." });
            } else {
              var jwtdata = {
                trainer_id: resuser[0].trainer_id,
                firstname: resuser[0].first_name,
                email: resuser[0].email,
              };
              var token = jwt.sign(
                { jwtdata, IsTrainerLogin: true },
                JWTSECRET,
                { expiresIn: "10d" }
              );
              res.json({
                status: 200,
                message: "Welcome",
                data: resuser[0],
                TrainerToken: token,
                IsTrainerLogin: true,
              });
            }
          } else {
            res.json({ status: 201, message: "Invalid credentials." });
          }
        }
      );
    }
  }
);

router.post(
  "/get_data",
  requireSignin,
  [check("trainer_id").exists()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      var trainer_id = req.body.trainer_id;
      let sql = "SELECT * FROM trainers WHERE trainer_id = ?";
      conn.query(sql, [trainer_id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            res.json({
              status: 200,
              message: "Get Data Successfully",
              data: results[0],
            });
          } else {
            res.json({ status: 400, message: "No data Found" });
          }
        }
      });
    }
  }
);

module.exports = router;
