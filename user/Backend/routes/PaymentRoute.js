const express = require('express') ;
const router = express.Router() ;
const isLoggedIn = require('../middleware/authMiddleware');
const PaymentDetail = require('../models/PaymentDetails');
// router.post('/paymentdetail' , isLoggedIn ,  async(req , res) => {
//     const {paymentid} = req.body;
//     try
//     {
//         const response = PaymentDetail.create({
//           payment_id: paymentid, 
//             userid : req.user.userid
//         })
//         res.status(201).json({
//       success: true,
//       data: response 
//     });
//     }
//     catch (error) {
//     console.error("Booking error:", error);
//     res.status(500).json({
//       error: "An error occurred while processing your booking",
//       details: error.message
//     });
//   }
// })


// router.get('/getpayment' ,isLoggedIn ,  async(req , res) => {
//   const userid = req.user.userid; 
//   if(!userid)
//   {
//      console.log("user id not found ");

//   }
//   try
//   {
//     const response = await PaymentDetail.find({user: req.user.userid}) ;
//    if (response.length === 0) {
//       return res.status(404).json({ error: "No registerno found" });
//     }
//     res.status(200).json({
//       success:true , 
//       paymentdetail: response 
//     })
//   }
//   catch (error) {
//     res.status(500).json({
//       error: true,
//       message: "Failed to fetch PaymentId  info",
//       details: error.message
//     });
//   }
// })

router.post('/paymentdetail', isLoggedIn, async (req, res) => {
  const { paymentid } = req.body;
  const userid = req.user.userid;

  if (!paymentid || !userid) {
    return res.status(400).json({ error: "Missing paymentid or user" });
  }

  try {
    const saved = await PaymentDetail.create({
      payment_id: paymentid,
      userid
    });
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    return res.status(500).json({ error: "Failed to save payment", details: err.message });
  }
});



router.get('/getpayment', isLoggedIn, async (req, res) => {
  const userid = req.user.userid;

  if (!userid) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  try {
    const response = await PaymentDetail.find({ userid });

    if (response.length === 0) {
      return res.status(404).json({ error: "No payment records found" });
    }

    res.status(200).json({
      success: true,
      paymentdetail: response
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch payment info",
      details: error.message
    });
  }
});

module.exports = router;