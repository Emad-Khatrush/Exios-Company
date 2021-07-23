if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
  }
  
const express    = require('express'),
    bodyParser   = require("body-parser"),
    flash        = require("connect-flash"),
    session      = require("express-session"),
    app          = express();

const port = process.env.PORT || 3000;

// configure packages
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(flash());
app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'exios',
  resave: false, 
  saveUninitialized: false}));
  
app.use(function(req,res,next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//-------------------------------
//            Routes
//-------------------------------
// require routers
const indexRoute = require("./routers/index");

app.use(indexRoute);

app.get("*", (req ,res) => {
  res.redirect("/");
});

// add listening server
app.listen(port, () => {
    console.log( `Exios app listening at http://localhost:${port}`);
});