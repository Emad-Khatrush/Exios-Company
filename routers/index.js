const express    = require("express"),
      nodemailer = require('nodemailer'),
      router  = express.Router(),
      Order   = require('../models/order'),
      middleware = require('../middleware');
      
const langAR  = require("../lang/ar");
const langEN  = require("../lang/en");

// home route
router.get("/", (req, res) => {
    res.render('home', { lang: langAR });
});

// xtracking Result Page route
router.get("/xtracking/:id/:lang", async (req, res) => {
  const orderId = req.params.id;
  let lang = langAR;
  if( req.params.lang === 'en') {
    lang = langEN;
  }
  try {
    const order = await Order.findOne({ orderId });
    res.render('trackResult',{ lang, order });
  } catch (error) {
    console.log(error.message);
    res.redirect('back');
  }
});
// xtracking Result Page route
router.post("/xtracking/result/:lang", async (req, res) => {
  try {
    const orderId = req.body.orderId;
    let lang = langAR;
    if( req.params.lang === 'en') {
      lang = langEN;
    }
    const order = await Order.findOne({ orderId });
    if(!order) {
      req.flash('error', 'رقم الطلبية غير موجود، الرجاء التأكد والمحاولة مرة اخرى')
      return res.redirect(`/xtracking/${req.params.lang}`);
    }
    res.render('trackResult', { lang, order });
  } catch (error) {
    console.log(error.message);
    res.redirect(`/xtracking/${req.params.lang}`);
  }
});

// home lang route
router.get("/:lang", (req, res) => {
    if(req.params.lang === "en"){
        return res.render('home', { lang: langEN });
    }else{
        return res.redirect("/");
    }
});

// xtracking Page route
router.get("/xtracking/:lang", (req, res) => {
  if(req.params.lang === "en"){
      return res.render('xTracking', { lang: langEN });
  }else{
      return res.render('xTracking', { lang: langAR });
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