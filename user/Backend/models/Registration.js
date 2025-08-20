 

const mongoose = require('mongoose');

 

const registrationSchema = new mongoose.Schema({
 
  modelofvehicle: String,
  vehicleclass: String,
  vehicletype: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });



module.exports = mongoose.model('Registration', registrationSchema);
