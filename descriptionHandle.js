async function getReelDescription(reelUrl) {
    const endpoint = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(reelUrl)}`;

    const res = await fetch(endpoint, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const data = await res.json();
    return data.title;
}

function updateDB(newData, url) {
  // read existing DB
  const raw = fs.readFileSync(filePath, "utf-8");
  const db = JSON.parse(raw);

  const { topic_action, topic_name, entry } = newData;

  // ✅ 1. handle topic
  if (topic_action === "new_topic") {
    if (!db.topics.includes(topic_name)) {
      db.topics.push(topic_name);
    }
  }

  // (optional but smart) ensure topic exists even for add_to_existing
  if (!db.topics.includes(topic_name)) {
    db.topics.push(topic_name);
  }

  // ✅ 2. handle entry (avoid duplicates)
  const exists = db.entries.some(
    (e) =>
      e.title.toLowerCase() === entry.title.toLowerCase() &&
      e.type === entry.type
  );

  // TIMESTAMP
  entry.timestamp = Date.now();

  // URL
  entry.url = url;

  if (!exists) {
    db.entries.push(entry);
  }

  // ✅ 3. write back
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));

  return db;
}

function getTopics() {
  const raw = fs.readFileSync(filePath, "utf-8");
  const db = JSON.parse(raw);

  return db.topics || [];
}

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found");

  return JSON.parse(match[0]);
}

function cleanJSON(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import fs from "fs";

const filePath = "./db.json";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export async function handleReel(url) {
    const topicList = getTopics();

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        You are a data extraction system.
No explanations. No extra text.
Classify the following content into JSON with:
- topic_action (new_topic or add_to_existing)
- topic_name (must match existing topics if possible)
- entry.title
- entry.topic
- entry.data (if place include address, if type website include url, etc)
- entry.type (place, website, movie, tvshow, information, tool, other)

If unsure, choose the closest valid option.
Existing topics=${JSON.stringify(topicList)}
content=${await getReelDescription(url)}
  `.trim()
    });
    console.log(response.text);
    const cleanedJson = cleanJSON(response.text);
    const extractedJson = extractJSON(cleanedJson);
    updateDB(extractedJson, url);
}
