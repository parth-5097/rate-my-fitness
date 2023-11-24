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
var JWTSECRET = process.env.JWTSECRET;
var FRONTEND_URL = process.env.FRONTEND_URL;
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
    check("role_id").exists(),
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
      var { first_name, last_name, email, newpassword, role_id } = req.body;
      email = email.toLowerCase();
      if (EmailValidator.validate(email)) {
        let data = {
          role_id: role_id,
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: crypto
            .createHash("sha256")
            .update(newpassword, "utf8")
            .digest("hex"),
          is_active: 0,
        };
        let sql = "SELECT * FROM users WHERE email = ?";
        let query = conn.query(sql, [email], (err, results) => {
          if (err) {
            res.json({ status: 400, message: err });
          } else {
            if (results.length > 0) {
              res.json({ status: 400, message: "Email Already Exits" });
            } else {
              let sql1 = "INSERT INTO users SET ?";
              let query1 = conn.query(sql1, data, (err, results1) => {
                if (err) {
                  res.json({ status: 400, message: err });
                } else {
                  if (results1.affectedRows === 1) {
                    var mykey = crypto.createCipher("aes-128-cbc", JWTSECRET);
                    var hash = mykey.update(email, "utf8", "hex");
                    hash += mykey.final("hex");
                    var token = hash;
                    var html = "";
                    html += `<h1>Verify Account For Rate My Fitness</h1>`;
                    html += `You are now a member for Rate My Fitness <br>`;
                    html +=
                      `<br><a href="` +
                      FRONTEND_URL +
                      `/verify-account/` +
                      token +
                      `">Verify Account</a>`;
                    var subject = "Verify User Account";
                    var check = helper.email_helper("", email, subject, html);
                    if (check) {
                      res.json({
                        status: 200,
                        message: "Registration successfully",
                      });
                    } else {
                      res.json({ status: 400, message: "Registration failed" });
                    }
                  } else {
                    res.json({ status: 400, message: "Registration failed" });
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
  "/verify-account",
  [check("email").exists()],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let is_active = 1;
      let email = req.body.email;
      let mykey = crypto.createDecipher("aes-128-cbc", JWTSECRET);
      let hash = mykey.update(email, "hex", "utf8");
      hash += mykey.final("utf8");
      var dbemail = hash;
      let sql = "SELECT * FROM users WHERE email = ?";
      conn.query(sql, [dbemail], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let responseActive = results[0].is_active;
            if (responseActive === 1) {
              res.json({
                status: 200,
                message: "Account is already Activated",
                response: 0,
              });
            } else {
              let sql1 = "UPDATE users SET is_active = ? WHERE email = ?";
              conn.query(sql1, [is_active, dbemail], (err, results1) => {
                if (err) {
                  res.json({ status: 400, message: err });
                } else {
                  if (results1.affectedRows === 1) {
                    if (is_active === 1) {
                      res.json({
                        status: 200,
                        message: "Account is Active",
                        response: 1,
                      });
                    } else {
                      res.json({
                        status: 200,
                        message: "Account is Deactivate",
                        response: 0,
                      });
                    }
                  } else {
                    res.json({ status: 400, message: "No data Found" });
                  }
                }
              });
            }
          } else {
            res.json({ status: 400, message: "No data Found" });
          }
        }
      });
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
    check("role_id").exists(),
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
          `SELECT * FROM users WHERE email=? AND password=?`,
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
                  id: resuser[0].id,
                  firstname: resuser[0].first_name,
                  role: resuser[0].role_id,
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
                  token: token,
                  IsTrainerLogin: true,
                });
              }
            } else {
              conn.query(`INSERT INTO users SET ?`, value, async (err) => {
                if (err) {
                  res.json({ status: 400, message: err });
                } else {
                  var jwtdata = {
                    id: resuser[0].id,
                    firstname: resuser[0].first_name,
                    role: resuser[0].role_id,
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
                    token: token,
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
        "select * from users where role_id = 2 and email=? and password=?",
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
                id: resuser[0].id,
                firstname: resuser[0].first_name,
                role: resuser[0].role_id,
                email: resuser[0].email,
              };
              var token = jwt.sign({ jwtdata, IsUserLogin: true }, JWTSECRET, {
                expiresIn: "10d",
              });
              res.json({
                status: 200,
                message: "Welcome",
                data: resuser[0],
                token: token,
                IsUserLogin: true,
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
  "/forgot-password",
  [check("email").exists().isEmail()],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 401, message: err });
      return;
    } else {
      const { email } = req.body;
      var verify_token = Math.floor(1000 + Math.random() * 9000);
      let sql = "update users set auth_token = ? WHERE email = ?";
      conn.query(sql, [verify_token, email], (err, results) => {
        if (err) {
          res.json({ status: 501, message: err });
        } else {
          if (results.affectedRows === 1) {
            var html = "";
            html += `<h1>Forgot your password For Rate My Fitness</h1>`;
            html += `You are now a member for Rate My Fitness <br>`;
            html += `<br> Token is : ${verify_token}`;
            var subject = "Forgot Password User";
            var check = helper.email_helper("", email, subject, html);
            if (check) {
              res.json({ status: 200, message: "Email Send Successfully" });
            } else {
              res.json({ status: 400, message: "Email not sending" });
            }
          } else {
            res.json({ status: 400, message: "No data found" });
          }
        }
      });
    }
  }
);

router.post(
  "/verify-otp",
  [check("email").exists().isEmail(), check("verify_token").exists()],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 401, message: err });
      return;
    } else {
      const { email, verify_token } = req.body;
      let sql = "SELECT * FROM users WHERE email = ? limit 1";
      conn.query(sql, [email], (err, results) => {
        if (err) {
          res.json({ status: 501, message: err });
        } else {
          if (results.length > 0) {
            if (results[0].auth_token == verify_token) {
              res.json({ status: 200, message: "OTP Verify Successfully" });
            } else {
              res.json({ status: 400, message: "Please Valid OTP" });
            }
          } else {
            res.json({ status: 400, message: "No data Found" });
          }
        }
      });
    }
  }
);

