// modules to support the express server
import createError from "http-errors";
import express, { NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

// module to connect to MongoDB
import mongoose from "mongoose";

// modules to support authentication
import session from "express-session"; // cookie-based session
import passport from "passport"; // authentication support
import passportLocal from "passport-local"; // authentication strategy (username / password)
import flash from 'connect-flash'; // authentication messaging

// authentication Model and Strategy Alias
let localStrategy = passportLocal.Strategy; // alias

// User Model
import User from '../Models/user';

// App Configuration (Routing, etc)
import indexRouter from "../Routes/index";
import usersRouter from "../Routes/users";

const app = express();

// db configuration
import * as DBConfig from "./db";
mongoose.connect(DBConfig.RemoteURI);

const db = mongoose.connection; // alias
db.on("error", function()
{
  console.error("Connection Error!");
});
db.once("open", function()
{
  console.log(`Connected to MongoDB at ${DBConfig.HostName}`);
});

// view engine setup
app.set("views", path.join(__dirname, "../Views"));
app.set("view engine", "ejs");

// middleware configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../Client")));
app.use(express.static(path.join(__dirname, "../../node_modules")));

// setup express session
app.use(session({
  secret: DBConfig.SessionSecret,
  saveUninitialized: false,
  resave: false
}));

// initialize flash
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// implement an Auth Strategy
passport.use(User.createStrategy());

// serialize and deserialize user data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: createError.HttpError, req: express.Request, res: express.Response, next: NextFunction)
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
