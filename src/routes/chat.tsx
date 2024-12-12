import { Message, useChat } from "@ai-sdk/solid"
import { Component, For } from "solid-js"
import AppTitle from "~/components/app-title"
import Markdown from "~/components/markdown"
import GithubRepoCard from "~/lib/ai/tools/github-get-repo/component"
import GithubUserCard from "~/lib/ai/tools/github-get-user/component"
import GithubRepoListCard from "~/lib/ai/tools/github-list-repos/component"
import TablerRobotFace from "~icons/tabler/robot-face"
import TablerUser from "~icons/tabler/user"

const ChatPage = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <div class="container md:max-w-2xl flex flex-col gap-6 pt-16 pb-4 mx-auto">
      <AppTitle>Chat</AppTitle>
      <h1 class="text-center text-6xl text-sky-700 font-thin uppercase mb-8">Chat</h1>
      <div class="grow w-full flex flex-col pb-20">
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
          <form class="container md:max-w-2xl flex gap-2 py-4 mx-auto" onSubmit={handleSubmit}>
            <input
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              value={input()}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              class="rounded-lg border border-sky-600 bg-sky-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-sky-200 disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const ChatMessage: Component<{ message: Message; isLoading: boolean }> = (props) => {
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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            />
            <path
              fill="currentColor"
              d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
            >
              <animateTransform
                attributeName="transform"
                dur="0.75s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
          </svg>
        ) : (
          <TablerRobotFace />
        )}
      </div>
      {props.message.toolInvocations ? (
        <UIMessageContent message={props.message} />
      ) : (
        <TextMessageContent message={props.message} />
      )}
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
