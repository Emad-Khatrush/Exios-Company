const router   = require("express").Router(),
      passport = require("passport"),
      Order    = require("../models/order"),
      middleware = require('../middleware'),
      nodemailer = require('nodemailer'),
      path = require('path'),
      moment = require('moment'),
      orderid  = require('order-id')('mysecret');
      
      
// orders Route: Get
router.get('/orders', middleware.isLogin, async (req, res) => {
    let orders;
    let navNum = 1;
    
    if (req.query.finish === 'finishedOrders') {
      orders = await Order.find({ isFinished: true });
      navNum = 2;
    } else {
      orders = await Order.find({isFinished: false});
    }
    res.render('orders', { orders, navNum });
});

// add order Route: Get
router.get('/addOrder', middleware.isLogin, (req, res) => {
    res.render('addOrder');
});
// orders Route: POST
router.post('/addOrder', middleware.isLogin, async (req, res) => {
  const { customerName, customerEmail, totalPrice, fromWhere, customerPhone,
    toWhere, products, quantity, estimatedDelivery, isShipment, isPayment, officePlace } = req.body;
    const orderId = orderid.generate();
    const isOrderIdUnique = await Order.findOne({ orderId });
    if (isOrderIdUnique) {
      req.flash('error', 'The Order Id is not unique, please try again...');
      return res.redirect('/admin/addOrder');
    }

    try {
      const order = new Order({
        user: req.user,
        customerName,
        customerEmail,
        customerPhone,
        orderId,
        totalPrice,
        fromWhere,
        toWhere,
        products,
        quantity,
        estimatedDelivery: estimatedDelivery || undefined,
        isShipment: isShipment === 'on' ? true : false,
        isPayment: isPayment === 'on' ? true : false,
        officePlace,
        status: {
            date: moment().format(),
            movementPlace: officePlace,
            movementDesc: "في مرحلة تجهيز الطلبية",
        },
      });
      await order.save();
      req.flash('success', "Order Made successfully");
      res.redirect('/admin/addOrder');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/admin/addOrder');
    }

});

// update order: GET
router.get('/updateOrder/:id', middleware.isLogin, async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ orderId });
    res.render('updateOrder', { order, estimatedDelivery: moment(order.estimatedDelivery).format('YYYY-MM-DD') });
  } catch (error) {
    req.flash('error', 'Order not found, please make sure you entered the tracking number correct and try again...')
    res.redirect('/orders');
  }
});
// Update order: PUT
router.put('/updateOrder/:id', middleware.isLogin, async (req, res) => {
  const { customerName, customerEmail, totalPrice, fromWhere, customerPhone,
    toWhere, products, quantity, estimatedDelivery, isShipment, isPayment, shipmentMethod, adminNote } = req.body;
  const orderId = req.params.id;

  try {
    const newOrder = {
      customerName,
      customerEmail,
      customerPhone,
      orderId,
      totalPrice,
      fromWhere,
      toWhere,
      products,
      quantity,
      adminNote,
      shipmentMethod: shipmentMethod ? shipmentMethod : '',
      estimatedDelivery: estimatedDelivery || undefined,
      isShipment: isShipment === 'on' ? true : false,
      isPayment: isPayment === 'on' ? true : false,
    };

    await Order.findOneAndUpdate({ orderId }, {...newOrder});

    req.flash('success', 'Order updated successfully');
    res.redirect(`/admin/updateOrder/${orderId}`);
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/admin/updateOrder/${orderId}`);
  }
});

router.post('/updateOrderState/:id', middleware.isLogin, async (req, res) => {
  const orderId = req.params.id;
  // needs to clean later
  const order = await Order.findOne({ orderId });

  try {
    const updateOrder = {
      orderState: parseInt(req.body.state),
      isFinished: order.isPayment && !order.isShipment ? parseInt(req.body.state) === 1 : parseInt(req.body.state) === 5,
    };
    await Order.findOneAndUpdate({ orderId }, {...updateOrder});
    req.flash('success', 'Order Status updated successfully');
    res.redirect(`/admin/updateOrder/${orderId}`);
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/admin/updateOrder/${orderId}`);
  }
}); 

router.post('/updateOrderStatus/:id', middleware.isLogin, async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findOne({ orderId });
    req.body.status.date = moment().format();
    order.status.push({...req.body.status})
    await order.save();

    // send email to user
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: 'expotimbuildinglibya@hotmail.com',
        pass: process.env.HOTMAIL_PASS,
        }
      });
  
      const ejs = require("ejs");

  const data = await ejs.renderFile(path.join(__dirname, "../views/configMail.ejs"), { orderId });
  
      const mailOptions = {
        from: 'expotimbuildinglibya@hotmail.com',
        cc: 'emad.kahtrush@exioslibya.com',
        to: order.customerEmail,
        subject: "اشعار جديد من شركة اكسيوس",
        html: data,
      };
      if (!(order.customerEmail.toLowerCase() === 'nomail@mail.com'.toLowerCase())) {
        await transporter.sendMail(mailOptions);
      }

    req.flash('success', 'Order Status updated successfully');
    res.redirect(`/admin/updateOrder/${orderId}`);
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/admin/updateOrder/${orderId}`);
  }
}); 

// Login Route: Get
router.get('/login', (req, res) => {
    res.render('admin');
});
// logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/admin/login");
});
// Login Route: POST
router.post("/login",
passport.authenticate("local",{
  failureRedirect: "/admin/login",
  failureFlash: true
}),(req,res) => {
  req.flash("success", "login successflly");
  res.redirect("/admin/orders");
});

module.exports = router;