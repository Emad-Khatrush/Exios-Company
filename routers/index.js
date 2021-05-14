const express    = require("express"),
      nodemailer = require('nodemailer'),
      router  = express.Router();
      
const langAR  = require("../lang/ar");
const langEN  = require("../lang/en");

// home route
router.get("/", (req, res) => {
    res.render('home', { lang: langAR });
});
// home lang route
router.get("/:lang", (req, res) => {
    if(req.params.lang === "en"){
        return res.render('home', { lang: langEN });
    }else{
        return res.redirect("/");
    }
});
// contact us
router.post("/:lang/sendMessage", (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'expotimbuildinglibya@hotmail.com',
          pass: process.env.HOTMAIL_PASS
          }
        });
    
        var mailOptions = {
          from: 'expotimbuildinglibya@hotmail.com',
          to: 'emad.khatrush@exioslibya.com',
          subject: req.body.subject,
          html: `<h3> Message from ${req.body.fullName}</h3> <br>
          <p><strong> phone:</strong> ${req.body.phone || "Empty"} </p>
          <p><strong> Email: </strong>${req.body.email || "Empty"} </p>
          <p><strong> Message:</strong> ${req.body.message} </p>`
        };
    
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            res.status(404).send();
          } else {
            console.log('Email sent: ' + info.response);
            req.flash("success", ".تم ارسال الرسالة بنجاح");
            res.redirect("/" + req.params.lang);
          }
        });
});
module.exports = router;