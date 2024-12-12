import { openai } from "@ai-sdk/openai"
import { APIHandler } from "@solidjs/start/server"
import { convertToCoreMessages, streamText } from "ai"
import githubGetRepo from "~/lib/ai/tools/github-get-repo"
import githubGetUser from "~/lib/ai/tools/github-get-user"
import githubListRepos from "~/lib/ai/tools/github-list-repos"

const model = openai("gpt-4o-mini")
const systemPrompt = `
You are a friendly CLI interface with some tools up your sleeve.
`

export const POST: APIHandler = async (e) => {
  const { messages } = await e.request.json()

  const result = streamText({
    model,
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
    tools: { githubGetUser, githubListRepos, githubGetRepo },
    // maxSteps: 5,
  })

  return result.toDataStreamResponse()
}
