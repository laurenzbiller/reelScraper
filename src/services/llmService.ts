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
        const modelList = await localClient.models.list();
        if (modelList.data.length < 1) throw new Error("No Local Model provided!");
        const modelId = modelList.data[0]!.id;

        const resp = await localClient.chat.completions.create({
            model: modelId,
            messages: [{ role: "user", content: promptString }],
        });
        return resp.choices[0]!.message.content;
    } else {
        const resp = await googleai.models.generateContent({
            model: process.env.GEMINI_API_MODEL!,
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
OUTPUT ONLY A SINGLE JSON OBJECT. NO PROSE. NO EXPLANATIONS. NO MARKDOWN CODE BLOCKS. NO CONVERSATION. IF YOU OUTPUT ANYTHING OTHER THAN RAW JSON, THE EXTRACTION FAILS.

---

You are an information extraction system. Extract actionable, specific details from Instagram reels for a personal knowledge base.

EXTRACTION EXAMPLES:
- Restaurant reel → name, address/neighborhood, signature dish, price range, reservation tip, best time to go
- Tutorial/how-to → specific skill/technique, exact steps shown, tools/materials needed, expected outcome, difficulty level
- Travel/place → location name, address/how to get there, what to do there, best time to visit, cost if mentioned
- Product/tool/app → name, exact problem it solves, price if mentioned, where to get it, key features
- Recipe → dish name, ingredients list (with measurements if mentioned), key steps, cooking time, tips
- List/comparison (e.g., "3 affordable brands") → extract ALL items as a list with details for each

OUTPUT FORMAT (valid JSON only):
{
  "title": "specific, searchable title (e.g., 'Ramen Shop in Shibuya Tokyo' not 'Cool restaurant')",
  "topic": "content topic like Fashion, Cooking, Travel, Tech (NEVER 'speech-to-text', 'audio', 'video', 'instagram')",
  "topic_action": "add_to_existing" | "new_topic",
  "type": "place | tutorial | recipe | tool | travel | information | other",
  "source": {
    "platform": "instagram",
    "author": "username if clearly mentioned, else empty string"
  },
  "data": {
    // REQUIRED: 2-4 specific fields relevant to the type above
    // For list content (multiple items), use "items": [{name, details, price}, ...]
    // Omit only if zero actionable info exists
  }
}

RULES:
1. Be SPECIFIC - "sushi restaurant in Shibuya" not "food place"
2. Extract STEPS for tutorials, not summaries
3. Include PRICES, ADDRESSES, or LINKS if mentioned
4. If reel has no actionable info (just entertainment), set type="other" and data={}
5. Never invent information - only extract what's in the content
6. TOPIC must describe the SUBJECT MATTER (Fashion, Cooking, Tech), never the medium

Existing topics: ${JSON.stringify(topics)}
Content description: ${description}
Audio transcription: ${transcription}`.trim());
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