router.post(
  "/reset-password",
  [
    check("password")
      .exists()
      .isLength({ min: 6 })
      .withMessage("must be at least 6 chars long"),
    check("confirm_password")
      .exists()
      .isLength({ min: 6 })
      .withMessage("must be at least 6 chars long"),
    check("email").exists().isEmail(),
    check("verify_token").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 401, message: err });
      return;
    } else {
      const password = req.body.password;
      const confirm_password = req.body.confirm_password;
      const email = req.body.email;
      const auth_token = req.body.verify_token;
      if (password !== confirm_password) {
        res.json({
          status: 400,
          message: "Do not match Password and Confirm Password",
        });
      }
      let sql =
        "SELECT * FROM users WHERE email = ? AND auth_token = ? limit 1";
      conn.query(sql, [email, auth_token], (err, results) => {
        if (err) {
          res.json({ status: 501, message: err });
        } else {
          if (results.length > 0) {
            let sql1 = "UPDATE users SET password = ? WHERE email = ?";
            conn.query(
              sql1,
              [
                crypto
                  .createHash("sha256")
                  .update(password, "utf8")
                  .digest("hex"),
                email,
              ],
              function (err, results1) {
                if (err) {
                  res.json({ status: 501, message: err });
                } else {
                  if (results1.affectedRows === 1) {
                    res.json({
                      status: 200,
                      message: "Your password has been successfully changed",
                    });
                  } else {
                    res.json({
                      status: 400,
                      message: "Your password has been not changed",
                    });
                  }
                }
              }
            );
          } else {
            res.json({ status: 400, message: "No data Found" });
          }
        }
      });
    }
  }
);

