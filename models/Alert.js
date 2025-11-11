import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  deviceId: String,
  alertType: String, // 'obstacle' | 'panic'
  distance: Number,
  location: {
    lat: Number,
    lon: Number
  },
  time: { type: Date, default: Date.now }
});

export default mongoose.model("Alert", AlertSchema);
