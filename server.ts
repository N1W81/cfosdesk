import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Helper to convert Firestore REST fields format to plain JSON
function fromFirestore(fields: any): any {
  const result: any = {};
  if (!fields) return result;
  for (const [key, value] of Object.entries(fields)) {
    result[key] = unwrapValue(value);
  }
  return result;
}

function unwrapValue(value: any): any {
  if (!value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return parseInt(value.integerValue, 10);
  if ("doubleValue" in value) return parseFloat(value.doubleValue);
  if ("nullValue" in value) return null;
  if ("mapValue" in value) {
    return fromFirestore(value.mapValue.fields);
  }
  if ("arrayValue" in value) {
    const values = value.arrayValue.values || [];
    return values.map((val: any) => unwrapValue(val));
  }
  return null;
}

// Helper to convert plain JSON to Firestore REST fields format
function toFirestore(obj: any): any {
  const fields: any = {};
  if (!obj) return { fields };
  for (const [key, val] of Object.entries(obj)) {
    const wrapped = wrapValue(val);
    if (wrapped !== undefined) {
      fields[key] = wrapped;
    }
  }
  return { fields };
}

function wrapValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "string") return { stringValue: val };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    if (Number.isInteger(val)) {
      return { integerValue: val.toString() };
    }
    return { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map(v => wrapValue(v))
      }
    };
  }
  if (typeof val === "object") {
    return {
      mapValue: {
        fields: toFirestore(val).fields
      }
    };
  }
  return undefined;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Supabase client lazily to avoid startup crash if keys are missing
  let supabaseClient: any = null;
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

  if (supabaseUrl && supabaseAnonKey) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      console.log("Supabase Client initialized successfully.");
    } catch (err) {
      console.error("Failed to initialize Supabase Client:", err);
    }
  } else {
    console.log("Supabase URL and Key not fully configured. Using fallback cloud database (Firebase) or local file storage.");
  }

  // Crucial: parse JSON payloads with high limit because logo images can be uploaded as base64
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const contentFilePath = path.join(process.cwd(), "content.json");

  // Load Firebase config for REST API
  let firestoreUrl: string | null = null;
  try {
    const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(firebaseConfigPath)) {
      const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
      const { projectId, firestoreDatabaseId, apiKey } = firebaseConfig;
      firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/config/website?key=${apiKey}`;
      console.log("Firebase Firestore REST client configured successfully. DB ID:", firestoreDatabaseId);
    } else {
      console.warn("firebase-applet-config.json not found. Falling back to local file storage only.");
    }
  } catch (error) {
    console.error("Failed to configure Firebase Firestore REST client, falling back to local file storage:", error);
  }

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

      // 2. Try reading from Firestore REST API next for true global state
      if (firestoreUrl) {
        try {
          const response = await fetch(firestoreUrl);
          if (response.ok) {
            const data = await response.json();
            if (data && data.fields) {
              console.log("Loaded content globally from Firestore REST API.");
              const parsedContent = fromFirestore(data.fields);
              return res.json(parsedContent);
            }
          } else if (response.status === 404) {
            console.log("Firestore document not found. Falling back to local/default content.");
          } else {
            console.error("Firestore REST API returned error:", response.status, await response.text());
          }
        } catch (dbError) {
          console.error("Error fetching from Firestore REST API, trying local file fallback:", dbError);
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
          console.error("Error saving to Supabase, trying Firebase/local fallbacks:", dbError);
        }
      }

      // 2. Persist to Firestore REST API next for global synchronicity
      if (firestoreUrl) {
        try {
          const response = await fetch(firestoreUrl, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(toFirestore(data))
          });
          if (response.ok) {
            console.log("Saved content globally to Firestore REST API.");
          } else {
            console.error("Error saving to Firestore REST API:", response.status, await response.text());
          }
        } catch (dbError) {
          console.error("Error saving to Firestore REST API:", dbError);
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
