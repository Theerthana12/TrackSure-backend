import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { name, phone, password, caregiverPhone } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ msg: "Phone already registered" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, phone, passwordHash, caregiverPhone });
    await user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { name: user.name, phone: user.phone, caregiverPhone: user.caregiverPhone }});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

export async function login(req, res) {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { name: user.name, phone: user.phone, caregiverPhone: user.caregiverPhone }});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
