const express = require('express')
const router = express.Router()
const config = require("../config/config")
const User = require("../models/user")
const verifyToken = require("./verify")
const Product = require("../models/product")
const Order = require("../models/order")

const stripe = require('stripe')(config.Stripe_Secret_Key);

router.get("/checkout", verifyToken, async (req, res) => {

    let products = []

    const user = await User.findOne({
        _id: req.body.user._id
    })
    for (let i = 0; i < user.cart.length; i++) {

        let product = await Product.findOne({
            _id: user.cart[i].productId
        })
        product.quantity = user.cart[i].quantity
        products.push(product)

    }

    res.render("shop/checkout.ejs", {
        products
    })
})

// router.post("/checkout", verifyToken, async (req,res) => {

//     const userOrder = await Order.findOne({
//         _id: req.body.order._id
//     })
    
//     res.render("shop/thankyou", {
//         userOrder
//     })

// })

// router.post('/checkout', async (req, res) => {
//     // Create a payment intent to start a purchase flow.
//     let paymentIntent = await stripe.paymentIntents.create({
//         amount: req.body.total,
//         currency: 'sek',
//         description: 'My first payment'
//     });
 
//     // Complete the payment using a test card.
//     paymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
//         payment_method: 'pm_card_visa'
//     });
//     console.log(paymentIntent);
// });

module.exports = router