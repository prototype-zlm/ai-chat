// models/User.ts
import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, //值唯一
      lowercase: true, //值转小写
      trim: true, //自动去掉首尾空格
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "邮箱格式错误",
      },
    },
    password: {
      type: String,
      required: true,
      select: false, //密码不返回给客户端
    },
    name: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "https://images.dog.ceo/breeds/labrador/n02099712_4705.jpg",
    },
    activeModel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Models",
      default: null,
    }
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  },
);

// 更新时自动更新 updatedAt
// UserSchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

export default mongoose.models.User || mongoose.model("User", UserSchema);
