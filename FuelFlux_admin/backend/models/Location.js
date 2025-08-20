import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  city: String,
  country: String
});

export default mongoose.model('Location', locationSchema);