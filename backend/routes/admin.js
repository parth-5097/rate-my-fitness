var express = require('express');
var passport = require('passport');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
var router = express.Router();
const moment = require('moment');
const { check, validationResult } = require('express-validator');
var EmailValidator = require("email-validator");
const conn=require('../database/connection.db');
const helper = require('../helper/helper');
var JWTSECRET = process.env.ADMINJWTSECRET;
var async = require('async');

router.post('/login', [
    check('email').exists(),
    check('password').exists()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 401, message: err});
        return
    } else {
        var { email, password } = req.body
        email = email.toLowerCase();
        conn.query('select * from users where role_id = 1 and email=? and password=?', [email, crypto.createHash('sha256').update(password, 'utf8').digest('hex')], async(err, resuser) => {
            if (err) {
                res.json({status: 501, message: err});
            } else if (resuser.length > 0) {
                if (resuser[0]['is_active'] == 2) {
                    res.json({status: 201, message: 'account is blocked.'});
                } else if (resuser[0]['is_active'] == 0) {
                    res.json({status: 201, message: 'account is not active.'});
                } else {
                    var jwtdata = {
                        id: resuser[0].id,
                        firstname: resuser[0].name,
                        role: resuser[0].role_id,
                        email: resuser[0].email
                    }
                    var token = jwt.sign({ jwtdata, loggedIn: true }, JWTSECRET, { expiresIn: '10d' });
                    res.json({status: 200, message: 'Welcome', data: resuser[0], token: token, loggedIn: true});
                }
            } else {
                res.json({status: 201, message: 'Invalid credentials.'});
            }
        })
    }
})

router.post('/forgot-password',[
    check('email').exists().isEmail(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 401, message: err});
        return
    }else {
        const {email} = req.body;
        var verify_token = Math.floor(1000 + Math.random() * 9000);
        let sql = "update users set auth_token = ? WHERE email = ?";
        conn.query(sql, [verify_token,email], (err, results) => {
            if (err) {
                res.json({status: 501, message: err});
            } else {
                if (results.affectedRows === 1) {
                    var html = "";
                    html += `<h1>Forgot your password For Rate My Fitness</h1>`;
                    html += `You are now a member for Rate My Fitness <br>`;
                    html += `<br> Token is : ${verify_token}`;
                    var subject = "Forgot Password Admin"
                    var check  = helper.email_helper('',email,subject,html)
                    if (check){
                        res.json({status: 200, message: 'Email Send Successfully'});
                    }else {
                        res.json({status: 400, message: 'Email not sending'});
                    }
                } else {
                    res.json({status: 400, message: 'No data found'});
                }
            }
        });
    }
});

router.post('/verify-otp',[
    check('email').exists().isEmail(),
    check('verify_token').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 401, message: err});
        return
    }else {
        const {email,verify_token} = req.body;
        let sql = "SELECT * FROM users WHERE email = ? limit 1";
        conn.query(sql, [email], (err, results) => {
            if (err) {
                res.json({status: 501, message: err});
            } else {
                if (results.length > 0){
                    if (results[0].auth_token == verify_token){
                        res.json({status: 200, message: 'OTP Verify Successfully'});
                    }else {
                        res.json({status: 400, message: 'Please Valid OTP'});
                    }
                } else {
                    res.json({status: 400, message: 'No data Found'});
                }
            }
        });
    }
});

router.post('/reset-password',[
    check('password').exists().isLength({ min: 6 }).withMessage('must be at least 6 chars long'),
    check('confirm_password').exists().isLength({ min: 6 }).withMessage('must be at least 6 chars long'),
    check('email').exists().isEmail(),
    check('verify_token').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 401, message: err});
        return
    }else {
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        const email = req.body.email;
        const auth_token = req.body.verify_token;
        if(password !== confirm_password){
            res.json({status: 400, message: 'Do not match Password and Confirm Password'});
        }
        let sql = "SELECT * FROM users WHERE email = ? AND auth_token = ? limit 1";
        conn.query(sql, [email,auth_token], (err, results) => {
            if (err) {
                res.json({status: 501, message: err});
            } else {
                if (results.length > 0){
                    let sql1 = "UPDATE users SET password = ? WHERE email = ?";
                    conn.query(sql1, [crypto.createHash('sha256').update(password, 'utf8').digest('hex'),email], function (err, results1) {
                        if (err) {
                            res.json({status: 501, message: err});
                        } else {
                            if (results1.affectedRows === 1){
                                res.json({status: 200, message: "Your password has been successfully changed"});
                            }else{
                                res.json({status: 400, message: "Your password has been not changed"});
                            }
                        }
                    });
                } else {
                    res.json({status: 400, message: 'No data Found'});
                }
            }
        });
    }
});

router.post('/get_data',[
    passport.authenticate('adminLogin', { session: false }),
    check('id').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        var id = req.body.id;
        let sql = "SELECT * FROM users WHERE id = ?";
        conn.query(sql, [id], (err, results) => {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                if (results.length > 0) {
                    res.json({status: 200, message: 'Get Data Successfully', data: results[0]});
                } else {
                    res.json({status: 400, message: 'No data Found'});
                }
            }
        });
    }
});

