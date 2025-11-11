// backend/controllers/locationController.js
import Location from "../models/Location.js"; // ensure this file exists
let ioInstance = null;
export function setIO(io) {
  ioInstance = io;
}

/**
 * POST /api/locations
 * body: {
 *   deviceId: "belt001",
 *   location: { lat: 13.12, lon: 77.62 },
 *   time: "2025-11-11T12:34:56Z"   // optional
 * }
 */
export async function postLocation(req, res) {
  try {
    const body = req.body || {};

    // deviceId
    const deviceId = body.deviceId || "unknown";

    // location: require lat/lon and coerce to numbers
    const loc = body.location || {};
    const lat = loc.lat != null ? Number(loc.lat) : null;
    const lon = loc.lon != null ? Number(loc.lon) : null;

    if (lat === null || lon === null || Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ success: false, message: "Invalid or missing location.lat / location.lon" });
    }

    // parse time safely - accept ISO string or numeric timestamp. Fallback to now if invalid/missing.
    let timeValue = null;
    if (body.time) {
      // try Date constructor
      const parsed = new Date(body.time);
      if (!isNaN(parsed.valueOf())) {
        timeValue = parsed;
      } else {
        // also try numeric timestamp string
        const maybeNum = Number(body.time);
        if (!Number.isNaN(maybeNum)) {
          const parsedNum = new Date(maybeNum);
          if (!isNaN(parsedNum.valueOf())) timeValue = parsedNum;
        }
      }
    }
    if (!timeValue) timeValue = new Date();

    // build doc
    const locationDoc = new Location({
      deviceId,
      location: { lat, lon },
      time: timeValue,
    });

    const saved = await locationDoc.save();

    // emit over socket.io so frontend gets live updates
    try {
      if (ioInstance) {
        ioInstance.emit("location_update", saved);
      }
    } catch (e) {
      console.warn("locationController: emit failed", e.message || e);
    }

    return res.status(201).json({ success: true, location: saved });
  } catch (err) {
    console.error("postLocation error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
}

/**
 * GET /api/locations?deviceId=belt001&limit=200
 * returns list of locations (most recent first)
 */
export async function getLocations(req, res) {
  try {
    const deviceId = req.query.deviceId;
    const limit = Math.min(2000, Math.max(1, Number(req.query.limit) || 200)); // clamp
    const filter = {};
    if (deviceId) filter.deviceId = deviceId;

    // return most recent first
    const docs = await Location.find(filter).sort({ time: 1 }).limit(limit); // chronological oldest->newest for polyline
    return res.json(docs);
  } catch (err) {
    console.error("getLocations error:", err);
    return res.status(500).json({ message: err.message });
  }
}

