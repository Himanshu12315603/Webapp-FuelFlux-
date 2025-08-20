const express = require('express');
const router = express.Router() ;
const Feedback = require('../models/FeedBack');
const FeedBack = require('../models/FeedBack');
const isLoggedIn = require('../middleware/authMiddleware');
// router.post('/feedback' , isLoggedIn ,  async(req , res)=>{
//     const {feedback} = req.body ; 
//      if (!String(feedback).trim()) {
//       return res.status(400).json({ error: "All fields required" });
//     }
//     try
//     {
//        const feedbackdata = await  FeedBack.create({
//         feedback ,
//         user : req.user.userid 
//        })

//     }
//    catch (error) {
//     console.error("Booking error:", error);
//     res.status(500).json({
//       error: "An error occurred while processing your feedback",
//       details: error.message
//     });
//   }
// })
 router.post('/feedback', isLoggedIn, async (req, res) => {
  const { feedback } = req.body;
  if (!String(feedback).trim()) {
    return res.status(400).json({ error: "All fields required" });
  }
  try {
    const feedbackdata = await FeedBack.create({
      feedback,
      user: req.user.userid,
    });
    res.status(201).json({ message: "Feedback saved", feedbackdata });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({
      error: "An error occurred while processing your feedback",
      details: error.message,
    });
  }
});
 
router.get('/getfeedback' , isLoggedIn , async(req , res)=>{
    try
    {
        const allfedback = await FeedBack.find({
            user : req.user.userid
        }).sort({createdAt: -1 });

        if(allfedback.length===0)
        {
             return res.status(404).json({ error: "No registerno found" });
        }
        res.status(200).json({
            feedbackdata: allfedback ,
            success:true 
        });
        
    }
    catch (error) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch feedback info",
      details: error.message
    });
    }
}) ;
module.exports = router ; 