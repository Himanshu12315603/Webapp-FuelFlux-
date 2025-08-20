import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  vehicle: String,
  quantity: Number,
  dateofbook: Date,
  time: String,
  location: String,
  nornozel: Number,
  fueltype: String,
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'PetrolPump', required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for faster queries
bookingSchema.index({ dateofbook: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.model('Booking', bookingSchema);