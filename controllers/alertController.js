import Alert from "../models/Alert.js";
import User from "../models/User.js";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const twClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Socket instance for real-time broadcasting
let ioInstance;
export function setIO(io) {
  ioInstance = io;
}

export async function postAlert(req, res) {
  try {
    const body = req.body;
    const alert = new Alert(body);
    await alert.save();

    // ✅ Broadcast alert to all connected clients
    if (ioInstance) ioInstance.emit("new_alert", alert);

    // ✅ If PANIC, send SMS alerts
    if (alert.alertType === "panic") {
      console.log("🚨 Panic alert detected! Sending SMS to all registered users...");

      const usersWithPhones = await User.find({
        phone: { $exists: true, $ne: "" }
      });

      const lat = alert.location?.lat || "unknown";
      const lon = alert.location?.lon || "unknown";
      const mapsLink = (lat !== "unknown" && lon !== "unknown")
        ? `https://www.google.com/maps?q=${lat},${lon}`
        : "Location unavailable";

      const message = `⚠️ DANGER ALERT!\nDevice: ${alert.deviceId}\nLocation: ${mapsLink}`;

      for (const user of usersWithPhones) {
        try {
          // Always ensure phone starts with +91
          let formattedPhone = user.phone;
          if (!formattedPhone.startsWith("+91")) {
            // Remove any spaces or symbols
            formattedPhone = user.phone.replace(/\D/g, "");
            formattedPhone = `+91${formattedPhone}`;
          }

          console.log(`📨 Sending SMS to ${formattedPhone}...`);

          await twClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to: formattedPhone
          });

          console.log(`✅ SMS sent to ${formattedPhone}`);
        } catch (smsErr) {
          console.error(`❌ Failed to send SMS to ${user.phone}: ${smsErr.message}`);
        }
      }
    }

    res.status(201).json({ success: true, alert });
  } catch (err) {
    console.error("❌ Error in postAlert:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAlerts(req, res) {
  try {
    const alerts = await Alert.find().sort({ time: -1 }).limit(500);
    res.json(alerts);
  } catch (err) {
    console.error("❌ Error in getAlerts:", err);
    res.status(500).json({ message: err.message });
  }
}