router.post('/get-trainer-data',[
    passport.authenticate('adminLogin', { session: false }),
    check('trainer_id').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        var trainer_id = req.body.trainer_id;
        let sql = "SELECT * FROM trainers WHERE trainer_id = ?";
        conn.query(sql, [trainer_id], (err, results) => {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                if (results.length > 0) {
                    res.json({status: 200, message: 'Get Data Successfully', data: results[0]});
                } else {
                    res.json({status: 400, message: 'No data Found'});
                }
            }
        });
    }
});

router.post('/update-profile',[
    passport.authenticate('adminLogin', { session: false }),
    check('id').exists(),
    check('first_name').exists(),
    check('last_name').exists(),
    check('email').exists(),
    check('phone').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let {id,first_name,last_name,email,phone} = req.body;
        let data = {
            first_name:first_name,
            last_name:last_name,
            phone:phone
        };
        let sql = "SELECT * FROM users WHERE email = ? AND id != ?";
        conn.query(sql,[email,id],(err, results) => {
            if(err){
                res.json({status: 400, message: err});
            }else {
                if (results.length > 0) {
                    res.json({status: 400, message: "Email Already Exits"});
                }else{
                    if (req.files && Object.keys(req.files).length > 0) {
                        let avatar = req.files.avatar;
                        let filename = Math.floor(Math.random() * 100000)+'-'+avatar.name;
                        let file_url = './upload/'+filename;
                        let file_name = 'upload/'+filename;
                        avatar.mv(file_url, function (error) {
                            if (error) {
                                res.json({status: 400, message: error});
                            }else{
                                data.avatar = file_name;
                                let sql1 = "UPDATE users SET ? WHERE id = ?";
                                conn.query(sql1, [data,id], (err, results1) => {
                                    if (err) {
                                        res.json({status: 400, message: err});
                                    } else {
                                        if (results1.affectedRows === 1) {
                                            res.json({status: 200, message: 'Profile Update Successfully', data:results1[0]});
                                        } else {
                                            res.json({status: 400, message: 'No data Found'});
                                        }
                                    }
                                });
                            }
                        });
                    }else {
                        let sql1 = "UPDATE users SET ? WHERE id = ?";
                        conn.query(sql1, [data, id], (err, results1) => {
                            if (err) {
                                res.json({status: 400, message: err});
                            } else {
                                if (results1.affectedRows === 1) {
                                    res.json({status: 200, message: 'Profile Update Successfully', data:results1[0]});
                                } else {
                                    res.json({status: 400, message: 'No data Found'});
                                }
                            }
                        });
                    }
                }
            }
        });
    }
});

router.post('/change-password',[
    passport.authenticate('adminLogin', { session: false }),
    check('id').exists(),
    check('password').exists(),
    check('newpassword').exists(),
    check('retypepassword').exists()
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let {id,password,newpassword,retypepassword} = req.body;
        let data = {};
        let sql = "SELECT * FROM users WHERE password = ? AND id = ?";
        conn.query(sql,[crypto.createHash('sha256').update(password, 'utf8').digest('hex'),id],(err, results) => {
            if(err){
                res.json({status: 400, message: err});
            }else {
                if (results.length > 0) {
                    data.password = crypto.createHash('sha256').update(newpassword, 'utf8').digest('hex');
                    let sql1 = "UPDATE users SET ? WHERE id = ?";
                    conn.query(sql1, [data,id], (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                res.json({status: 200, message: 'Change Password Successfully'});
                            } else {
                                res.json({status: 400, message: 'Change password failed'});
                            }
                        }
                    });
                }else{
                    res.json({status: 400, message: 'Old Password is Wrong!'});
                }
            }
        });
    }
});

router.post('/get-users', [passport.authenticate('adminLogin', { session: false })], function(req, res, next) {
    let { start,length,order,columns,search_text } = req.body;
    let search="WHERE role_id = 2";
    Object.entries(search_text).forEach(([key, value]) => {
        if(value!==""){
            if(search==="")
            {
                search +=" and "+key+" LIKE '%"+value+"%'";
            }else{
                search +=" and "+ key+" LIKE '%"+value+"%'";
            }
        }
    });
    let sql = `SELECT * FROM users ${search} ORDER BY ${ columns[order[0].column].data} ${order[0].dir} limit ?,?;SELECT count(*) as cnt FROM users ${search}`;
    let query = conn.query(sql,[start,length],(err, results) => {
        if(err){
            res.json({status: 400, message: err});
        }else {
            if (results[0].length > 0) {
                res.json({status: 200, message: "Employer Listing Successfully", response: results[0],"TotalRecords":results[1][0]['cnt']});
            }else{
                res.json({status: 400, message: 'No data Found', TotalRecords:0});
            }
        }
    });
});

