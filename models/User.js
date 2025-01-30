import { Schema, model } from "mongoose"
import PassportLocalMongoose from "passport-local-mongoose"
import findOrCreate from "mongoose-findorcreate"
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: Number, required: true },
    password: { type: String },
    // ketika menggunakan passport-local-mongosee tidak membutuhkan isian password kareba mengubahnya jadi 2
    hash: { type: String },
    salt: { type: String },
    role: { type: String, default: "user" },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
)

userSchema.plugin(PassportLocalMongoose)
userSchema.plugin(findOrCreate)

export default model("user", userSchema)
