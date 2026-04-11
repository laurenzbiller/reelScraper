import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import OpenAI from "openai";
import fs from "fs";
import { CreateEntityDto } from "../types/index.ts";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const googleai = new GoogleGenAI({});
const localClient = new OpenAI({
    baseURL: "http://localhost:11434/v1",
    apiKey: "unused",
});
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function prompt(promptString: string) {
    if (process.env.DEV == "1") {
        const resp = await localClient.chat.completions.create({
            model: "apple-foundationmodel",
            messages: [{ role: "user", content: promptString }],
        });
        return resp.choices[0]!.message.content
    } else {
        const resp = await googleai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promptString
        });
        return resp.text;
    }
}

function extractJSON(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found");

  return JSON.parse(match[0]);
}

function cleanResponse(text: string): string {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export const llmService = {
    async processInformation(description: string, topics: Array<string>, transcription: string): Promise<CreateEntityDto> {
        const resp = await prompt(`
You are a data extraction system. Output only valid JSON, no other text.

{
  "title": "concise title",
  "topic": "general topic (match existing if possible)",
  "topic_action": "add_to_existing" | "new_topic",
  "type": "place" | "website" | "movie" | "tvshow" | "tool" | "tips" | "information" | "other",
  "source": {
    "platform": "instagram",
    "author": "username/creator if mentioned",
  },
  "data": {
    // extract any fields that capture valuable information
    // adapt to the type — be thorough, only include what has actual content
  }
}

Existing topics: ${JSON.stringify(topics)}
Description: ${description}
Transcription: ${transcription}
Existing topics: ${JSON.stringify(topics)}
Content: ${description}
Transcription: ${transcription}`.trim());
        console.log(resp);
        const cleanedResp: string = cleanResponse(resp!);
        const jsonResp = extractJSON(cleanedResp);
        return CreateEntityDto.fromJSON(jsonResp);
    },

    async transcribeWhisper(file: string): Promise<string> {
        const res = await openai.audio.transcriptions.create({
            file: fs.createReadStream(file),
            model: "gpt-4o-mini-transcribe",
        });
        return res.text;
    }
}