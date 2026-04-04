import express from "express";
import { handleReel } from "./descriptionHandle.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware to parse JSON
app.use(express.json());

app.use(express.static(path.resolve('public')));

// POST endpoint
app.post("/reel", async (req, res) => {
  const { url } = req.body;

  // basic check (optional)
  if (!url || typeof url !== "string") {
    return res.status(200).json({ status: "ok" });
  }

  await handleReel(url);
  console.log(url);

  // always return 200
  return res.status(200).json({ status: "ok" });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/entries", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "db.json");

    const fileData = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileData);

    res.json(jsonData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read JSON file" });
  }
});