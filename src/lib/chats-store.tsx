import { redirect } from "@solidjs/router"
import { Message } from "ai"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~/db"
import { Chats, Messages } from "~/db/schema"
import { safeAction, safeQuery } from "~/lib/safe-data"

const ChatIdSchema = z.object({
  chatId: z.string(),
})

export const chatsQuery = safeQuery(
  z.void(),
  async () => {
    "use server"
    const chats = await db.select().from(Chats)
    return chats
  },
  "chats"
)

export const chatMessagesQuery = safeQuery(
  ChatIdSchema,
  async (params) => {
    "use server"
    const messages = (
      await db.select().from(Messages).where(eq(Messages.chatId, params.chatId))
    ).map((message) => ({
      ...message,
      content: "",
      parts: message.parts as Message["parts"],
    }))
    return messages
  },
  "chat-messages"
)

export const createChatAction = safeAction(ChatIdSchema, async (params) => {
  "use server"
  await db.insert(Chats).values([{ id: params.chatId, createdAt: new Date() }])
  throw redirect(`/chats/${params.chatId}`)
})

export const deleteChatAction = safeAction(ChatIdSchema, async (params) => {
  "use server"
  await db.delete(Messages).where(eq(Messages.chatId, params.chatId))
  await db.delete(Chats).where(eq(Chats.id, params.chatId))
  throw redirect("/chats")
})
