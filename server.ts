import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial: parse JSON payloads with high limit because logo images can be uploaded as base64
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const contentFilePath = path.join(process.cwd(), "content.json");

  // Initialize Client-side Firebase Firestore for global persistence via API Key
  let db: any = null;
  try {
    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(firebaseConfigPath)) {
      const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
      const firebaseApp = initializeApp(firebaseConfig);
      db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
      console.log("Firebase Firestore initialized successfully with API Key. DB ID:", firebaseConfig.firestoreDatabaseId);
    } else {
      console.warn("firebase-applet-config.json not found. Falling back to local file storage only.");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Firestore, falling back to local file storage:", error);
  }

  // API to retrieve the current shared content
  app.get("/api/content", async (req, res) => {
    try {
      // 1. Try reading from Firestore first for true global state
      if (db) {
        try {
          const docRef = doc(db, "config", "website");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("Loaded content globally from Firestore via API Key.");
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
          const docRef = doc(db, "config", "website");
          await setDoc(docRef, data);
          console.log("Saved content globally to Firestore via API Key.");
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
