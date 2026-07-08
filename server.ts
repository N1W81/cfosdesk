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

  // New API endpoint to check Supabase connection status and guide configuration
  app.get("/api/db-status", async (req, res) => {
    if (!supabaseClient) {
      return res.json({
        status: "not_configured",
        message: "Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are not set. The app is falling back to saving changes on the server's local disk (content.json)."
      });
    }

    try {
      const { data, error } = await supabaseClient
        .from("configs")
        .select("key")
        .limit(1);

      if (error) {
        if (error.code === "42P01") {
          return res.json({
            status: "table_missing",
            message: "Database connection successful, but the 'configs' table does not exist yet.",
            sql: "CREATE TABLE configs (\n  key TEXT PRIMARY KEY,\n  value JSONB\n);"
          });
        }
        return res.json({
          status: "error",
          message: error.message || "Unknown database error",
          code: error.code
        });
      }

      // Check for potential duplicate rows if constraint was omitted
      const { data: rows } = await supabaseClient
        .from("configs")
        .select("key")
        .eq("key", "website");

      const hasDuplicates = rows && rows.length > 1;

      return res.json({
        status: "connected",
        message: hasDuplicates 
          ? "Supabase connected. Note: Duplicates found, 'key' is missing a UNIQUE/PRIMARY KEY constraint." 
          : "Supabase database is connected and active globally.",
        hasDuplicates,
        sqlFix: hasDuplicates ? "ALTER TABLE configs ADD PRIMARY KEY (key);" : null
      });
    } catch (err: any) {
      return res.json({
        status: "error",
        message: err.message || "Failed to contact database"
      });
    }
  });

  // API to retrieve the current shared content
  app.get("/api/content", async (req, res) => {
    try {
      // 1. Try reading from Supabase first if configured
      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient
            .from("configs")
            .select("value")
            .eq("key", "website");

          if (error) {
            if (error.code === "42P01") {
              console.warn("\n==================================================");
              console.warn("⚠️  SUPABASE TABLE MISSING  ⚠️");
              console.warn("Table 'configs' does not exist in your Supabase database!");
              console.warn("Please run the following SQL query in your Supabase SQL Editor:");
              console.warn("\nCREATE TABLE configs (\n  key TEXT PRIMARY KEY,\n  value JSONB\n);\n");
              console.warn("==================================================\n");
            } else {
              console.error("Supabase returned error on read:", error);
            }
          } else if (data && data.length > 0) {
            if (data.length > 1) {
              console.warn("\n⚠️ [SUPABASE WARNING] Multiple rows found for key 'website'.");
              console.warn("This means your 'configs' table 'key' column is missing a PRIMARY KEY or UNIQUE constraint.");
              console.warn("To fix this, please execute this SQL in your Supabase SQL Editor:");
              console.warn("ALTER TABLE configs ADD PRIMARY KEY (key);\n");
            }
            console.log(`Loaded content globally from Supabase (selected latest of ${data.length} records).`);
            return res.json(data[data.length - 1].value);
          } else {
            console.log("Supabase configs table is empty. Falling back to local file.");
          }
        } catch (dbError) {
          console.error("Error fetching from Supabase, trying fallback:", dbError);
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
            if (error.code === "42P01") {
              console.error("\n[SUPABASE ERROR] Table 'configs' does not exist! Saving globally skipped.");
              console.error("Please run the SQL schema script in Supabase:\nCREATE TABLE configs (key TEXT PRIMARY KEY, value JSONB);\n");
            }
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
