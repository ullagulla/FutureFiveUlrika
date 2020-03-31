const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    /*  ownerUserId: String,
     locationId: String, */
    orderDate: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    user: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            require: true
        },
        price: {
            type: Number,
            require: true
        }
    }]
});

module.exports = mongoose.model('Order', OrderSchema);