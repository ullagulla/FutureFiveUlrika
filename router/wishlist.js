const express = require("express")
const router = express.Router()
const User = require("../models/user")
const verifyToken = require("./verify")
const Product = require("../models/product")

router.get("/wishlist", verifyToken, async (req, res) => {

})

router.get("/wishlist/:id", verifyToken, async (req, res) => {

    if (!req.body.user) {
        res.cookie('message', 'Du måste vara inloggad', {
            maxAge: 3600000,
            httpOnly: true
        })
        return res.redirect("/productpage/" + req.params.id)

    }

    const product = await Product.findOne({
        _id: req.params.id
    })
    // console.log("Information från user body " + req.body.user._id)
    const user = await User.findOne({
        _id: req.body.user._id
    })

    await user.addToWishList(product)

    res.redirect("/productpage/" + req.params.id)

})

module.exports = router