router.post("/get-blogs", function (req, res, next) {
  let sql = `SELECT * FROM blogs WHERE status != 2 ORDER BY id LIMIT 0,3`;
  conn.query(sql, (err, results) => {
    if (err) {
      res.json({ status: 400, message: err });
    } else {
      if (results.length > 0) {
        let tmpRes = results;
        let resNew = [];
        tmpRes.forEach(function (item) {
          item.date = moment(item.created_at).format("DD");
          item.month = moment(item.created_at).format("MMM");
          resNew.push(item);
        });
        res.json({
          status: 200,
          message: "Blogs Listing Successfully",
          data: resNew,
        });
      } else {
        res.json({ status: 400, message: "No data Found" });
      }
    }
  });
});

router.post("/get-all-blogs", function (req, res, next) {
  let sql = `SELECT * FROM blogs WHERE status != 2 ORDER BY id;SELECT * FROM blogs WHERE status != 2 AND type = 1 ORDER BY id;SELECT * FROM blogs WHERE status != 2 AND type = 2 ORDER BY id;SELECT * FROM blogs WHERE status != 2 AND type = 3 ORDER BY id`;
  conn.query(sql, (err, results) => {
    if (err) {
      res.json({ status: 400, message: err });
    } else {
      if (results.length > 0) {
        let tmpRes = results[0];
        let resNew = [];
        tmpRes.forEach(function (item) {
          item.date = moment(item.created_at).format("DD");
          item.month = moment(item.created_at).format("MMM");
          resNew.push(item);
        });
        let tmpRes1 = results[1];
        let resNew1 = [];
        tmpRes1.forEach(function (item) {
          item.date = moment(item.created_at).format("DD");
          item.month = moment(item.created_at).format("MMM");
          resNew1.push(item);
        });
        let tmpRes2 = results[2];
        let resNew2 = [];
        tmpRes2.forEach(function (item) {
          item.date = moment(item.created_at).format("DD");
          item.month = moment(item.created_at).format("MMM");
          resNew2.push(item);
        });
        let tmpRes3 = results[3];
        let resNew3 = [];
        tmpRes3.forEach(function (item) {
          item.date = moment(item.created_at).format("DD");
          item.month = moment(item.created_at).format("MMM");
          resNew3.push(item);
        });
        res.json({
          status: 200,
          message: "Blogs Listing Successfully",
          data: resNew,
          type1: resNew1,
          type2: resNew2,
          type3: resNew3,
        });
      } else {
        res.json({ status: 400, message: "No data Found" });
      }
    }
  });
});

router.post("/get-trainers", function (req, res, next) {
  let sql = `SELECT * FROM trainers WHERE is_active = 1 ORDER BY trainer_id`;
  conn.query(sql, (err, results) => {
    if (err) {
      res.json({ status: 400, message: err });
    } else {
      if (results.length > 0) {
        let tmpRes = results;
        let resNew = [];
        tmpRes.forEach(function (item) {
          item.rating = parseInt(item.rating);
          resNew.push(item);
        });
        res.json({
          status: 200,
          message: "Trainers Listing Successfully",
          data: resNew,
        });
      } else {
        res.json({ status: 400, message: "No data Found" });
      }
    }
  });
});

router.post(
  "/get_data",
  requireSignin,
  [check("id").exists()],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      var id = req.body.id;
      let sql = "SELECT * FROM users WHERE id = ?";
      conn.query(sql, [id], (err, results) => {
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

router.post(
  "/update-user",
  [
    passport.authenticate("userLogin", { session: false }),
    check("first_name").exists(),
    check("last_name").exists(),
    check("email").exists().isEmail(),
    check("phone").exists(),
    check("id").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let { first_name, last_name, email, phone, id } = req.body;
      let data = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
      };
      let sql = "SELECT * FROM users WHERE email = ? AND id != ?";
      conn.query(sql, [email, id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            res.json({ status: 400, message: "Email Already Exits" });
          } else {
            let sql1 = "UPDATE users SET ? WHERE id = ?";
            conn.query(sql1, [data, id], (err, results1) => {
              if (err) {
                res.json({ status: 400, message: err });
              } else {
                if (results1.affectedRows === 1) {
                  res.json({
                    status: 200,
                    message: "Profile Update Successfully",
                    response: results1[0],
                  });
                } else {
                  res.json({ status: 400, message: "No data Found" });
                }
              }
            });
          }
        }
      });
    }
  }
);

