import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";
import { protect, AuthRequest } from "../middleware/auth.js";

const router = Router();

const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().transform(value => value.toLowerCase()),
  password: z.string().min(8).max(128),
});
const loginSchema = z.object({
  email: z.string().email().transform(value => value.toLowerCase()),
  password: z.string().min(1).max(128),
});
const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  avatar: z.union([z.string().url().max(2000), z.literal("")]).optional(),
});
const passwordSchema = z.object({
  currentPassword: z.string().max(128).optional(),
  newPassword: z.string().min(8).max(128),
});

function signToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as any);
}

function publicUser(user: any) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    isVerified: user.isVerified,
  };
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);
    if (await User.exists({ email })) return res.status(409).json({ error: "این ایمیل قبلاً ثبت شده است" });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user._id.toString()), user: publicUser(user) });
  } catch (error: any) {
    res.status(400).json({ error: error?.issues?.[0]?.message || "اطلاعات ثبت‌نام معتبر نیست" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email }).select("+password");
    if (!user?.password || !(await (user as any).comparePassword(password))) {
      return res.status(401).json({ error: "ایمیل یا رمز عبور نادرست است" });
    }
    res.json({ token: signToken(user._id.toString()), user: publicUser(user) });
  } catch (error: any) {
    res.status(400).json({ error: error?.issues?.[0]?.message || "اطلاعات ورود معتبر نیست" });
  }
});

// The backend fetches the Google profile itself, so client-provided profile data is never trusted.
router.post("/google", async (req, res) => {
  try {
    const accessToken = z.string().min(20).parse(req.body.accessToken);
    const googleResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!googleResponse.ok) return res.status(401).json({ error: "ورود گوگل معتبر نیست" });

    const profile: any = await googleResponse.json();
    if (!profile.email || profile.email_verified === false) {
      return res.status(400).json({ error: "ایمیل تأییدشده گوگل لازم است" });
    }

    const email = String(profile.email).toLowerCase();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.name || email.split("@")[0],
        email,
        avatar: profile.picture,
        googleId: profile.sub,
        isVerified: true,
      });
    } else {
      user.googleId ||= profile.sub;
      user.avatar ||= profile.picture;
      user.isVerified = true;
      await user.save();
    }

    res.json({ token: signToken(user._id.toString()), user: publicUser(user) });
  } catch {
    res.status(400).json({ error: "ورود با گوگل انجام نشد" });
  }
});

router.get("/me", protect, async (req: AuthRequest, res) => {
  res.json({ user: publicUser(req.user) });
});

router.patch("/me", protect, async (req: AuthRequest, res) => {
  try {
    const updates = profileSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates.avatar
        ? { $set: { name: updates.name, avatar: updates.avatar } }
        : { $set: { name: updates.name }, $unset: { avatar: 1 } },
      { new: true, runValidators: true },
    );
    res.json({ user: publicUser(user) });
  } catch (error: any) {
    res.status(400).json({ error: error?.issues?.[0]?.message || "ذخیره پروفایل انجام نشد" });
  }
});

router.patch("/password", protect, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = passwordSchema.parse(req.body);
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ error: "کاربر پیدا نشد" });
    if (user.password && (!currentPassword || !(await (user as any).comparePassword(currentPassword)))) {
      return res.status(400).json({ error: "رمز عبور فعلی نادرست است" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "رمز عبور با موفقیت تغییر کرد" });
  } catch (error: any) {
    res.status(400).json({ error: error?.issues?.[0]?.message || "تغییر رمز عبور انجام نشد" });
  }
});

export default router;
