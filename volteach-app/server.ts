import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json({ limit: '64kb' }));
  const admin = getApps()[0] ?? initializeApp({ projectId: 'volteach-portal' });
  const requests = new Map<string, { count: number; expires: number }>();
  const limit = 20;

  // API endpoint for Gemini
  app.post("/api/gemini", async (req, res) => {
    try {
      const token = req.headers.authorization?.match(/^Bearer (\S+)$/i)?.[1];
      if (!token) return res.status(401).json({ error: 'Authentication required' });
      let uid: string;
      try { uid = (await getAuth(admin).verifyIdToken(token)).uid; }
      catch { return res.status(401).json({ error: 'Invalid authentication' }); }
      const now = Date.now();
      for (const [key, value] of requests) if (value.expires <= now) requests.delete(key);
      const bucket = requests.get(uid);
      if (bucket && bucket.count >= limit) return res.status(429).json({ error: 'Request limit reached' });
      if (!bucket && requests.size >= 10000) return res.status(503).json({ error: 'Service busy' });
      requests.set(uid, { count: (bucket?.count ?? 0) + 1, expires: bucket?.expires ?? now + 60000 });
      const { prompt } = req.body ?? {};
      if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 20000) {
        return res.status(400).json({ error: "Prompt is required" });
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
