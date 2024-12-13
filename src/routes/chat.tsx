import { Message } from "@ai-sdk/solid"
import { createAsync } from "@solidjs/router"
import { Component, createEffect, createSignal, For, on, onMount } from "solid-js"
import { z } from "zod"
import AppTitle from "~/components/app-title"
import LoadingSpinner from "~/components/loading-spinner"
import Markdown from "~/components/markdown"
import { db } from "~/db"
import { Messages } from "~/db/schema"
import { ChatProvider, useChat } from "~/lib/ai"
import GithubRepoCard from "~/lib/ai/tools/github-get-repo/component"
import GithubUserCard from "~/lib/ai/tools/github-get-user/component"
import GithubRepoListCard from "~/lib/ai/tools/github-list-repos/component"
import { create } from "~/lib/context"
import { safeQuery } from "~/lib/safe-data"
import { useSpeech } from "~/lib/speech"
import TablerMicrophone from "~icons/tabler/microphone"
import TablerPlay from "~icons/tabler/play"
import TablerPlayerStop from "~icons/tabler/player-stop"
import TablerRobotFace from "~icons/tabler/robot-face"
import TablerSend2 from "~icons/tabler/send-2"
import TablerTrash from "~icons/tabler/trash"
import TablerUser from "~icons/tabler/user"
import TablerVolume from "~icons/tabler/volume"
import TablerVolume3 from "~icons/tabler/volume-3"

const getChat = safeQuery(
  z.void(),
  async () => {
    "use server"
    const messages = (await db.select().from(Messages)).map((message) => ({
      ...message,
      toolInvocations: message.toolInvocations
        ? (JSON.parse(message.toolInvocations) as Message["toolInvocations"])
        : null,
    }))
    return messages
  },
  "chat"
)

const deleteChat = async () => {
  "use server"
  await db.delete(Messages)
}

const [VoiceOutputProvider, useVoiceOutput] = create(() => {
  const [enabled, setEnabled] = createSignal(true)
  return { enabled, setEnabled }
})

const ChatPage = () => {
  const chat = createAsync(() => getChat())

  // Scroll to the bottom on page load
  onMount(async () => {
    await new Promise((r) => setTimeout(r, 0)) // Dirty fix for CSR
    document.documentElement.scrollTop = document.documentElement.scrollHeight
  })

  return (
    <ChatProvider
      options={() => ({
        initialMessages: chat() as Message[],
        onFinish: () => {
          // Scroll to the bottom when a new message arrives
          document.documentElement.scrollTop = document.documentElement.scrollHeight
        },
      })}
    >
      <VoiceOutputProvider>
        <div class="container md:max-w-2xl flex flex-col gap-6 pt-16 pb-4 mx-auto">
          <AppTitle>Chat</AppTitle>
          <h1 class="text-center text-6xl text-sky-700 font-thin uppercase mb-8">Chat</h1>
          <Chat />
        </div>
      </VoiceOutputProvider>
    </ChatProvider>
  )
}

