import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  dialogueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dialogue',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  thinking: {
    type: String,
    default: '',
  },
  usage: {
    type: Object,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);