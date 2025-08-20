//  const mongoose = require('mongoose');

// const petrolPumpSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   lat: Number,
//   lon: Number,
//   name: String,
//   operator: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('PetrolPump', petrolPumpSchema);


const mongoose = require('mongoose');

const petrolPumpSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  operator: {
    type: String,
    default: '',
  },
   address: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PetrolPump', petrolPumpSchema);
 