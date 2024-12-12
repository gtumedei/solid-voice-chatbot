import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const Messages = sqliteTable("messages", {
  id: text("id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
})

export type MessageInsert = typeof Messages.$inferInsert
export type MessageSelect = typeof Messages.$inferSelect
