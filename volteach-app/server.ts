import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import rateLimit from "express-rate-limit";

dotenv.config();

// Firebase Admin — used only for server-side ID token verification
if (!getApps().length) {
  initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "volteach-portal" });
}

async function verifyToken(authHeader: string | undefined): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  try {
    await getAuth().verifyIdToken(authHeader.slice(7));
    return true;
  } catch {
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "16kb" }));

  const geminiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  });

  // API endpoint for Gemini — requires valid Firebase Auth token
  app.post("/api/gemini", geminiLimiter, async (req, res) => {
    const authenticated = await verifyToken(req.headers.authorization);
    if (!authenticated) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required" });
      }
      if (prompt.length > 4000) {
        return res.status(400).json({ error: "Prompt too long" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API server-side error:", error);
      res.status(500).json({ error: error?.message || "Internal server error" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
