import express from "express";
import { postAlert, getAlerts } from "../controllers/alertController.js";
const router = express.Router();

router.post("/", postAlert); // from ESP32
router.get("/", getAlerts);  // front-end fetch history

export default router;
