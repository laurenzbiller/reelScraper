import { pgTable, uuid, varchar, text, bigint, jsonb } from 'drizzle-orm/pg-core';

export interface ActionData {
    label: string | null;
    url: string | null;
}

export interface LocationData {
    name: string | null;
    address: string | null;
    city: string | null;
}

export interface PriceData {
    amount: number | null;
    currency: string | null;
    note: string | null;
}

export interface ItemData {
    name: string;
    detail: string | null;
    price: string | null;
    url: string | null;
}

export interface SourceData {
    url: string;
    rawDescription: string;
    rawTranscription: string;
}

export const topics = pgTable('topics', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
});

export const entries = pgTable('entries', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 500 }).notNull(),
    primary: text('primary').notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    topic: varchar('topic', { length: 255 }),
    timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
    tags: jsonb('tags').$type<string[]>().default([]),
    steps: jsonb('steps').$type<string[]>(),
    items: jsonb('items').$type<ItemData[]>(),
    source: jsonb('source').$type<SourceData>(),
    action: jsonb('action').$type<ActionData>(),
    location: jsonb('location').$type<LocationData>(),
    price: jsonb('price').$type<PriceData>(),
});

export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