router.post(
  "/find-trainer",
  [
    passport.authenticate("userLogin", { session: false }),
    check("trainer_id").exists(),
  ],
  function (req, res, next) {
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

router.post("/get-gyms", function (req, res, next) {
  let sql = `SELECT * FROM gym WHERE status = 1 ORDER BY gym_id`;
  conn.query(sql, (err, results) => {
    if (err) {
      res.json({ status: 400, message: err });
    } else {
      if (results.length > 0) {
        let tmpRes = results;
        let resNew = [];
        tmpRes.forEach(function (item) {
          resNew.push(item);
        });
        res.json({
          status: 200,
          message: "Gym Listing Successfully",
          data: resNew,
        });
      } else {
        res.json({ status: 400, message: "No data Found" });
      }
    }
  });
});

router.post(
  "/find-gym",
  [
    passport.authenticate("userLogin", { session: false }),
    check("gym_id").exists(),
    check("country").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let { gym_id, country } = req.body;
      let sql = "SELECT * FROM gym WHERE gym_id = ? AND country = ?";
      conn.query(sql, [gym_id, country], (err, results) => {
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

router.post(
  "/get-gym-data",
  [
    passport.authenticate("userLogin", { session: false }),
    check("gym_id").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      var gym_id = req.body.gym_id;
      let sql = "SELECT * FROM gym WHERE gym_id = ?";
      conn.query(sql, [gym_id], (err, results) => {
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

router.post(
  "/get-gym-trainer-data",
  [
    passport.authenticate("userLogin", { session: false }),
    check("gym_id").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      var gym_id = req.body.gym_id;
      let sql = "SELECT * FROM trainers WHERE gym_id = ?";
      conn.query(sql, [gym_id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let tmpRes = results;
            let resNew = [];
            var TotalRow = tmpRes.length;
            var i = 1;
            tmpRes.forEach(function (item) {
              var trainer_id = item["trainer_id"];
              let sql1 = `SELECT COUNT(trainer_feedback_id) as total_feedback FROM trainer_feedbacks WHERE trainer_id = ?`;
              conn.query(sql1, [trainer_id], (err, results1) => {
                if (err) {
                  res.json({ status: 400, message: err });
                } else {
                  if (results1.length > 0) {
                    item.total_feedback = results1[0]["total_feedback"];
                    resNew.push(item);
                    if (i === TotalRow) {
                      display();
                    }
                    i++;
                  }
                }
              });
            });
            function display() {
              res.json({
                status: 200,
                message: "Get Data Successfully",
                data: resNew,
              });
            }
          } else {
            res.json({ status: 400, message: "No data Found" });
          }
        }
      });
    }
  }
);

router.post(
  "/search-gym-trainer-data",
  [
    passport.authenticate("userLogin", { session: false }),
    check("gym_id").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      var gym_id = req.body.gym_id;
      var search = req.body.search;
      let sql =
        "SELECT * FROM trainers WHERE gym_id = ? AND (first_name LIKE '%" +
        search +
        "%' OR last_name LIKE '%" +
        search +
        "%')";
      conn.query(sql, [gym_id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let tmpRes = results;
            let resNew = [];
            var TotalRow = tmpRes.length;
            var i = 1;
            tmpRes.forEach(function (item) {
              var trainer_id = item["trainer_id"];
              let sql1 = `SELECT COUNT(trainer_feedback_id) as total_feedback FROM trainer_feedbacks WHERE trainer_id = ?`;
              conn.query(sql1, [trainer_id], (err, results1) => {
                if (err) {
                  res.json({ status: 400, message: err });
                } else {
                  if (results1.length > 0) {
                    item.total_feedback = results1[0]["total_feedback"];
                    resNew.push(item);
                    if (i === TotalRow) {
                      display();
                    }
                    i++;
                  }
                }
              });
            });
            function display() {
              res.json({
                status: 200,
                message: "Get Data Successfully",
                data: resNew,
              });
            }
          } else {
            res.json({ status: 400, message: "No data Found" });
          }
        }
      });
    }
  }
);

router.post(
  "/get-trainer-data",
  requireSignin,
  [check("trainer_id").exists()],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      var trainer_id = req.body.trainer_id;
      let sql =
        "SELECT tr.*,gm.gym_name FROM trainers tr LEFT JOIN gym gm ON tr.gym_id = gm.gym_id WHERE tr.trainer_id = ?";
      conn.query(sql, [trainer_id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let sql1 = "SELECT * FROM trainers WHERE trainer_id != ? LIMIT 0,5";
            conn.query(sql1, [trainer_id], (err, results1) => {
              if (err) {
                res.json({ status: 400, message: err });
              } else {
                if (results1.length > 0) {
                  res.json({
                    status: 200,
                    message: "Get Data Successfully",
                    data: results[0],
                    similar_data: results1,
                  });
                } else {
                  res.json({
                    status: 200,
                    message: "Get Data Successfully",
                    data: results[0],
                    similar_data: "",
                  });
                }
              }
            });
          } else {
            res.json({ status: 400, message: "No data Found" });
          }
        }
      });
    }
  }
);

