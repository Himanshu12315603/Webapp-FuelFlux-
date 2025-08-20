const mongoose = require('mongoose');
const locationSchema = mongoose.Schema({
 
    latitude: Number,
    longitude: Number,
    city: String,
    country: String
  });
  
module.exports = mongoose.model('Location' , locationSchema);