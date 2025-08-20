// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
// const User = require('../models/User'); 

// // Serialize / deserialize
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });
// passport.deserializeUser(async (id, done) => {
//     const user = await User.findById(id);
//     done(null, user);
// });

// // Google Strategy
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/api/users/auth/google/callback" 
// }, async (accessToken, refreshToken, profile, done) => {
//     let user = await User.findOne({ googleId: profile.id });
//     if (!user) {
//         user = await User.create({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             googleId: profile.id
//         });
//     }
//     done(null, user);
// }));

 
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');

// // Serialize / Deserialize
//  passport.serializeUser((user, done) => {
//   if (user && user.id) {
//     done(null, user.id);
//   } else {
//     done(new Error("User ID not found during serialization"));
//   }
// });

// // ✅ Deserialize
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     if (!user) return done(new Error("User not found"));
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// })

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:3000/api/users/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ googleId: profile.id });

//     if (!user) {
//       user = await User.create({
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         googleId: profile.id
//       });
//     }

//     console.log("User authenticated with Google:", user); // ✅ Add this
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// }));



const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // your user model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/users/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) return done(null, existingUser);

      const newUser = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
      });

      return done(null, newUser);
    } catch (err) {
      return done(err, null);
    }
  }
));
