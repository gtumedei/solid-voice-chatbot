import { openai } from "@ai-sdk/openai"
import { APIHandler } from "@solidjs/start/server"
import { appendResponseMessages, Message, streamText } from "ai"
import { db } from "~/db"
import { Messages } from "~/db/schema"
import githubGetRepo from "~/lib/ai/tools/github-get-repo"
import githubGetUser from "~/lib/ai/tools/github-get-user"
import githubListRepos from "~/lib/ai/tools/github-list-repos"

const model = openai("gpt-4o-mini")
const systemPrompt = `
You are a friendly CLI interface with some tools up your sleeve.

When using a tool as part of your response, your first follow-up message should not restate the tool data, as it will already be displayed in the UI.
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
  const { id: chatId, messages } = (await e.request.json()) as { id: string; messages: Message[] }

  // Save the last user message
  const newUserMessage = messages[messages.length - 1]
  console.log(newUserMessage)
  if (newUserMessage) {
    await db.insert(Messages).values({
      id: newUserMessage.id,
      role: newUserMessage.role,
      chatId,
      parts: newUserMessage.parts,
      createdAt: newUserMessage.createdAt ? new Date(newUserMessage.createdAt) : new Date(),
    })
  }

  console.log("BEFORE RESPONSE")
  console.dir(messages, { depth: Infinity })

  const result = streamText({
    model,
    system: systemPrompt,
    messages,
    tools: { githubGetUser, githubListRepos, githubGetRepo },
    onFinish: async ({ response }) => {
      console.log("AFTER RESPONSE")
      const newMessages = appendResponseMessages({
        messages,
        responseMessages: response.messages,
      })
      console.dir(newMessages, { depth: Infinity })
      console.log("after 1")
      // Save the chatbot message
      const newAssistantMessage = newMessages[newMessages.length - 1]
      if (newAssistantMessage) {
        await db.insert(Messages).values({
          id: newAssistantMessage.id,
          role: newAssistantMessage.role,
          chatId,
          parts: newAssistantMessage.parts,
          createdAt: newAssistantMessage.createdAt
            ? new Date(newAssistantMessage.createdAt)
            : new Date(),
        })
      }
    },
    // maxSteps: 5,
  })

  result.consumeStream() // Ensure onFinish is triggered even if the client response gets aborted
  return result.toDataStreamResponse()
}
