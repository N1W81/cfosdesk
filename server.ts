import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";


async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Supabase client lazily to avoid startup crash if keys are missing
  let supabaseClient: any = null;
  const supabaseUrl = (process.env.SUPABASE_URL || "").trim();
  const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || "").trim();

  const isValidUrl = supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://");

  if (supabaseUrl && supabaseAnonKey && isValidUrl) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      console.log("Supabase Client initialized successfully.");
    } catch (err) {
      console.log("Warning: Failed to initialize Supabase Client gracefully:", err);
    }
  } else {
    console.log("Supabase URL and Key not fully configured or invalid. Using local file storage fallback.");
  }

  // Crucial: parse JSON payloads with high limit because logo images can be uploaded as base64
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const contentFilePath = path.join(process.cwd(), "content.json");

  // API to retrieve the current shared content
  app.get("/api/content", async (req, res) => {
    try {
      // 1. Try reading from Supabase first if configured
      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient
            .from("configs")
            .select("value")
            .eq("key", "website")
            .single();

          if (!error && data && data.value) {
            console.log("Loaded content globally from Supabase.");
            return res.json(data.value);
          } else if (error && error.code !== "PGRST116") {
            console.error("Supabase returned error on read:", error);
          }
        } catch (dbError) {
          console.error("Error fetching from Supabase, trying Firebase/local fallbacks:", dbError);
        }
      }


      // 3. Fallback to local content.json on disk
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

      // 1. Persist to Supabase if configured
      if (supabaseClient) {
        try {
          const { error } = await supabaseClient
            .from("configs")
            .upsert({ key: "website", value: data }, { onConflict: "key" });

          if (error) {
            console.error("Error saving to Supabase:", error);
          } else {
            console.log("Saved content globally to Supabase.");
          }
        } catch (dbError) {
          console.error("Error saving to Supabase, trying local file backup:", dbError);
        }
      }

      // 3. Also save to local file as backup and for offline reference
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