router.post(
  "/contact-us",
  [
    check("name").exists(),
    check("email").exists().isEmail(),
    check("phone").exists(),
    check("subject").exists(),
    check("message").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let { name, email, phone, subject, message } = req.body;
      let data = {
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
      };
      let sql1 = "INSERT INTO contact_us SET ?";
      conn.query(sql1, data, (err, results1) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results1.affectedRows === 1) {
            var html = "";
            html += `<h1>Contact For Rate My Fitness</h1>`;
            html += `You are contact for Rate My Fitness <br>`;
            html += `<br> Full Name : ` + name;
            html += `<br> Phone : ` + phone;
            html += `<br> Message : ` + message;
            var check = helper.email_helper("", email, subject, html);
            if (check) {
              res.json({
                status: 200,
                message: "Send Mail Successfully",
                response: results1[0],
              });
            } else {
              res.json({
                status: 200,
                message: "Send Mail Failed",
                response: results1[0],
              });
            }
          } else {
            res.json({ status: 400, message: "No data Found" });
          }
        }
      });
    }
  }
);

router.get(
  "/get-similar-trainer",
  [check("trainer_id").exists(), check("rating").exists()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      conn.query(
        `SELECT CONCAT(first_name, ' ', last_name) AS name,rating FROM trainers WHERE rating BETWEEN ${(req.body.rating -= 0.5)} AND ${(req.body.rating += 1.0)}`,
        (err, results) => {
          if (err) {
            res.json({ status: 400, message: err });
          } else {
            if (results.length > 0) {
              res.json({
                status: 200,
                message: "Get Data Successfully",
                data: results,
              });
            } else {
              res.json({ status: 400, message: "No data Found" });
            }
          }
        }
      );
    }
  }
);

