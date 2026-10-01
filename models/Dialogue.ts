import mongoose from "mongoose";

const DialogueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: "新对话",
    },
    // 是否有消息
    isMessage: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Dialogue ||
  mongoose.model("Dialogue", DialogueSchema);
