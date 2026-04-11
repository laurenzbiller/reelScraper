import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import OpenAI from "openai";
import fs from "fs";

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

// : Promise<CreateEntityDto>
export const llmService = {
    async processInformation(description: string, topics: Array<string>, transcription: string) {
        const resp = await prompt(`
You are a data extraction system. Output only valid JSON, no other text.

- topic_action: "add_to_existing" if topic matches one below, else "new_topic"
- topic: general topic (match existing if possible)
- title: concise title
- type: place | website | movie | tvshow | tool | tips | information | other
- data: a markdown string that capture valuable information from the content.
  Extract whatever is most useful given the type (e.g. tips, steps, url, address, tools, people, dates, prices — anything relevant).
  Only include fields that have actual content. Be thorough.

Existing topics: ${JSON.stringify(topics)}
Content: ${description}
Transcription: ${transcription}`.trim());
        console.log(resp);
    },

    async transcribeWhisper(file: string): Promise<string> {
        const res = await openai.audio.transcriptions.create({
            file: fs.createReadStream(file),
            model: "gpt-4o-mini-transcribe",
        });
        return res.text;
    }
}