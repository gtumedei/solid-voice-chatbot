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

// TODO: find the right combination of prompt and tool descriptions to prevent the LLM from restating tool responses with maxSteps > 1

// Does not seem to work
/* const systemPrompt = `
You are a friendly CLI interface with some tools up your sleeve.

When using a tool whose name starts with [NO_FOLLOW_UP], your follow-up response must not include any of the information you fetched, as the UI output of the tool call already includes that.
` */

// Working, but requires handling each tool individually
/* const systemPrompt = `
You are a friendly CLI interface with some tools up your sleeve.

Here are some instructions you have to follow when using your tools.
- When using the githubGetUser tool, your follow-up response must not give any information about the user, as the UI output of the tool call already does that.
- When using the githubListRepos tool, your follow-up response must not list the repositories, as the UI output of the tool call already does that.
` */

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
    onStepFinish: async (e) => {
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
