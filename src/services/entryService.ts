import { randomUUID } from "crypto";
import { DB_FILEPATH } from "../config.ts";
import { CreateEntityDto, Entity } from "../types/index.ts";
import fs from "fs/promises";

export const entryService = {
    async add(dto: CreateEntityDto) {
        const rawJson = await fs.readFile(DB_FILEPATH, "utf-8");
        const db = JSON.parse(rawJson);

        dto.id = randomUUID();
        dto.timestamp = Date.now();

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
    },

    async update(updatedEntry: CreateEntityDto) {
        const rawJson = await fs.readFile(DB_FILEPATH, "utf-8");
        const db = JSON.parse(rawJson);

        const index = db.entries.findIndex((e: any) => (e.id as string).toLocaleLowerCase() === updatedEntry.id?.toLocaleLowerCase());
        if (index === -1) throw new Error("Kein alter Entry gefunden!");

        db.entries[index] = updatedEntry;
        await fs.writeFile(DB_FILEPATH, JSON.stringify(db, null, 2));
    }
}