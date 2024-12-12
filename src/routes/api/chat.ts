import { openai } from "@ai-sdk/openai"
import { APIHandler } from "@solidjs/start/server"
import { convertToCoreMessages, streamText } from "ai"
import { nanoid } from "nanoid"
import { db } from "~/db"
import { Messages } from "~/db/schema"
import githubGetRepo from "~/lib/ai/tools/github-get-repo"
import githubGetUser from "~/lib/ai/tools/github-get-user"
import githubListRepos from "~/lib/ai/tools/github-list-repos"

const model = openai("gpt-4o-mini")
const systemPrompt = `
You are a friendly CLI interface with some tools up your sleeve.
`

export const POST: APIHandler = async (e) => {
  const { messages: rawMessages } = await e.request.json()
  const messages = convertToCoreMessages(rawMessages)

  // Save the last user message
  const lastMessage = messages[messages.length - 1]
  if (lastMessage) {
    await db.insert(Messages).values({
      id: nanoid(),
      role: lastMessage.role,
      content: lastMessage.content as string,
      createdAt: new Date(),
    })
  }

  const result = streamText({
    model,
    system: systemPrompt,
    messages,
    tools: { githubGetUser, githubListRepos, githubGetRepo },
    onFinish: async (e) => {
      // Save the assistant message
      await db.insert(Messages).values({
        id: nanoid(),
        role: "assistant",
        content: e.text,
        toolInvocations:
          e.toolResults.length > 0
            ? JSON.stringify(e.toolResults.map((r) => ({ ...r, state: "result" })))
            : null,
        createdAt: new Date(),
      })
    },
    // maxSteps: 5,
  })

  return result.toDataStreamResponse()
}