router.post('/users-change-status',[
    passport.authenticate('adminLogin', { session: false }),
    check('id').exists()
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let is_active = 1;
        let id = req.body.id;
        let sql = "SELECT * FROM users WHERE id = ?";
        conn.query(sql, [id], (err, results) => {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                if (results.length > 0) {
                    let responseActive = results[0].is_active;
                    if(responseActive === 1){
                        is_active = 0;
                    }
                    let sql1 = "UPDATE users SET is_active = ? WHERE id = ?";
                    conn.query(sql1, [is_active,id], (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                if(is_active === 1){
                                    res.json({status: 200, message: "Status is Active", response: 1});
                                }else{
                                    res.json({status: 200, message: "Status is Deactivate", response: 0});
                                }
                            } else {
                                res.json({status: 400, message: 'No data Found'});
                            }
                        }
                    });
                } else {
                    res.json({status: 400, message: 'No data Found'});
                }
            }
        });
    }
});

router.post('/trainer-change-status',[
    passport.authenticate('adminLogin', { session: false }),
    check('trainer_id').exists()
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let is_active = 1;
        let trainer_id = req.body.trainer_id;
        let sql = "SELECT * FROM trainers WHERE trainer_id = ?";
        conn.query(sql, [trainer_id], (err, results) => {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                if (results.length > 0) {
                    let responseActive = results[0].is_active;
                    if(responseActive === 1){
                        is_active = 0;
                    }
                    let sql1 = "UPDATE trainers SET is_active = ? WHERE trainer_id = ?";
                    conn.query(sql1, [is_active,trainer_id], (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                if(is_active === 1){
                                    res.json({status: 200, message: "Status is Active", response: 1});
                                }else{
                                    res.json({status: 200, message: "Status is Deactivate", response: 0});
                                }
                            } else {
                                res.json({status: 400, message: 'No data Found'});
                            }
                        }
                    });
                } else {
                    res.json({status: 400, message: 'No data Found'});
                }
            }
        });
    }
});

router.post('/remove-users',[
    passport.authenticate('adminLogin', { session: false }),
    check('id').exists()
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        var id = req.body.id;
        let sql = "DELETE FROM users WHERE id = ?";
        conn.query(sql, [id], function (err, results) {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                res.json({status: 200, message: "Users remove successfully", response: results});
            }
        });
    }
});

router.post('/remove-trainer',[
    passport.authenticate('adminLogin', { session: false }),
    check('trainer_id').exists()
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        var trainer_id = req.body.trainer_id;
        let sql = "DELETE FROM trainers WHERE trainer_id = ?";
        conn.query(sql, [trainer_id], function (err, results) {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                res.json({status: 200, message: "trainers remove successfully", response: results});
            }
        });
    }
});

router.post('/add-user',[
    passport.authenticate('adminLogin', { session: false }),
    check('first_name').exists(),
    check('last_name').exists(),
    check('email').exists().isEmail(),
    check('phone').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let {first_name,last_name,email,phone} = req.body;
        let data = {
            role_id:2,
            is_active:1,
            first_name:first_name,
            last_name:last_name,
            email:email,
            phone:phone
        };
        let sql = "SELECT * FROM users WHERE email = ?";
        let query = conn.query(sql,[email],(err, results) => {
            if(err){
                res.json({status: 400, message: err});
            }else {
                if (results.length > 0) {
                    res.json({status: 400, message: "Email Already Exits"});
                }else{
                    let sql1 = "INSERT INTO users SET ?";
                    let query1 = conn.query(sql1, data, (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                res.json({status: 200, message: "Create User Successfully", response: results1[0]});
                            } else {
                                res.json({status: 400, message: 'No data Found'});
                            }
                        }
                    });
                }
            }
        });
    }
});


router.post('/update-user',[
    passport.authenticate('adminLogin', { session: false }),
    check('first_name').exists(),
    check('last_name').exists(),
    check('email').exists().isEmail(),
    check('phone').exists(),
    check('id').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let {first_name,last_name,email,phone,id} = req.body;
        let data = {
            first_name:first_name,
            last_name:last_name,
            email:email,
            phone:phone
        };
        let sql = "SELECT * FROM users WHERE email = ? AND id != ?";
        conn.query(sql,[email,id],(err, results) => {
            if(err){
                res.json({status: 400, message: err});
            }else {
                if (results.length > 0) {
                    res.json({status: 400, message: "Email Already Exits"});
                }else{
                    let sql1 = "UPDATE users SET ? WHERE id = ?";
                    conn.query(sql1, [data, id], (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                res.json({status: 200, message: "Update User Successfully", response: results1[0]});
                            } else {
                                res.json({status: 400, message: 'No data Found'});
                            }
                        }
                    });
                }
            }
        });
    }
});

