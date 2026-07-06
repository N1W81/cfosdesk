import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { Firestore } from "@google-cloud/firestore";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial: parse JSON payloads with high limit because logo images can be uploaded as base64
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const contentFilePath = path.join(process.cwd(), "content.json");

  // Initialize Server-side Firestore for global persistence
  let db: Firestore | null = null;
  try {
    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(firebaseConfigPath)) {
      const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
      db = new Firestore({
        projectId: firebaseConfig.projectId,
        databaseId: firebaseConfig.firestoreDatabaseId,
      });
      console.log("Server-side Firestore initialized successfully. Project:", firebaseConfig.projectId, "DB:", firebaseConfig.firestoreDatabaseId);
    } else {
      console.warn("firebase-applet-config.json not found. Falling back to local file storage only.");
    }
  } catch (error) {
    console.error("Failed to initialize Server-side Firestore, falling back to local file storage:", error);
  }

  // API to retrieve the current shared content
  app.get("/api/content", async (req, res) => {
    try {
      // 1. Try reading from Firestore first for true global state
      if (db) {
        try {
          const docRef = db.collection("config").doc("website");
          const docSnap = await docRef.get();
          if (docSnap.exists) {
            console.log("Loaded content globally from Firestore.");
            return res.json(docSnap.data());
          }
        } catch (dbError) {
          console.error("Error fetching from Firestore, trying local file fallback:", dbError);
        }
      }

      // 2. Fallback to local content.json on disk
      if (fs.existsSync(contentFilePath)) {
        const fileData = fs.readFileSync(contentFilePath, "utf8");
        return res.json(JSON.parse(fileData));
      }
    } catch (error) {
      console.error("Error reading content:", error);
    }
    // Return null if no data yet, client will fall back to defaultContent
    res.json(null);
  });

  // API to update the shared content for everyone
  app.post("/api/content", async (req, res) => {
    try {
      const data = req.body;

      // 1. Persist to Firestore first for global synchronicity
      if (db) {
        try {
          const docRef = db.collection("config").doc("website");
          await docRef.set(data);
          console.log("Saved content globally to Firestore.");
        } catch (dbError) {
          console.error("Error saving to Firestore:", dbError);
        }
      }

      // 2. Also save to local file as backup and for offline reference
      fs.writeFileSync(contentFilePath, JSON.stringify(data, null, 2), "utf8");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error writing content:", error);
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
