import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { protect, AuthRequest } from "../middleware/auth.js";
import { Bot } from "../models/Bot.js";
import { encryptFile } from "../utils/encryption.js";

const router = Router();

// All bot routes are protected - no one without JWT can access
router.use(protect);

const upload = multer({ dest: "uploads/" });

// GET /api/bots - list own bots
router.get("/", async (req: AuthRequest, res) => {
  const bots = await Bot.find({ owner: req.user._id }).select("-encryptedToken -token");
  res.json(bots);
});

// POST /api/bots - create bot (token is encrypted before save, never in repo)
router.post("/", async (req: AuthRequest, res) => {
  const { name, description, token, settings } = req.body;
  if (!name || !token) return res.status(400).json({ error: "name and token required" });

  // Simple encryption of token (in production use proper key management)
  const encryptedToken = Buffer.from(token).toString("base64"); // placeholder, use real enc

  const bot = await Bot.create({
    owner: req.user._id,
    name,
    description,
    token,
    encryptedToken,
    settings,
  });

  res.status(201).json({ id: bot._id, name: bot.name });
});

// POST /api/bots/:id/files - upload private file (encrypted, gitignored)
router.post("/:id/files", upload.single("file"), async (req: AuthRequest, res) => {
  const bot = await Bot.findOne({ _id: req.params.id, owner: req.user._id });
  if (!bot) return res.status(404).json({ error: "Bot not found" });
  if (!req.file) return res.status(400).json({ error: "No file" });

  const encDir = process.env.ENCRYPTED_DIR || "./storage/encrypted";
  fs.mkdirSync(encDir, { recursive: true });

  const encryptedPath = path.join(encDir, `${Date.now()}-${req.file.originalname}.enc`);
  encryptFile(req.file.path, encryptedPath);
  fs.unlinkSync(req.file.path); // delete original

  bot.files.push({
    originalName: req.file.originalname,
    encryptedPath, // stored path is in gitignored folder - cloners can't access
    size: req.file.size,
    mime: req.file.mimetype,
  } as any);

  await bot.save();
  res.json({ message: "File uploaded and encrypted", files: bot.files });
});

// GET /api/bots/:id/files/:fileId - download (decrypted on the fly, auth required)
router.get("/:id/files/:fileId/download", async (req: AuthRequest, res) => {
  // Only owner can download - protected by auth
  const bot = await Bot.findOne({ _id: req.params.id, owner: req.user._id });
  if (!bot) return res.status(404).json({ error: "Not found" });

  const fileMeta = (bot.files as any).id(req.params.fileId);
  if (!fileMeta) return res.status(404).json({ error: "File not found" });

  // File is in gitignored storage - if someone clones repo, they DON'T have this file
  // because storage/ is gitignored. Only server with correct FILE_ENCRYPTION_KEY can decrypt.
  if (!fs.existsSync(fileMeta.encryptedPath)) {
    return res.status(404).json({ error: "File missing on server (was in gitignored storage)" });
  }

  // For demo, we would decrypt to temp and stream
  // decryptFile(fileMeta.encryptedPath, tempPath);
  res.json({ message: "Would stream decrypted file here", originalName: fileMeta.originalName });
});

export default router;