router.post('/export-users',[passport.authenticate('adminLogin', { session: false })], function(req, res, next) {
    let sql = "SELECT id,first_name,last_name,email,phone,created_at,is_active FROM users WHERE role_id = 2";
    let query = conn.query(sql,(err, results) => {
        if(err){
            res.json({status: 400, message: err});
        }else {
            if (results.length > 0) {
                let tmpRes = results;
                let resNew = [];
                tmpRes.forEach(function (item)
                {
                    item.created_at = moment(item.created_at).format('DD/MM/YYYY');
                    resNew.push(item);
                });
                res.json({status: 200, message: "Export Users Listing Successfully", response: resNew});
            }else{
                res.json({status: 400, message: 'No data Found'});
            }
        }
    });
});


router.post('/get-gym', [passport.authenticate('adminLogin', { session: false })], function(req, res, next) {
    let { start,length,order,columns,search_text } = req.body;
    let search="WHERE is_deleted = 0";
    Object.entries(search_text).forEach(([key, value]) => {
        if(value!==""){
            if(search==="")
            {
                search +=" and "+key+" LIKE '%"+value+"%'";
            }else{
                search +=" and "+ key+" LIKE '%"+value+"%'";
            }
        }
    });
    let sql = `SELECT * FROM gym ${search} ORDER BY ${ columns[order[0].column].data} ${order[0].dir} limit ?,?;SELECT count(*) as cnt FROM gym ${search}`;
    let query = conn.query(sql,[start,length],(err, results) => {
        if(err){
            res.json({status: 400, message: err});
        }else {
            if (results[0].length > 0) {
                res.json({status: 200, message: "Gym Listing Successfully", response: results[0],"TotalRecords":results[1][0]['cnt']});
            }else{
                res.json({status: 400, message: 'No data Found', TotalRecords:0});
            }
        }
    });
});

router.post('/gym-change-status',[
    passport.authenticate('adminLogin', { session: false }),
    check('gym_id').exists()
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let status = 1;
        let gym_id = req.body.gym_id;
        let sql = "SELECT * FROM gym WHERE gym_id = ?";
        conn.query(sql, [gym_id], (err, results) => {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                if (results.length > 0) {
                    let responseActive = results[0].status;
                    if(responseActive === 1){
                        status = 0;
                    }
                    let sql1 = "UPDATE gym SET status = ? WHERE gym_id = ?";
                    conn.query(sql1, [status,gym_id], (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                if(status === 1){
                                    res.json({status: 200, message: "Status is Active", response: 1});
                                }else{
                                    res.json({status: 200, message: "Status is Deactivate", response: 0});
                                }
                            } else {
                                res.json({status: 400, message: 'No data Found'});
                            }
                        }
                    });
                } else {
                    res.json({status: 400, message: 'No data Found'});
                }
            }
        });
    }
});

router.post('/remove-gym',[
    passport.authenticate('adminLogin', { session: false }),
    check('gym_id').exists()
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        var gym_id = req.body.gym_id;
        let sql = "UPDATE gym SET is_deleted = ? WHERE gym_id = ?";
        conn.query(sql, [1,gym_id], function (err, results) {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                res.json({status: 200, message: "Record remove successfully", response: results});
            }
        });
    }
});


router.post('/add-gym',[
    passport.authenticate('adminLogin', { session: false }),
    check('gym_name').exists(),
    check('description').exists(),
    check('country').exists(),
    check('suite_number').exists(),
    check('street_address').exists(),
    check('city').exists(),
    check('state').exists(),
    check('phone').exists(),
    check('zipcode').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let {gym_name,description,country,suite_number,street_address,city,state,phone,zipcode} = req.body;
        let data = {
            status:1,
            gym_name:gym_name,
            description:description,
            country:country,
            suite_number:suite_number,
            street_address:street_address,
            city:city,
            state:state,
            phone:phone,
            zipcode:zipcode,
            is_deleted:0,
        };
        if (req.files && Object.keys(req.files).length > 0) {
            let gym_avatar = req.files.gym_avatar;
            let filename = Math.floor(Math.random() * 100000)+'-'+gym_avatar.name;
            let file_url = './upload/'+filename;
            let file_name = 'upload/'+filename;
            gym_avatar.mv(file_url, function (error) {
                if (error) {
                    res.json({status: 400, message: err});
                }else{
                    data.gym_avatar = file_name;
                    let sql1 = "INSERT INTO gym SET ?";
                    conn.query(sql1, data, (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                res.json({status: 200, message: "Create Gym Successfully", response: results1[0]});
                            } else {
                                res.json({status: 400, message: 'No data Found'});
                            }
                        }
                    });
                }
            });
        }else {
            let sql1 = "INSERT INTO gym SET ?";
            conn.query(sql1, data, (err, results1) => {
                if (err) {
                    res.json({status: 400, message: err});
                } else {
                    if (results1.affectedRows === 1) {
                        res.json({status: 200, message: "Create Gym Successfully", response: results1[0]});
                    } else {
                        res.json({status: 400, message: 'No data Found'});
                    }
                }
            });
        }
    }
});

