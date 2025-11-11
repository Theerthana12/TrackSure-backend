import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  caregiverPhone: { type: String } // optional separate caregiver number
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