const Chat = () => {
  const { recognition } = useSpeech()
  const voiceOutput = useVoiceOutput()

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat()

  // Copy speech transcript to the input field
  createEffect(() => setInput(recognition.transcript))

  return (
    <div class="grow w-full flex flex-col pb-24">
      <div class="flex flex-col gap-6 py-6">
        <For each={messages()}>
          {(message, i) => (
            <ChatMessage
              message={message}
              isLoading={i() == messages().length - 1 && isLoading()}
            />
          )}
        </For>
      </div>
      <div class="flex fixed bottom-0 inset-x-6">
        <form
          class="container md:max-w-2xl flex gap-2 pb-4 bg-white mx-auto relative"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 pb-14"
            value={input()}
            onChange={handleInputChange}
          />
          <div class="absolute inset-x-2 bottom-6 flex gap-2 pointer-events-none [&>*]:pointer-events-auto">
            <button
              type="button"
              title="Delete chat"
              class="rounded-full border border-gray-300 bg-white p-2 text-center text-sm font-medium text-rose-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400 mr-auto"
              onClick={async () => {
                if (confirm("Are you sure you want to delete the chat?")) {
                  await deleteChat()
                  location.reload()
                }
              }}
            >
              <TablerTrash />
            </button>
            <button
              type="button"
              title="Toggle automatic voice output"
              class="rounded-full border border-gray-300 bg-white p-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
              classList={{ "!bg-gray-200": !voiceOutput.enabled() }}
              onClick={() => voiceOutput.setEnabled((v) => !v)}
            >
              {voiceOutput.enabled() ? <TablerVolume /> : <TablerVolume3 />}
            </button>
            <button
              type="button"
              title="Record"
              class="rounded-full border border-sky-600 bg-sky-600 p-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-sky-200 disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-300"
              onClick={() => recognition.listen()}
              disabled={recognition.isListening()}
            >
              <TablerMicrophone />
            </button>
            <button
              type="submit"
              title="Send"
              class="rounded-full border border-sky-600 bg-sky-600 p-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-sky-200 disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-300"
            >
              <TablerSend2 />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ChatMessage: Component<{ message: Message; isLoading: boolean }> = (props) => {
  const { synthesis } = useSpeech()
  const [isPlaying, setIsPlaying] = createSignal(false)

  const togglePlaying = async () => {
    if (synthesis.isSpeaking()) {
      if (!isPlaying()) return
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      await synthesis.speak(props.message.content)
      setIsPlaying(false)
    }
  }

  // Autoplay new messages
  // Not very pretty, but basically:
  // - Registers the initial loading state of the message
  // - Watches the loading state
  // - If the message wasLoading and now is not loading anymore, plays the message
  let wasLoading = props.isLoading
  const voiceOutput = useVoiceOutput()
  createEffect(
    on(
      () => props.isLoading,
      (isLoading) => {
        if (
          props.message.role != "user" &&
          voiceOutput.enabled() &&
          isLoading === false &&
          wasLoading === true
        ) {
          togglePlaying()
        }
      }
    )
  )

  return (
    <div class="flex gap-4">
      <div
        class={`shrink-0 h-9 w-9 flex justify-center items-center rounded-lg border text-center text-sm font-medium mt-[7px] shadow-sm ${
          props.message.role == "user"
            ? "border-gray-300 bg-white text-gray-700 "
            : "border-gray-700 bg-gray-700 text-white shadow-sm"
        }`}
      >
        {props.message.role == "user" ? (
          <TablerUser />
        ) : props.isLoading ? (
          <LoadingSpinner />
        ) : (
          <TablerRobotFace />
        )}
      </div>
      <div class="flex flex-col">
        {props.message.toolInvocations ? (
          <UIMessageContent message={props.message} />
        ) : (
          <TextMessageContent message={props.message} />
        )}
        {props.message.role != "user" && !props.isLoading && !props.message.toolInvocations && (
          <div class="mr-auto mt-0.5 relative">
            <button
              title={isPlaying() ? "Stop" : "Play"}
              class="rounded-full border border-transparent bg-transparent p-1.5 text-center text-xs font-medium text-gray-700 shadow-none transition-all hover:bg-gray-100 disabled:bg-transparent disabled:text-gray-400"
              onClick={togglePlaying}
              disabled={props.isLoading || (!isPlaying() && synthesis.isSpeaking())}
            >
              {isPlaying() ? <TablerPlayerStop /> : <TablerPlay />}
            </button>
            {isPlaying() && <LoadingSpinner class="h-3.5 w-3.5 absolute-center-y -right-3.5" />}
          </div>
        )}
      </div>
    </div>
  )
}

const TextMessageContent: Component<{ message: Message }> = (props) => {
  return (
    <Markdown
      class={`prose prose-sm px-4 py-3 rounded-lg ${
        props.message.role == "user"
          ? "border border-gray-200"
          : "bg-gray-100 border border-gray-300"
      }`}
    >
      {props.message.content}
    </Markdown>
  )
}

const UIMessageContent: Component<{ message: Message }> = (props) => {
  return (
    <For each={props.message.toolInvocations}>
      {(toolInvocation) => (
        <>
          {toolInvocation.state == "result" ? (
            <>
              {toolInvocation.toolName == "githubGetUser" ? (
                <GithubUserCard user={toolInvocation.result} />
              ) : toolInvocation.toolName == "githubListRepos" ? (
                <GithubRepoListCard repositories={toolInvocation.result} />
              ) : toolInvocation.toolName == "githubGetRepo" ? (
                <GithubRepoCard repository={toolInvocation.result} />
              ) : (
                "unknown tool"
              )}
            </>
          ) : (
            <TextMessageContent message={{ ...props.message, content: "Loading..." }} />
          )}
        </>
      )}
    </For>
  )
}

export default ChatPage