router.post('/get-gym-data',[
    passport.authenticate('adminLogin', { session: false }),
    check('gym_id').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        var gym_id = req.body.gym_id;
        let sql = "SELECT * FROM gym WHERE is_deleted = 0 AND gym_id = ?";
        conn.query(sql, [gym_id], (err, results) => {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                if (results.length > 0) {
                    res.json({status: 200, message: 'Get Data Successfully', data: results[0]});
                } else {
                    res.json({status: 400, message: 'No data Found'});
                }
            }
        });
    }
});

router.post('/update-gym',[
    passport.authenticate('adminLogin', { session: false }),
    check('gym_id').exists(),
    check('gym_name').exists(),
    check('description').exists(),
    check('country').exists(),
    check('suite_number').exists(),
    check('street_address').exists(),
    check('city').exists(),
    check('state').exists(),
    check('phone').exists(),
    check('zipcode').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let {gym_id,gym_name,description,country,suite_number,street_address,city,state,phone,zipcode} = req.body;
        let data = {
            gym_name:gym_name,
            description:description,
            country:country,
            suite_number:suite_number,
            street_address:street_address,
            city:city,
            state:state,
            phone:phone,
            zipcode:zipcode,
        };
        if (req.files && Object.keys(req.files).length > 0) {
            let gym_avatar = req.files.gym_avatar;
            let filename = Math.floor(Math.random() * 100000)+'-'+gym_avatar.name;
            let file_url = './upload/'+filename;
            let file_name = 'upload/'+filename;
            gym_avatar.mv(file_url, function (error) {
                if (error) {
                    res.json({status: 400, message: err});
                }else{
                    data.gym_avatar = file_name;
                    let sql1 = "UPDATE gym SET ? WHERE is_deleted = 0 AND gym_id = ?";
                    conn.query(sql1, [data,gym_id], (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                res.json({status: 200, message: "Gym Update Successfully", response: results1[0]});
                            } else {
                                res.json({status: 400, message: 'No data Found'});
                            }
                        }
                    });
                }
            });
        }else {
            let sql1 = "UPDATE gym SET ? WHERE is_deleted = 0 AND gym_id = ?";
            conn.query(sql1, [data,gym_id], (err, results1) => {
                if (err) {
                    res.json({status: 400, message: err});
                } else {
                    if (results1.affectedRows === 1) {
                        res.json({status: 200, message: "Gym Update Successfully", response: results1[0]});
                    } else {
                        res.json({status: 400, message: 'No data Found'});
                    }
                }
            });
        }
    }
});

router.post('/export-gym',[passport.authenticate('adminLogin', { session: false })], function(req, res, next) {
    let sql = "SELECT gym_id,gym_name,description,phone,suite_number,street_address,city,state,zipcode,created_at,status FROM gym WHERE is_deleted = 0";
    conn.query(sql,(err, results) => {
        if(err){
            res.json({status: 400, message: err});
        }else {
            if (results.length > 0) {
                let tmpRes = results;
                let resNew = [];
                tmpRes.forEach(function (item)
                {
                    item.created_at = moment(item.created_at).format('DD/MM/YYYY');
                    resNew.push(item);
                });
                res.json({status: 200, message: "Export Gym Listing Successfully", response: resNew});
            }else{
                res.json({status: 400, message: 'No data Found'});
            }
        }
    });
});

