import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const Chats = sqliteTable("chats", {
  id: text().primaryKey(),
  createdAt: integer({ mode: "timestamp" }).notNull(),
})

export const Messages = sqliteTable("messages", {
  id: text().primaryKey(),
  role: text().notNull(),
  chatId: text()
    .notNull()
    .references(() => Chats.id),
  parts: text({ mode: "json" }),
  createdAt: integer({ mode: "timestamp" }).notNull(),
})

export type MessageInsert = typeof Messages.$inferInsert
export type MessageSelect = typeof Messages.$inferSelect
