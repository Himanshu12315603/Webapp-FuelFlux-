const mongoose = require('mongoose');

const FeedBackSchema = new mongoose.Schema(
  {
    feedback: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }  
);

module.exports = mongoose.model('Feedback', FeedBackSchema);
