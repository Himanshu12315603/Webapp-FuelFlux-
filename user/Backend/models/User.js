// const mongoose = require('mongoose')

// const UserSchema = mongoose.Schema ({
//     username : String , 
//     email : String , 
//     password : String ,
//     googleId: String,
//     phonenumber : Number
//     // facebookId: String,
 

// })
// module.exports = mongoose.model('User' , UserSchema );


const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String, // null for Google users
//   googleId: String,
//   // phonenumber: Number
//   phonenumber: {
//   type: String,
//   default: ""
// }

// });
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  googleId: String,
  phonenumber: {
    type: String, // 🧠 Use String to store `+91` or international formats
    default: ""
  }
});

module.exports = mongoose.model('User', UserSchema);
