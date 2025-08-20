const mongoose = require('mongoose') ;
const paymentDetail = new mongoose.Schema({

userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  } ,
payment_id: String,

  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model("Payment", paymentDetail);