import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  notificationCode: { type: String },
  title: String,
  message: String,
  stationId: { type: String, required: true },
  stationName: { type: String },
  status: { type: String, enum: ['Unread', 'Read', 'Active'], default: 'Unread' },
  date: { type: Date, default: Date.now }
});

notificationSchema.index({ date: -1 });

export default mongoose.model('notifications', notificationSchema);