router.post('/add-trainer',[
    passport.authenticate('adminLogin', { session: false }),
    check('first_name').exists(),
    check('last_name').exists(),
    check('about').exists(),
    check('email').exists(),
    check('phone').exists()
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let {first_name,last_name,email,phone,stars,about,gym_id} = req.body;
        let data = {
            is_active:1,
            first_name:first_name,
            last_name:last_name,
            about:about,
            email:email,
            phone:phone,
            rating:stars
        };
        if(gym_id != '' && gym_id != undefined && gym_id != null){
            data.gym_id = gym_id
        }
        let sql = "SELECT * FROM trainers WHERE email = ?";
        conn.query(sql,[email],(err, results) => {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                if (results.length > 0) {
                    res.json({status: 400, message: "Email Already Exits"});
                } else {
                    if (req.files && Object.keys(req.files).length > 0) {
                        let avatar = req.files.avatar;
                        let filename = Math.floor(Math.random() * 100000) + '-' + avatar.name;
                        let file_url = './upload/' + filename;
                        let file_name = 'upload/' + filename;
                        avatar.mv(file_url, function (error) {
                            if (error) {
                                res.json({status: 400, message: err});
                            } else {
                                data.avatar = file_name;
                                let sql1 = "INSERT INTO trainers SET ?";
                                conn.query(sql1, data, (err, results1) => {
                                    if (err) {
                                        res.json({status: 400, message: err});
                                    } else {
                                        if (results1.affectedRows === 1) {
                                            res.json({
                                                status: 200,
                                                message: "Create Trainer Successfully",
                                                response: results1[0]
                                            });
                                        } else {
                                            res.json({status: 400, message: 'No data Found'});
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        let sql1 = "INSERT INTO trainers SET ?";
                        conn.query(sql1, data, (err, results1) => {
                            if (err) {
                                res.json({status: 400, message: err});
                            } else {
                                if (results1.affectedRows === 1) {
                                    res.json({
                                        status: 200,
                                        message: "Create Trainer Successfully",
                                        response: results1[0]
                                    });
                                } else {
                                    res.json({status: 400, message: 'No data Found'});
                                }
                            }
                        });
                    }
                }
            }
        });
    }
});

router.post('/get-trainers', [passport.authenticate('adminLogin', { session: false })], function(req, res, next) {
    let { start,length,order,columns,search_text } = req.body;
    let search="";
    Object.entries(search_text).forEach(([key, value]) => {
        if(value!==""){
            if(search==="")
            {
                search +="WHERE "+key+" LIKE '%"+value+"%'";
            }else{
                search +="and "+ key+" LIKE '%"+value+"%'";
            }
        }
    });
    let sql = `SELECT tr.*,gm.gym_name FROM trainers tr LEFT JOIN gym gm ON tr.gym_id=gm.gym_id ${search}ORDER BY ${ columns[order[0].column].data} ${order[0].dir} limit ?,?;SELECT count(*) as cnt FROM trainers tr LEFT JOIN gym gm ON tr.gym_id=gm.gym_id ${search}`;
    let query = conn.query(sql,[start,length],(err, results) => {
        if(err){
            res.json({status: 400, message: err});
        }else {
            if (results[0].length > 0) {
                res.json({status: 200, message: "Trainers Listing Successfully", response: results[0],"TotalRecords":results[1][0]['cnt']});
            }else{
                res.json({status: 400, message: 'No data Found', TotalRecords:0});
            }
        }
    });
});

router.post('/update-trainer',[
    passport.authenticate('adminLogin', { session: false }),
    check('trainer_id').exists(),
    check('first_name').exists(),
    check('last_name').exists(),
    check('about').exists(),
    check('email').exists(),
    check('phone').exists(),
    check('gym_id').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let {trainer_id,first_name,last_name,email,phone,stars,about,gym_id} = req.body;
        let data = {
            first_name:first_name,
            last_name:last_name,
            about:about,
            email:email,
            phone:phone,
            rating:stars
        };
        if(gym_id != '' && gym_id != undefined && gym_id != null){
            data.gym_id = gym_id
        }
        let sql = "SELECT * FROM trainers WHERE email = ? AND trainer_id != ?";
        conn.query(sql,[email,trainer_id],(err, results) => {
            if(err){
                res.json({status: 400, message: err});
            }else {
                if (results.length > 0) {
                    res.json({status: 400, message: "Email Already Exits"});
                } else {
                    if (req.files && Object.keys(req.files).length > 0) {
                        let avatar = req.files.avatar;
                        let filename = Math.floor(Math.random() * 100000) + '-' + avatar.name;
                        let file_url = './upload/' + filename;
                        let file_name = 'upload/' + filename;
                        avatar.mv(file_url, function (error) {
                            if (error) {
                                res.json({status: 400, message: err});
                            } else {
                                data.avatar = file_name;
                                let sql1 = "UPDATE trainers SET ? WHERE trainer_id = ?";
                                conn.query(sql1, [data, trainer_id], (err, results1) => {
                                    if (err) {
                                        res.json({status: 400, message: err});
                                    } else {
                                        if (results1.affectedRows === 1) {
                                            res.json({
                                                status: 200,
                                                message: "Trainer Update Successfully",
                                                response: results1[0]
                                            });
                                        } else {
                                            res.json({status: 400, message: 'No data Found'});
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        let sql1 = "UPDATE trainers SET ? WHERE trainer_id = ?";
                        conn.query(sql1, [data, trainer_id], (err, results1) => {
                            if (err) {
                                res.json({status: 400, message: err});
                            } else {
                                if (results1.affectedRows === 1) {
                                    res.json({
                                        status: 200,
                                        message: "Trainer Update Successfully",
                                        response: results1[0]
                                    });
                                } else {
                                    res.json({status: 400, message: 'No data Found'});
                                }
                            }
                        });
                    }
                }
            }
        });
    }
});

router.post('/export-trainers',[passport.authenticate('adminLogin', { session: false })], function(req, res, next) {
    let sql = "SELECT trainer_id,gym_id,first_name,last_name,email,phone,rating,created_at,is_active FROM trainers";
    let query = conn.query(sql,(err, results) => {
        if(err){
            res.json({status: 400, message: err});
        }else {
            if (results.length > 0) {
                let tmpRes = results;
                let resNew = [];
                tmpRes.forEach(function (item)
                {
                    item.created_at = moment(item.created_at).format('DD/MM/YYYY');
                    resNew.push(item);
                });
                res.json({status: 200, message: "Export Trainers Listing Successfully", response: resNew});
            }else{
                res.json({status: 400, message: 'No data Found'});
            }
        }
    });
});


router.post('/add-blog',[
    passport.authenticate('adminLogin', { session: false }),
    check('type').exists(),
    check('title').exists(),
    check('description').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let {title,description,type} = req.body;
        let data = {
            status:1,
            type:type,
            title:title,
            description:description,
        };
        if (req.files && Object.keys(req.files).length > 0) {
            let blog_image = req.files.blog_image;
            let filename = Math.floor(Math.random() * 100000)+'-'+blog_image.name;
            let file_url = './upload/'+filename;
            let file_name = 'upload/'+filename;
            blog_image.mv(file_url, function (error) {
                if (error) {
                    res.json({status: 400, message: err});
                }else{
                    data.blog_image = file_name;
                    let sql1 = "INSERT INTO blogs SET ?";
                    conn.query(sql1, data, (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                res.json({status: 200, message: "Create Blog Successfully", response: results1[0]});
                            } else {
                                res.json({status: 400, message: 'No data Found'});
                            }
                        }
                    });
                }
            });
        }else {
            let sql1 = "INSERT INTO blogs SET ?";
            conn.query(sql1, data, (err, results1) => {
                if (err) {
                    res.json({status: 400, message: err});
                } else {
                    if (results1.affectedRows === 1) {
                        res.json({status: 200, message: "Create Blog Successfully", response: results1[0]});
                    } else {
                        res.json({status: 400, message: 'No data Found'});
                    }
                }
            });
        }
    }
});

router.post('/get-blogs', [passport.authenticate('adminLogin', { session: false })], function(req, res, next) {
    let { start,length,order,columns,search_text } = req.body;
    let search="WHERE status != 2";
    Object.entries(search_text).forEach(([key, value]) => {
        if(value!==""){
            if(search==="")
            {
                search +=" and "+key+" LIKE '%"+value+"%'";
            }else{
                search +=" and "+ key+" LIKE '%"+value+"%'";
            }
        }
    });
    let sql = `SELECT * FROM blogs ${search} ORDER BY ${ columns[order[0].column].data} ${order[0].dir} limit ?,?;SELECT count(*) as cnt FROM blogs ${search}`;
    let query = conn.query(sql,[start,length],(err, results) => {
        if(err){
            res.json({status: 400, message: err});
        }else {
            if (results[0].length > 0) {
                let tmpRes = results[0];
                let resNew = [];
                tmpRes.forEach(function (item)
                {
                    item.created_at = moment(item.created_at).format('DD/MM/YYYY');
                    resNew.push(item);
                });
                res.json({status: 200, message: "Blogs Listing Successfully", response: resNew,"TotalRecords":results[1][0]['cnt']});
            }else{
                res.json({status: 400, message: 'No data Found', TotalRecords:0});
            }
        }
    });
});

router.post('/update-blog',[
    passport.authenticate('adminLogin', { session: false }),
    check('id').exists(),
    check('type').exists(),
    check('title').exists(),
    check('description').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let {id,title,description,type} = req.body;
        let data = {
            type:type,
            title:title,
            description:description
        };
        if (req.files && Object.keys(req.files).length > 0) {
            let blog_image = req.files.blog_image;
            let filename = Math.floor(Math.random() * 100000)+'-'+blog_image.name;
            let file_url = './upload/'+filename;
            let file_name = 'upload/'+filename;
            blog_image.mv(file_url, function (error) {
                if (error) {
                    res.json({status: 400, message: err});
                }else{
                    data.blog_image = file_name;
                    let sql1 = "UPDATE blogs SET ? WHERE id = ?";
                    conn.query(sql1, [data,id], (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                res.json({status: 200, message: "Blog Update Successfully", response: results1[0]});
                            } else {
                                res.json({status: 400, message: 'No data Found'});
                            }
                        }
                    });
                }
            });
        }else {
            let sql1 = "UPDATE blogs SET ? WHERE id = ?";
            conn.query(sql1, [data,id], (err, results1) => {
                if (err) {
                    res.json({status: 400, message: err});
                } else {
                    if (results1.affectedRows === 1) {
                        res.json({status: 200, message: "Blog Update Successfully", response: results1[0]});
                    } else {
                        res.json({status: 400, message: 'No data Found'});
                    }
                }
            });
        }
    }
});

router.post('/export-blogs',[passport.authenticate('adminLogin', { session: false })], function(req, res, next) {
    let sql = "SELECT id,title,description,created_at,status FROM blogs WHERE status != 2";
    let query = conn.query(sql,(err, results) => {
        if(err){
            res.json({status: 400, message: err});
        }else {
            if (results.length > 0) {
                let tmpRes = results;
                let resNew = [];
                tmpRes.forEach(function (item)
                {
                    item.created_at = moment(item.created_at).format('DD/MM/YYYY');
                    resNew.push(item);
                });
                res.json({status: 200, message: "Export Blogs Listing Successfully", response: resNew});
            }else{
                res.json({status: 400, message: 'No data Found'});
            }
        }
    });
});

router.post('/blog-change-status',[
    passport.authenticate('adminLogin', { session: false }),
    check('id').exists()
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let status = 1;
        let id = req.body.id;
        let sql = "SELECT * FROM blogs WHERE id = ?";
        conn.query(sql, [id], (err, results) => {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                if (results.length > 0) {
                    let responseActive = results[0].status;
                    if(responseActive === 1){
                        status = 0;
                    }
                    let sql1 = "UPDATE blogs SET status = ? WHERE id = ?";
                    conn.query(sql1, [status,id], (err, results1) => {
                        if (err) {
                            res.json({status: 400, message: err});
                        } else {
                            if (results1.affectedRows === 1) {
                                if(status === 1){
                                    res.json({status: 200, message: "Status is Active", response: 1});
                                }else{
                                    res.json({status: 200, message: "Status is Deactivate", response: 0});
                                }
                            } else {
                                res.json({status: 400, message: 'No data Found'});
                            }
                        }
                    });
                } else {
                    res.json({status: 400, message: 'No data Found'});
                }
            }
        });
    }
});

router.post('/remove-blog',[
    passport.authenticate('adminLogin', { session: false }),
    check('id').exists()
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        var id = req.body.id;
        let sql = "UPDATE blogs SET status = ? WHERE id = ?";
        conn.query(sql, [2,id], function (err, results) {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                res.json({status: 200, message: "Record remove successfully", response: results});
            }
        });
    }
});

router.post('/get-blog-data',[
    passport.authenticate('adminLogin', { session: false }),
    check('id').exists(),
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        var id = req.body.id;
        let sql = "SELECT * FROM blogs WHERE status != 2 AND id = ?";
        conn.query(sql, [id], (err, results) => {
            if (err) {
                res.json({status: 400, message: err});
            } else {
                if (results.length > 0) {
                    let tmpRes = results;
                    let resNew = [];
                    tmpRes.forEach(function (item)
                    {
                        item.created_at = moment(item.created_at).format('DD/MM/YYYY');
                        resNew.push(item);
                    });
                    res.json({status: 200, message: 'Get Data Successfully', data: resNew[0]});
                } else {
                    res.json({status: 400, message: 'No data Found'});
                }
            }
        });
    }
});

