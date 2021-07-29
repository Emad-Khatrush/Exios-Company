if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
  }
  
const express             = require('express'),
    bodyParser            = require("body-parser"),
    flash                 = require("connect-flash"),
    moment                = require('moment'),
    mongoose              = require("mongoose"),
    session               = require("express-session"),
    passport              = require("passport"),
    localStrategy         = require("passport-local").Strategy,
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride        = require('method-override'),
    app                   = express();

// MongoDB models
const User = require('./models/user');

const port = process.env.PORT || 3000;
const dbURL = process.env.DB_URL;

// configure packages
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'exios',
  resave: false, 
  saveUninitialized: false}));
  
  
  // connect mongoose
  mongoose.connect(dbURL,
    { useNewUrlParser: true,
      useUnifiedTopology: true }).then(res => {
        console.log("Connected to MongoDB");
      })
      .catch(err => {
        console.log(err.mesage);
      })
      
      // initialize Passport
      app.use(passport.initialize());
      app.use(passport.session());
      passport.use(new localStrategy(User.authenticate()));
      passport.serializeUser(User.serializeUser());
      passport.deserializeUser(User.deserializeUser());
      
      app.use( (req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        res.locals.moment = require('moment');
        next();
      });
//-------------------------------
//            Routes
//-------------------------------
// require routers
const indexRoute = require("./routers/index");
const authRoute = require("./routers/auth");

app.use(indexRoute);
app.use('/admin', authRoute);

// app.get("*", (req ,res) => {
//   //  const userData = new User({
//   //   username: "admin@exioslibya.com",
//   //   isAdmin: true
//   // });
//   // User.register(userData, "123456", function(err, user){
//   //   if (err) {
//   //     console.log(err);
//   //   }
//   //   console.log("added");
//   // })
//   res.redirect("/");
// });

// add listening server
app.listen(port, () => {
    console.log( `Exios app listening at http://localhost:${port}`);
});