router.post(
  "/rate-trainer",
  [
    passport.authenticate("userLogin", { session: false }),
    check("trainer_id").exists(),
    check("user_id").exists(),
    check("exercise_id").exists(),
    check("trainer_rate").exists(),
    check("level_of_difficulty").exists(),
    check("is_online_training").exists(),
    check("will_take_training_again").exists(),
    check("comment").exists(),
    check("tags").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let {
        trainer_id,
        user_id,
        exercise_id,
        trainer_rate,
        level_of_difficulty,
        is_online_training,
        will_take_training_again,
        comment,
        tags,
      } = req.body;
      var is_online_training_1 = 1;
      if (is_online_training == true) {
        is_online_training_1 = 0;
      }
      let data = {
        trainer_id: parseInt(trainer_id),
        user_id: parseInt(user_id),
        exercise_id: parseInt(exercise_id),
        trainer_rate: trainer_rate,
        level_of_difficulty: level_of_difficulty,
        is_online_training: is_online_training_1,
        will_take_training_again: will_take_training_again,
        comment: comment,
        tags: tags.join(),
      };
      let sql =
        "SELECT * FROM trainer_feedbacks WHERE user_id = ? AND trainer_id = ?";
      conn.query(sql, [user_id, trainer_id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let sql1 =
              "UPDATE trainer_feedbacks SET ? WHERE user_id = ? AND trainer_id = ?";
            conn.query(sql1, [data, user_id, trainer_id], (err, results1) => {
              if (err) {
                res.json({ status: 400, message: err });
              } else {
                if (results1.affectedRows === 1) {
                  let sql2 =
                    "SELECT AVG(trainer_rate) as trainer_rate FROM trainer_feedbacks WHERE trainer_id = ?";
                  conn.query(sql2, [trainer_id], (err, results2) => {
                    if (err) {
                      res.json({ status: 400, message: err });
                    } else {
                      if (results2.length > 0) {
                        var data1 = { rating: results2[0]["trainer_rate"] };
                        let sql3 = "UPDATE trainers SET ? WHERE trainer_id = ?";
                        conn.query(
                          sql3,
                          [data1, trainer_id],
                          (err, results3) => {
                            if (err) {
                              res.json({ status: 400, message: err });
                            } else {
                              if (results3.affectedRows === 1) {
                                let sql4 =
                                  "SELECT * FROM trainers WHERE trainer_id = ?";
                                conn.query(
                                  sql4,
                                  [trainer_id],
                                  (err, results4) => {
                                    if (err) {
                                      res.json({ status: 400, message: err });
                                    } else {
                                      if (results4.length > 0) {
                                        res.json({
                                          status: 200,
                                          message:
                                            "Trainer Review Successfully",
                                          data: results4[0],
                                        });
                                      }
                                    }
                                  }
                                );
                              }
                            }
                          }
                        );
                      }
                    }
                  });
                } else {
                  res.json({ status: 400, message: "No data Found" });
                }
              }
            });
          } else {
            let sql1 = "INSERT INTO trainer_feedbacks SET ?";
            conn.query(sql1, data, (err, results1) => {
              if (err) {
                res.json({ status: 400, message: err });
              } else {
                if (results1.affectedRows === 1) {
                  let sql2 =
                    "SELECT AVG(trainer_rate) as trainer_rate FROM trainer_feedbacks WHERE trainer_id = ?";
                  conn.query(sql2, [trainer_id], (err, results2) => {
                    if (err) {
                      res.json({ status: 400, message: err });
                    } else {
                      if (results2.length > 0) {
                        var data1 = { rating: results2[0]["trainer_rate"] };
                        let sql3 = "UPDATE trainers SET ? WHERE trainer_id = ?";
                        conn.query(
                          sql3,
                          [data1, trainer_id],
                          (err, results3) => {
                            if (err) {
                              res.json({ status: 400, message: err });
                            } else {
                              if (results3.affectedRows === 1) {
                                let sql4 =
                                  "SELECT * FROM trainers WHERE trainer_id = ?";
                                conn.query(
                                  sql4,
                                  [trainer_id],
                                  (err, results4) => {
                                    if (err) {
                                      res.json({ status: 400, message: err });
                                    } else {
                                      if (results4.length > 0) {
                                        res.json({
                                          status: 200,
                                          message:
                                            "Trainer Review Successfully",
                                          data: results4[0],
                                        });
                                      }
                                    }
                                  }
                                );
                              }
                            }
                          }
                        );
                      }
                    }
                  });
                } else {
                  res.json({ status: 400, message: "No data Found" });
                }
              }
            });
          }
        }
      });
    }
  }
);

