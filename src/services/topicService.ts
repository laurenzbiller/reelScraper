import { db } from "../db/index.ts";
import { topics } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export const topicService = {
    async getAll(): Promise<Array<string>> {
        const result = await db.select({ name: topics.name }).from(topics);
        return result.map(t => t.name);
    },

    async add(name: string) {
        await db.insert(topics).values({ name }).onConflictDoNothing();
    },

    async remove(name: string) {
        await db.delete(topics).where(eq(topics.name, name));
    }
}