import mongoose from 'mongoose';

const nozzleDetailSchema = new mongoose.Schema({
  nozzleNumber: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' } // e.g., active, inactive, maintenance
});

const nozzleSchema = new mongoose.Schema({
  stationId: { type: String, required: true, unique: true },
  petrol: [nozzleDetailSchema],
  diesel: [nozzleDetailSchema],
  cng: [nozzleDetailSchema],
  electric: [nozzleDetailSchema],
  other: [nozzleDetailSchema],
}, { timestamps: true });

export default mongoose.model('Nozzle', nozzleSchema);
