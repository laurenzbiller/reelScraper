import { DB_FILEPATH } from "../config.ts";
import { Entity, type CreateEntityDto } from "../types/index.ts";
import fs from "fs/promises";

export const entryService = {
    async add(dto: CreateEntityDto) {
        const rawJson = await fs.readFile(DB_FILEPATH, "utf-8");
        const db = JSON.parse(rawJson);

        dto.timestamp = Date.now();

        if (!db.topics.includes(dto.topic)) {
            db.topics.push(dto.topic);
        }

        const exists = db.entries.some(
            (e: any) =>
                e.title.toLowerCase() === dto.title.toLowerCase() &&
                e.type === dto.type
        );
        if (exists) return;

        db.entries.push(dto);
        await fs.writeFile(DB_FILEPATH, JSON.stringify(db, null, 2));
    },

    async getAll(limit: number = 0): Promise<Array<Entity>> {
        const fileData = await fs.readFile(DB_FILEPATH, "utf-8");

        const jsonData = JSON.parse(fileData);
        const entites: Array<Entity> = jsonData.entries.map((rawEntity: any) => Entity.fromJSON(rawEntity));

        return entites.splice(-limit);
    }
}