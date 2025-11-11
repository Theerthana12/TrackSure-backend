// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import connectDB from "./config/db.js";
import locationRoutes from "./routes/locations.js";
import alertRoutes from "./routes/alerts.js";
import authRoutes from "./routes/auth.js";

// controllers that optionally accept socket.io instance
import { setIO as setLocationIO } from "./controllers/locationController.js";
import { setIO as setAlertIO } from "./controllers/alertController.js"; // optional

// --- Init ---
connectDB();

const app = express();

// --- Middlewares ---
app.use(cors({ origin: "*", credentials: true })); // tighten origin in production
app.use(express.json());

// --- Routes ---
app.use("/api/locations", locationRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("TrackSure API is running"));

// --- HTTP + Socket.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // tighten origin in production
});

// give controllers access to the io instance if they accept it
try {
  if (typeof setLocationIO === "function") setLocationIO(io);
} catch (err) {
  console.warn("Warning: setLocationIO failed:", err.message);
}
try {
  if (typeof setAlertIO === "function") setAlertIO(io);
} catch (err) {
  console.warn("Warning: setAlertIO failed (maybe controller missing):", err.message);
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running locally at: http://localhost:${PORT}`);
  console.log(`🌐 Accessible over network at: http://<your-machine-ip>:${PORT}`);
});
