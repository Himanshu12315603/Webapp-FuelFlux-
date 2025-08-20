 

const mongoose = require('mongoose');

const RegistrationnoSchema = new mongoose.Schema({
  registrationno: { type: String, required: true },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Registerno', RegistrationnoSchema);
