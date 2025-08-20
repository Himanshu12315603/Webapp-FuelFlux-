import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  registrationno: String,
  modelofvehicle: String,
  vehicleclass: String,
  vehicletype: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Registration', registrationSchema);