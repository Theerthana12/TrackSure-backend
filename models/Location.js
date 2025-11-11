import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  deviceId: { type: String, default: "unknown" },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  time: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("Location", LocationSchema);


