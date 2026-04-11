import fs from "fs/promises";
import { DB_FILEPATH } from "../config.ts";

export const topicService = {
    async getAll(): Promise<Array<string>> {
        const raw = await fs.readFile(DB_FILEPATH, "utf-8");
        const db = JSON.parse(raw);

        return db.topics || [];
    }
}