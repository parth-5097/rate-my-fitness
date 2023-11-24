require("dotenv").config();
var express = require("express");
var compression = require("compression");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
const fileUpload = require("express-fileupload");
require("./routes/passport");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const trainerRouter = require("./routes/trainer");
var app = express();
app.use(compression());
app.use(fileUpload());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.use("/upload", express.static("upload"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(__dirname + "/public"));
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/trainer", trainerRouter);
app.listen(3000, () => console.log(`Server started at: 3000`));
