import { db } from "../db/index.ts";
import { entries, type Entry, type NewEntry } from "../db/schema.ts";
import { eq, and, sql } from "drizzle-orm";

export type CreateEntryDto = Omit<NewEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: number };

export const entryService = {
    async add(dto: CreateEntryDto) {
        const exists = await db.select({ id: entries.id })
            .from(entries)
            .where(and(
                sql`lower(${entries.title}) = lower(${dto.title})`,
                eq(entries.type, dto.type)
            ))
            .limit(1);

        if (exists.length > 0) return;

        await db.insert(entries).values({
            ...dto,
            timestamp: Date.now()
        });
    },

    async getAll(limit: number = 0): Promise<Array<Entry>> {
        const query = db.select().from(entries).orderBy(entries.timestamp);

        if (limit > 0) {
            return await query.limit(limit);
        }

        return await query;
    },

    async update(updatedEntry: CreateEntryDto & { id: string }) {
        const result = await db.update(entries)
            .set(updatedEntry)
            .where(eq(entries.id, updatedEntry.id))
            .returning();

        if (result.length === 0) throw new Error("Entry not found!");
    }
}