const express = require('express')
const router = express.Router()
const config = require("../config/config")
const User = require("../models/user")
const verifyToken = require("./verify")
const Product = require("../models/product")
const Order = require("../models/order")

const stripe = require('stripe')("sk_test_mrDJ8jrhqKfcZfShiXxBe7Wk00qE6spmUe");

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

    return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((product)=>{
            return {
                name: product.name,
                amount: product.price*100,
                quantity: product.quantity,
                currency: "SEK"
            }
        }),
        success_url: req.protocol + '://' + req.get('Host') + '/thankyou',
        cancel_url: "http://localhost:8000/felsida"

    }).then((session) => {
        res.render("shop/checkout.ejs", {user, products, sessionId:session.id, Stripe_Public_Key: pk_test_FPS2Na5LzZxYFLdI7aAuwWt100ehbVLP3F})
    })
})

router.get('/thankyou', verifyToken, async (req, res) => {

    let products = [];

    let user = await User.findOne({
        _id: req.body.user._id
    });

    for (let i = 0; i < user.cart.length; i++) {

        let product = await Product.findOne({
            _id: user.cart[i].productId
        });

        product.quantity = user.cart[i].quantity
        products.push(product);

        await user.createOrder(product, product.quantity)
    }
 
    user.cart = [];
 
    user.save();

    res.render("shop/thankyou", {products, user})
 
});

module.exports = router