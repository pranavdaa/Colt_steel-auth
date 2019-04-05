var express = require('express');
var app = express();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user');
mongoose.connect('mongodb://localhost/auth_demo1')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
  secret:"Rustly is the cutiest dog",
  resave:false,
  saveUnitialized: false

}))

app.use(passport.initialize());
app.use(passport.session());
//these methods below  are used for reading the season taking data frm the session and uncoding(deserializeUser) it. and then again coding it(serializeUser)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
  res.render("home.ejs")
})

app.get("/secret",(req,res)=>{
  res.render("secret.ejs")
})


app.listen(4000);