router.post(
  "/get-exercises-data",
  [passport.authenticate("userLogin", { session: false })],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let sql = "SELECT * FROM exercises";
      conn.query(sql, (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            res.json({
              status: 200,
              message: "Get Data Successfully",
              data: results,
            });
          } else {
            res.json({ status: 400, message: "No data Found" });
          }
        }
      });
    }
  }
);

router.post(
  "/get-ratings",
  [
    passport.authenticate("userLogin", { session: false }),
    check("user_id").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let user_id = req.body.user_id;
      let sql = `SELECT * FROM trainer_feedbacks tf LEFT JOIN trainers tr ON tf.trainer_id = tr.trainer_id WHERE tf.user_id = ?`;
      conn.query(sql, [user_id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let tmpRes = results;
            let resNew = [];
            tmpRes.forEach(function (item) {
              item.feedback_created_at = moment(
                item.feedback_created_at
              ).format("DD MMM YY");
              item.trainer_rate = parseFloat(item.trainer_rate).toFixed(1);
              resNew.push(item);
            });
            res.json({
              status: 200,
              message: "Trainers Listing Successfully",
              data: resNew,
            });
          } else {
            res.json({ status: 400, message: "No Reviews Found" });
          }
        }
      });
    }
  }
);

router.post(
  "/get-feedback-data",
  [
    passport.authenticate("userLogin", { session: false }),
    check("user_id").exists(),
    check("trainer_id").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let { user_id, trainer_id } = req.body;
      let sql = `SELECT * FROM trainer_feedbacks WHERE user_id = ? AND trainer_id = ?`;
      conn.query(sql, [user_id, trainer_id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let tmpRes = results;
            let resNew = [];
            tmpRes.forEach(function (item) {
              var str = item.tags;
              item.tags = str.split(",");
              resNew.push(item);
            });
            res.json({
              status: 200,
              message: "Get Feedback Successfully",
              data: resNew[0],
            });
          } else {
            res.json({ status: 400, message: "No Reviews Found" });
          }
        }
      });
    }
  }
);

router.post(
  "/get-avg-feedback-data",
  [
    passport.authenticate("userLogin", { session: false }),
    check("trainer_id").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let trainer_id = req.body.trainer_id;
      let sql = `SELECT COUNT(trainer_feedback_id) as total_feedback,AVG(trainer_rate) as avg_trainer_rate,AVG(level_of_difficulty) as avg_level_of_difficulty,concat(round(COUNT(IF(will_take_training_again = 1, 1, NULL))*100/COUNT(trainer_feedback_id)), '%') as will_take_training_again FROM trainer_feedbacks WHERE trainer_id = ?`;
      conn.query(sql, [trainer_id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let tmpRes = results[0];
            if (tmpRes["total_feedback"] > 0) {
              let resNew = [];
              resNew.push(tmpRes);
              let sql1 = `SELECT tf.tags,tf.comment,tf.feedback_created_at FROM trainer_feedbacks tf LEFT JOIN tags tt ON tt.tag_id = tf.tags WHERE tf.trainer_id = ? ORDER BY tf.feedback_created_at DESC LIMIT 1`;
              conn.query(sql1, [trainer_id], (err, results1) => {
                if (err) {
                  res.json({ status: 400, message: err });
                } else {
                  if (results1.length > 0) {
                    let tmpRes1 = results1;
                    tmpRes1.forEach(function (item) {
                      item.feedback_created_at = moment(
                        item.feedback_created_at
                      ).format("DD MMMM, YYYY");
                      resNew.push(item);
                    });
                    var tags = tmpRes1[0]["tags"];
                    let sql2 =
                      "SELECT GROUP_CONCAT(tag_name) as tag_name FROM tags WHERE tag_id IN (" +
                      tags +
                      ")";
                    conn.query(sql2, (err, results2) => {
                      if (err) {
                        res.json({ status: 400, message: err });
                      } else {
                        if (results2.length > 0) {
                          let tmpRes2 = results2;
                          resNew.push(tmpRes2);
                          res.json({
                            status: 200,
                            message: "Get Feedback Successfully",
                            data: resNew,
                          });
                        }
                      }
                    });
                  } else {
                    res.json({
                      status: 200,
                      message: "Get Feedback Successfully",
                      data: resNew,
                    });
                  }
                }
              });
            } else {
              res.json({ status: 400, message: "No Feedback Found" });
            }
          } else {
            res.json({ status: 400, message: "No Feedback Found" });
          }
        }
      });
    }
  }
);

