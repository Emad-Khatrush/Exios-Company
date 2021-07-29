  
var middlewareObject = {};

middlewareObject.isLogin = (req, res, next) => {
  if(req.isAuthenticated() && req.user.isAdmin)
  {
    return next();
  }
  req.flash("error","You need to login");
  res.redirect("/admin/login");
}

middlewareObject.isEmpty = (obj) => {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

module.exports = middlewareObject;