//用户的模型，和userid关联
import mongoose from "mongoose";

const ModelsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  //模型的接口协议
  protocol: {
    type: String,
    enum:[
      "openai"
    ],
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
    // select:false
  },
  baseUrl: {
    type: String,
    required: true,
  },

},
{
  timestamps: true,
}
);
export default mongoose.models.Models || mongoose.model('Models', ModelsSchema);