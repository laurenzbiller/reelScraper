import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import OpenAI from "openai";
import fs from "fs";
import type { NewEntry, ItemData, ActionData, LocationData, PriceData } from "../db/schema.ts";
import type { CreateEntryDto } from "./entryService.ts";

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

function extractJSON(text: string) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
        console.log(text);
        throw new Error("No JSON found");
    }

    return JSON.parse(match[0]);
}

function cleanResponse(text: string): string {
    return text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
}

export const llmService = {
    async processInformation(description: string, topics: Array<string>, transcription: string): Promise<CreateEntryDto> {

        const extractionRaw = await prompt(`
OUTPUT ONLY RAW JSON. NO PROSE. NO MARKDOWN. NO CODE BLOCKS.
If you output anything other than a single valid JSON object, the pipeline breaks.

Your job is fact extraction. Be exhaustive — omission is always worse than a redundant entry.

Return exactly this shape:
{
  "facts": ["one concrete fact per string"],
  "type": "place | tool | recipe | tutorial | product | information | other",
  "topic": "single subject word — Fashion, Tech, Travel, Food, Fitness etc."
}

EXTRACTION RULES:
- Extract EVERY fact explicitly stated — never skip, never summarize multiple into one
- Every fact is a plain string sentence. Never an object, never nested
- Keep every proper noun exactly as stated: names, tool names, brand names, commands, handles
- One fact per item — always split compound sentences into separate facts
- These are MANDATORY if present — never skip them:
  * Every URL or link mentioned (exact string)
  * Every price or cost mentioned (exact amount + currency)
  * Every tool, app, software, or platform name
  * Every command, shortcut, or code snippet
  * Every step in a process (one fact per step)
  * Every location name, address, or city
  * Every person name or brand name
- Skip only: intro/outro filler ("don't forget to like"), vague hype ("this is amazing")
- Never invent or infer — only extract what is explicitly stated

TYPE RULES:
- place: physical location (restaurant, beach, shop, city)
- tool: app, software, skill, extension, service, platform
- recipe: food or drink with ingredients or steps
- tutorial: how-to with steps but no specific named tool
- product: physical buyable item
- information: general knowledge, tips, facts
- other: entertainment only, nothing actionable

Existing topics: ${JSON.stringify(topics)}

DESCRIPTION:
${description}

TRANSCRIPTION:
${transcription}
`.trim());

        const cleanedExtractionData = cleanResponse(extractionRaw!);
        const jsonExtraction = extractJSON(cleanedExtractionData);
        console.log(jsonExtraction);

        const structuringRaw = await prompt(`
OUTPUT ONLY RAW JSON. NO PROSE. NO MARKDOWN. NO CODE BLOCKS.
If you output anything other than a single valid JSON object, the pipeline breaks.
I must be a valid json object with valid opening and closing brackets.

Your job is to map the provided facts into the output envelope.
The facts array is your PRIMARY source. 
The original description and transcription are your FALLBACK — use them to recover 
anything the facts array may have missed. Never leave a field empty if the information 
exists anywhere in the three sources.

Output exactly this shape. Every field is required — use null only if the information 
truly does not exist anywhere in the sources:
{
  "title": "specific searchable title — always includes the primary proper noun",
  "topic": "single subject word — if matching existing topic use this, if not leave empty",
  "type": "place | tool | recipe | tutorial | product | information | other",
  "primary": "one sentence — what this is and why it matters, never null",
  "details": ["supporting fact 1", "supporting fact 2"],
  "action": { "label": "GitHub | Buy | Book | Maps | Install | Watch", "url": "exact url or empty string if platform mentioned but no url" } | null,
  "location": { "name": "...", "address": "...", "city": "..." } | null,
  "price": { "amount": 12.99, "currency": "USD", "note": "per person / per month etc." } | null,
  "steps": ["step 1", "step 2"] | null,
  "items": [{ "name": "exact name", "detail": "what it does", "price": "if mentioned", "url": "if mentioned" }] | null,
  "tags": ["tag1", "tag2"]
}

FIELD RULES:
- title: always includes the primary proper noun (tool name, place name, product name)
- topic: match existing topic, or leave empty
- type: must match the actual content — place for locations, tool for apps/software, etc.
- primary: always required, one punchy sentence, never null
- details: minimum 1 item — use for context not covered by other fields
- action: include if ANY url or platform was mentioned — set url to "" if no exact url
- steps: only for tutorials and recipes, null for everything else
- items: use when 2+ distinct named tools, products, or places are described
- tags: 2-4 lowercase keywords, no words already in the title

PROPER NOUN RULE:
Every specific name from the facts (person, tool, brand, command, place) MUST appear 
somewhere in the output. Never replace a specific name with a generic description.

Existing topics: ${JSON.stringify(topics)}

FACTS (primary source):
${JSON.stringify(jsonExtraction.facts)}

ORIGINAL DESCRIPTION (fallback):
${description}

ORIGINAL TRANSCRIPTION (fallback):
${transcription}
`.trim());

        const cleanedResp: string = cleanResponse(structuringRaw!);
        const jsonResp = extractJSON(cleanedResp);
        
        return {
            title: jsonResp.title ?? '',
            primary: jsonResp.primary ?? '',
            type: jsonResp.type ?? '',
            topic: jsonResp.topic || null,
            tags: jsonResp.tags ?? [],
            steps: jsonResp.steps ?? null,
            items: jsonResp.items ?? null,
            action: jsonResp.action ?? null,
            location: jsonResp.location ?? null,
            price: jsonResp.price ?? null,
            source: null,
        };
    },

    async transcribeWhisper(file: string): Promise<string> {
        const res = await openai.audio.transcriptions.create({
            file: fs.createReadStream(file),
            model: "gpt-4o-mini-transcribe",
        });
        return res.text;
    }
}