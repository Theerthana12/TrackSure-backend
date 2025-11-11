import mongoose from "mongoose";

const PointSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  time: { type: Date, default: Date.now },
  meta: { type: Object } // optional extra (speed, battery)
}, { _id: false });

const TripSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null },
  points: [PointSchema],
  summary: {
    distanceMeters: Number,
    durationSeconds: Number
  }
}, { timestamps: true });

export default mongoose.model("Trip", TripSchema);
