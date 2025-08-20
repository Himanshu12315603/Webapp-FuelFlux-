import mongoose from 'mongoose';

const petrolPumpSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lat: Number,
  lon: Number,
  name: String,
  operator: String,
  contact: { type: String, required: true },
  upiId: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  fuelTypes: { type: [String], required: true },
  nozzles: {
    petrol: { type: Number, default: 0 },
    diesel: { type: Number, default: 0 },
    cng: { type: Number, default: 0 },
    electric: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  prices: {
    petrol: { type: Number, default: 0 },
    diesel: { type: Number, default: 0 },
    cng: { type: Number, default: 0 },
    electric: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('PetrolPump', petrolPumpSchema);