// backend/routes/locations.js
import express from "express";
import { postLocation, getLocations } from "../controllers/locationController.js";
const router = express.Router();

router.post("/", postLocation);
router.get("/", getLocations);

export default router;

