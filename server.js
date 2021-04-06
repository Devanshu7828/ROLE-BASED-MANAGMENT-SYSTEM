require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const ejsLayouts = require("express-ejs-layouts");
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const httpError = require("http-errors");
const session = require("express-session");
const connectflash = require("express-flash");
const passport = require("passport");
const MongoDbStore = require("connect-mongo");
const cookieParaser = require("cookie-parser")

app.use(morgan("dev"));
// DB
require("./database/conn");
// INIT SESSION
app.use(
  session({
    secret: "someSecret",
    resave: false,
    //TO STORE SESSION IN DB
    store: MongoDbStore.create({ mongoUrl: process.env.MONGO_URL }),
    collection: "sessions",
    saveUninitialized: false,
    cookie: {
      // secure: true,
      httpOnly: true,
    },
  })
);

// 
app.use(cookieParaser())
// passport authentication
const passportInit = require("./passportConfig/passport.config");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());


// global middleware
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// flash
app.use(connectflash());

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.use(ejsLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Guest MIDDLEWARE
const { guestUser, ensureAdmin } = require("./middleware/guest");
// ROUTES
app.use("/", require("./routes/route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/user", guestUser, require("./routes/user.route"));
app.use("/admin", guestUser, ensureAdmin, require("./routes/admin.route"));

app.use("*", (req, res) => {
  res.render("404");
});

app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
