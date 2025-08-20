 

const express = require('express');
const app = express();
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jsonwebtoken = require('jsonwebtoken');
const passport = require('passport');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
router.use(cookieParser());
router.use(express.json());
app.use(express.json()); // Needed to parse JSON input
// 
const jwt = require('jsonwebtoken');


 


router.post('/register', async (req, res) => {
  try {
    const { email, password, username, phonenumber } = req.body;

    // Google SignUp flow (only phone number is sent)
    if (phonenumber && !email && !username && !password) {
      return res.status(200).json({ message: "Phone number accepted for Google signup" });
    }

    // Normal JWT-based registration
    if (!email || !password || !username || !phonenumber) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ error: "User already registered!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phonenumber
    });

    const token = jsonwebtoken.sign(
      { email: newUser.email, userid: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("User register error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

 

    router.post('/login', async (req, res) => {
        try
        {
            const { email , password , username } = req.body;

            const user = await User.findOne({email})
            if(!user)
            {
                return res.status(404).send("Something went wrong ! ");
            }

            bcrypt.compare(password , user.password , (err , result)=>{
                  if(result)
                  {
                    const token = jsonwebtoken.sign
                    (
                        {email: user.email , userid:user._id},
                        process.env.JWT_SECRET,
                  { expiresIn: '1h' }
                    )
                     res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
              res.status(200).json({ message: "Logged in Successfully", token });
                  }
                  else {
              return res.status(401).send("Invalid credentials");
          }
            })
        }
        catch(error)
        {
        console.error(error);
        res.status(500).send("Server Error");
        }
    })


    
  




  router.get('/getregister', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user); // 
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get('/auth/google', (req, res, next) => {
  const phoneNumber = req.query.phonenumber;
  console.log("Received phone number:", phoneNumber);

  if (phoneNumber) {
    res.cookie("tempPhone", phoneNumber, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
    });
  }

  next();
}, passport.authenticate('google', {
  scope: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent',
}));

// router.get('/auth/google/callback',
//   passport.authenticate('google', { session: false, failureRedirect: "/" }),
//   async (req, res) => {
//     try {
//       const phoneNumber = req.cookies.tempPhone;
//       console.log(" Cookie Phone Number:", phoneNumber);

//       if (phoneNumber) {
//         await User.findByIdAndUpdate(req.user._id, { phonenumber: phoneNumber });
//         res.clearCookie("tempPhone");
//       }

//       const token = jwt.sign(
//         { email: req.user.email, userid: req.user._id },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//       );

//       res.redirect(`http://localhost:5173/oauth-callback?token=${token}`);
//     } catch (error) {
//       console.error("Callback error:", error.message);
//       res.redirect('http://localhost:5173/login');
//     }
//   }
// );


// router.get('/auth/google/callback',
//   passport.authenticate('google', { session: false, failureRedirect: "/" }),
//   async (req, res) => {
//     try {
//       const phoneNumber = req.cookies.tempPhone;
//       console.log("Cookie Phone Number:", phoneNumber);

//       const user = await User.findById(req.user._id);

//       if (phoneNumber && user) {
//         // Only update if user has no phone number saved
//         if (!user.phonenumber || user.phonenumber === "") {
//           await User.findByIdAndUpdate(req.user._id, { phonenumber: phoneNumber });
//         }
//         res.clearCookie("tempPhone");
//       }

//       const token = jwt.sign(
//         { email: req.user.email, userid: req.user._id },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//       );

//       res.redirect(`http://localhost:5173/oauth-callback?token=${token}`);
//     } catch (error) {
//       console.error("Callback error:", error.message);
//       res.redirect('http://localhost:5173/login');
//     }
//   }
// );



router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: "/" }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      const token = jwt.sign(
        { email: req.user.email, userid: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Check if user has phone number
      if (!user.phonenumber || user.phonenumber === "") {
        // Redirect user to frontend phone number input page
        return res.redirect(`http://localhost:5173/phoneverify?token=${token}`);
      }

      // If phone number exists → proceed to app
      res.redirect(`http://localhost:5173/oauth-callback?token=${token}`);
    } catch (error) {
      console.error("Callback error:", error.message);
      res.redirect('http://localhost:5173/login');
    }
  }
);

router.post('/update-phone', async (req, res) => {
  const { phoneNumber, token } = req.body;

  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userid;

    await User.findByIdAndUpdate(userId, { phonenumber: phoneNumber });

    res.json({ message: "Phone number updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Invalid token or server error" });
  }
});



router.get('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });

  return res.status(200).json({ message: "User logged out successfully" });
});


module.exports = router;

 