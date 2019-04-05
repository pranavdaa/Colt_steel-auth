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


passport.use(new LocalStrategy(User.authenticate()))
//these methods below  are used for reading the season taking data frm the session and uncoding(deserializeUser) it. and then again coding it(serializeUser)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
  res.render("home.ejs")
})

app.get("/secret",isLoggedIn,(req,res)=>{
  res.render("secret.ejs")
})


// Auth Routes
app.get("/register",(req,res)=>{
  res.render("register.ejs")
})

app.post("/register",(req,res)=>{
req.body.username
req.body.password

User.register(new User({username:req.body.username}),req.body.password,function(error,user){
  if(error){
    console.log(error);
     return res.redirect('register');
  }
  passport.authenticate("local")(req,res,function(){
    res.redirect("/secret")
  });
} );
})


app.get("/login",(req,res)=>{
  res.render("login.ejs")
})

app.post("/login", passport.authenticate("local",{
  successRedirect: "/secret",
  failureRedirect: "/login"
}) ,(req,res)=>{
  res.send("loged");
})

app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/");
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
  return next();
  }
  res.redirect("/login")
}

app.listen(4000);
