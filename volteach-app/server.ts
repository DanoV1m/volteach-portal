import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createAiGuard } from "./src/server/aiGuard";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json({ limit: '64kb' }));
  const admin = getApps()[0] ?? initializeApp({ projectId: 'volteach-portal' });
  const guard = createAiGuard(async token => (await getAuth(admin).verifyIdToken(token)).uid);

  // API endpoint for Gemini
  app.post("/api/gemini", async (req, res) => {
    try {
      const decision = await guard(req.headers.authorization, req.body);
      if (!decision.ok) return res.status(decision.status).json({ error: decision.error });
      const { prompt } = decision;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({ error: "AI service unavailable" });
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
        model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
        contents: prompt,
        config: { maxOutputTokens: 4096 },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini request failed");
      res.status(500).json({ error: "AI service unavailable" });
    }
  });

  // Collect Web Vitals from production clients (sendBeacon payload)
  app.post('/api/vitals', (req, res) => {
    const { name, value, rating, path: urlPath } = req.body as {
      name?: string;
      value?: number;
      rating?: string;
      path?: string;
    };
    if (name && value !== undefined) {
      const badge =
        rating === 'good' ? '✅' :
        rating === 'needs-improvement' ? '⚠️' : '❌';
      const display =
        name === 'CLS'
          ? (value as number).toFixed(3)
          : `${Math.round(value as number)}ms`;
      console.log(`[Vitals] ${badge} ${name}: ${display}  path=${urlPath ?? '/'}`);
    }
    res.status(204).end();
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
