import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial: parse JSON payloads with high limit because logo images can be uploaded as base64
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const contentFilePath = path.join(process.cwd(), "content.json");

  // API to retrieve the current shared content
  app.get("/api/content", (req, res) => {
    try {
      if (fs.existsSync(contentFilePath)) {
        const fileData = fs.readFileSync(contentFilePath, "utf8");
        return res.json(JSON.parse(fileData));
      }
    } catch (error) {
      console.error("Error reading content file:", error);
    }
    // Return null if no file yet or error occurs, client will fall back to defaultContent
    res.json(null);
  });

  // API to update the shared content for everyone
  app.post("/api/content", (req, res) => {
    try {
      const data = req.body;
      fs.writeFileSync(contentFilePath, JSON.stringify(data, null, 2), "utf8");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error writing content file:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware setup for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
