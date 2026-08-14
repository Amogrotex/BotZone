import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import botRoutes from "./routes/bots.js";

const app = express();

// Security
app.use(helmet());
const configuredOrigins = (process.env.FRONTEND_URL || "").split(",").map(s => s.trim()).filter(Boolean);
const allowedOrigins = configuredOrigins.length
  ? configuredOrigins
  : ["http://localhost:5173", "https://amogrotex.github.io"];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limit - prevent brute force
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", limiter);

// Routes
app.get("/", (req, res) => res.json({ message: "BotZone API running", version: "1.0.0", docs: "/api/health" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString(), protected: "Files in storage/ are gitignored - cloners can't access without DB and encryption key" }));

app.use("/api/auth", authRoutes);
app.use("/api/bots", botRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 3001;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 BotZone backend running on http://localhost:${PORT}`);
    console.log(`📦 Protected files are in ${process.env.ENCRYPTED_DIR || "./storage/encrypted"} (gitignored - repo cloners CANNOT access)`);
    console.log(`🔐 Encryption key from .env (not in repo) - without it files are unreadable`);
  });
});
