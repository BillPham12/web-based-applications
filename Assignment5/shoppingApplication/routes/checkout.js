var express                 = require('express');
var router                  = express.Router();
var Cart                    = require('../models/cart');
var Order                   = require('../models/order');
var User                    = require('../models/user');
var paypal                  = require('paypal-rest-sdk');
var amount = {"currency": "CAD", // use this amount object to process paypal payment and execute
            "total": "00.00"  }


// GET checkout page
router.get('/', ensureAuthenticated, function(req, res, next){
    console.log(`ROUTE: GET CHECKOUT PAGE`)
    var cart = new Cart(req.session.cart)
    var totalPrice = cart.totalPrice
    res.render('checkout', {title: 'Checkout Page', items: cart.generateArray(), totalPrice: cart.totalPrice, bodyClass: 'registration', containerWrapper: 'container', userFirstName: req.user.fullname});
})

// POST checkout-process
router.post('/checkout-process', function(req, res){
   console.log(`ROUTE: POST CHECKOUT-PROGRESS`)
    var cart = new Cart(req.session.cart);
    var totalPrice = cart.totalPrice;
    //create json object for the payment process
    //source code from github.io
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/checkout/checkout-success", // if success redirect to this url
            "cancel_url": "http://localhost:3000/checkout/checkout-cancel"// if fail redirect to this url
        },
        "transactions": [{
        "item_list": {
          "items": [//created for testing purpose
            {
              "quantity": "1",
              "name": "item 1",
              "price": "1",
              "currency": "CAD",
              "description": "item 1 description",
              "tax": "1"
            },
            {
              "quantity": "1",
              "name": "item 2",
              "price": "1",
              "currency": "CAD",
              "description": "item 2 description",
              "tax": "1"
          }]
        },
        "amount": {
            "currency": "CAD",
            "total": "25.00"
        },
        "description": "This is the payment description."
    }]
};
//read data from mongo databases to store items into JSON object
    req.sessionStore.db.collection("products", function(err, collection){
      var cursor = collection.find();
      var item_list = [];
      //created object to store item values
      var object = {
        "name" :'',
        "sku" : '',
        "price": '',
        "currency": "CAD",
        "quantity": 0
      };
      let number = 0
      //if read databases is not null and its involved in cart then store item's data to object variable.
      cursor.each(function(err,document){
         if(document && cart.items[document._id]){
            object.name = cart.items[document._id].item.title;
            object.sku = cart.items[document._id].item.title;
            object.price = cart.items[document._id].price;
            object.currency = "CAD";
            object.quantity = 1;
            item_list[number] = object;
            object = {
              "name" :'',
              "sku" : '',
              "price": '',
              "currency": "CAD",
              "quantity": 0
            }
            number++;
         }
         // after storing item data now we need to put it into json object for the paypal payment process
         else if (!document){
           amount.total = totalPrice.toFixed(2);// store price into String and use function tofixed to make sure the number has 2 floating points
           create_payment_json.transactions = [{
              "item_list" : {"items": item_list},
              "amount" : amount,
              "description": "This is the payment description."
           }]
           console.log(amount);
           console.log(create_payment_json.transactions);
          //create payment process for the json payment object
           paypal.payment.create(create_payment_json, function (error, payment) {
           if (error) {
               console.log(error.response);
             //  throw error;
           } else {
             //use for loop to get the approval_url link then redirect our client to paypal payment page
             for(let i =0; i < payment.links.length;i++){
               if(payment.links[i].rel === 'approval_url'){
                 res.redirect(payment.links[i].href);
               }}}
             });
        }
    });
  });
});

// GET checkout-success
//if user hit ok from the paypal payment page, then we there are some work we need to work with
// check out success page
router.get('/checkout-success', ensureAuthenticated, function(req, res){
    console.log(`ROUTE: GET CHECKOUT-SUCCESS`)
    var cart = new Cart(req.session.cart);
    var totalPrice = cart.totalPrice;
    var payerId = req.query.PayerID;//get payer id from request query
    var paymentId = req.query.paymentId;//get payment id from request query
    //store json execute payment object from payer id and amount object above
    var execute_payment_json = {
      "payer_id" : payerId,
      "transactions": [{
      "amount" : amount
      }]
    };
    //execute payment object
    paypal.payment.execute(paymentId,execute_payment_json,function(error,payment){
      if(error){
        console.log(error.response);
      }else{
        //if sucess we store payment information to our order that is
        // payment id, user name, address and odrer date
        var newOrder = new Order({
               orderID             : payment.cart,
               username            : req.user.username,
               address             : payment.payer.payer_info.shipping_address.line1 + " "+
                                      payment.payer.payer_info.shipping_address.city + " "+
                                      payment.payer.payer_info.shipping_address.state + " "+
                                      payment.payer.payer_info.shipping_address.postal_code,
               orderDate           : payment.create_time,
               shipping            : true
             });
          newOrder.save(); // store orders into our databases
          req.session.cart = new Cart({}); // re new our cart
          //then redirect out client to check out success page.
          res.render('checkoutSuccess', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname})
      }
    })
});

// PAYMENT CANCEL
router.get('/checkout-cancel', ensureAuthenticated, function(req, res){
    console.log(`ROUTE: GET CHECKOUT-CANCEL`)
    res.render('checkoutCancel', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname});
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        console.log(`ERROR: USER IS NOT AUTHENTICATED`)
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/');
    }
}

module.exports = router;