router.post('/get-dashboard',[
    passport.authenticate('adminLogin', { session: false })
],function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array().map((err) => ({ field: err.param, message: err.msg }));
        res.json({status: 501, message: err});
        return
    }else {
        let sql = `SELECT count(id) as total_users FROM users WHERE is_active = 1 AND role_id = 2;SELECT count(trainer_id) as total_trainers FROM trainers WHERE is_active = 1;SELECT count(gym_id) as total_gym FROM gym WHERE is_deleted = 0;select derived.mm as month, count(u.created_at) as count from (
    SELECT 1 mm UNION ALL SELECT 2 UNION ALL SELECT 3 
    UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7  
    UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 
    UNION ALL SELECT 12
) derived
left join users u
on derived.mm = month(created_at) 
    and u.created_at > LAST_DAY(DATE_SUB(curdate(),INTERVAL 1 YEAR)) and u.role_id = 2
group by derived.mm order by derived.mm;
select derived.mm as month, count(t.created_at) as count from (
    SELECT 1 mm UNION ALL SELECT 2 UNION ALL SELECT 3 
    UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7  
    UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 
    UNION ALL SELECT 12
) derived
left join trainers t
on derived.mm = month(created_at) 
    and t.created_at > LAST_DAY(DATE_SUB(curdate(),INTERVAL 1 YEAR))
group by derived.mm order by derived.mm`;
        conn.query(sql,(err, results) =>
        {
            if(err)
            {
                res.json({status: 400, message: err});
            }
            else
            {
                var total_users = results[0][0].total_users;
                var total_trainers = results[1][0].total_trainers;
                var total_gym = results[2][0].total_gym;
                let tmpRes = results[3];
                let users = [];
                tmpRes.forEach(function (item)
                {
                    delete item.month
                    users.push(item.count);
                });
                let tmpRes1 = results[4];
                let trainers = [];
                tmpRes1.forEach(function (item)
                {
                    delete item.month
                    trainers.push(item.count);
                });
                var series = '';
                var data = {'total_users' : total_users,'total_trainers' : total_trainers,'total_gym' : total_gym,'users' : users,'trainers' : trainers}
                res.json({status: 200, message: "Dashboard data successfully", data: data});
            }
        });
    }
});

router.post('/get-gyms',function(req, res, next) {
    let sql = `SELECT * FROM gym WHERE status = 1 ORDER BY gym_id`;
    conn.query(sql,(err, results) => {
        if(err){
            res.json({status: 400, message: err});
        }else {
            if (results.length > 0) {
                let tmpRes = results;
                let resNew = [];
                tmpRes.forEach(function (item)
                {
                    resNew.push(item);
                });
                res.json({status: 200, message: 'Gym Listing Successfully', data: resNew});
            }else{
                res.json({status: 400, message: 'No data Found'});
            }
        }
    });
});

module.exports = router;
