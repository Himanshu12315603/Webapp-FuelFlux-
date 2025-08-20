import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  _id: String,
  customer: String,
  rating: { type: String, enum: ['Positive', 'Negative'] },
  comment: String,
  date: { type: Date, default: Date.now }
});

feedbackSchema.index({ date: -1 });

export default mongoose.model('Feedback', feedbackSchema);