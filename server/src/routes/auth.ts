import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";

const router = Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as any);
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await (user as any).comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// POST /api/auth/google - verify Google ID token from frontend
router.post("/google", async (req, res) => {
  const { name, email, picture, googleId } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, avatar: picture, googleId, isVerified: true });
  } else if (!user.googleId && googleId) {
    user.googleId = googleId;
    user.avatar = picture || user.avatar;
    await user.save();
  }

  const token = signToken(user._id.toString());
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
});

// GET /api/auth/me (protected)
import { protect, AuthRequest } from "../middleware/auth.js";
router.get("/me", protect, async (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default router;