router.post(
  "/get-tags",
  [passport.authenticate("userLogin", { session: false })],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let user_id = req.body.user_id;
      let sql = `SELECT * FROM tags`;
      conn.query(sql, (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let tmpRes = results;
            let resNew = [];
            tmpRes.forEach(function (item) {
              item.id = item.tag_id;
              item.text = item.tag_name;
              delete item.tag_id;
              delete item.tag_name;
              resNew.push(item);
            });
            res.json({
              status: 200,
              message: "Trainers Listing Successfully",
              data: resNew,
            });
          } else {
            res.json({ status: 400, message: "No Reviews Found" });
          }
        }
      });
    }
  }
);

router.post(
  "/get-blog-data",
  [
    //passport.authenticate('userLogin', { session: false }),
    check("blog_id").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      var blog_id = req.body.blog_id;
      let sql = "SELECT * FROM blogs WHERE status != 2 AND id = ?";
      conn.query(sql, [blog_id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let tmpRes = results;
            let resNew = [];
            tmpRes.forEach(function (item) {
              item.created_at = moment(item.created_at).format("DD/MM/YYYY");
              resNew.push(item);
            });
            res.json({
              status: 200,
              message: "Get Data Successfully",
              data: resNew[0],
            });
          } else {
            res.json({ status: 400, message: "No data Found" });
          }
        }
      });
    }
  }
);

router.post(
  "/get-trainer-rating-data",
  [
    passport.authenticate("userLogin", { session: false }),
    check("trainer_id").exists(),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors
        .array()
        .map((err) => ({ field: err.param, message: err.msg }));
      res.json({ status: 501, message: err });
      return;
    } else {
      let trainer_id = req.body.trainer_id;
      let sql = `SELECT * FROM trainer_feedbacks WHERE trainer_id = ?`;
      conn.query(sql, [trainer_id], (err, results) => {
        if (err) {
          res.json({ status: 400, message: err });
        } else {
          if (results.length > 0) {
            let tmpRes = results;
            let resNew = [];
            var TotalRow = results.length;
            var i = 1;
            tmpRes.forEach(function (item) {
              var tags = item.tags;
              let sql2 =
                "SELECT tag_name FROM tags WHERE tag_id IN (" + tags + ")";
              conn.query(sql2, (err, results2) => {
                if (err) {
                  res.json({ status: 400, message: err });
                } else {
                  if (results2.length > 0) {
                    item.tag_name = results2;
                    item.feedback_created_at = moment(
                      item.feedback_created_at
                    ).format("DD MMMM, YYYY");
                    resNew.push(item);
                    if (i === TotalRow) {
                      display();
                    }
                    i++;
                  }
                }
              });
            });
            function display() {
              res.json({
                status: 200,
                message: "Get Feedback Successfully",
                data: resNew,
              });
            }
          } else {
            res.json({ status: 400, message: "No Reviews Found" });
          }
        }
      });
    }
  }
);

module.exports = router;
