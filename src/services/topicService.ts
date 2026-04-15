import fs from "fs/promises";
import { DB_FILEPATH } from "../config.ts";

export const topicService = {
    async getAll(): Promise<Array<string>> {
        const raw = await fs.readFile(DB_FILEPATH, "utf-8");
        const db = JSON.parse(raw);

        return db.topics || [];
    },

    async add(topic: string) {
        const rawJson = await fs.readFile(DB_FILEPATH, "utf-8");
        const db = JSON.parse(rawJson);

        if (!db.topics.includes(topic)) {
            db.topics.push(topic);
        }

        await fs.writeFile(DB_FILEPATH, JSON.stringify(db, null, 2));
    },

    async remove(topic: string) {
        const rawJson = await fs.readFile(DB_FILEPATH, "utf-8");
        const db = JSON.parse(rawJson);

        if (db.topics.includes(topic)) {
            db.topics = db.topics.filter((e: any) => e !== topic);
        }

        await fs.writeFile(DB_FILEPATH, JSON.stringify(db, null, 2));
    }
}