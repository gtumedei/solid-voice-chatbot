import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const Messages = sqliteTable("messages", {
  id: text().primaryKey(),
  role: text().notNull(),
  content: text(),
  toolInvocations: text(),
  createdAt: integer({ mode: "timestamp" }).notNull(),
})

export type MessageInsert = typeof Messages.$inferInsert
export type MessageSelect = typeof Messages.$inferSelect
