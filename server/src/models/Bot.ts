import mongoose from "mongoose";

// Represents a Soroush bot owned by user - private data, not in repo
const BotSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: String,
    token: { type: String, required: true, select: false }, // Soroush bot token - encrypted at rest, never exposed to frontend directly
    encryptedToken: String, // AES encrypted version
    isActive: { type: Boolean, default: true },
    settings: {
      autoReply: Boolean,
      welcomeMessage: String,
    },
    // Private files metadata - actual files stored in ./storage/encrypted (gitignored)
    files: [
      {
        originalName: String,
        encryptedPath: String, // path in storage/encrypted (gitignored - cloners can't access)
        size: Number,
        mime: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Index so users can only query their own bots
BotSchema.index({ owner: 1 });

export const Bot = mongoose.model("Bot", BotSchema);
