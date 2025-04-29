import { A, createAsync, useAction } from "@solidjs/router"
import { generateId } from "ai"
import { For } from "solid-js"
import AppTitle from "~/components/app-title"
import { chatsQuery, createChatAction, deleteChatAction } from "~/lib/chats-store"
import TablerTrash from "~icons/tabler/trash"

const ChatsPage = () => {
  const chats = createAsync(() => chatsQuery())

  const createChat = useAction(createChatAction)
  const deleteChat = useAction(deleteChatAction)

  return (
    <div class="container md:max-w-2xl flex flex-col gap-6 py-16 mx-auto">
      <AppTitle>Chats</AppTitle>
      <h1 class="text-center text-2xl text-sky-700 uppercase mb-16">Solid Voice Chatbot - Chats</h1>
      <ul class="flex flex-col gap-3 mb-8">
        <For each={chats()} fallback={<p class="text-center">You have no active chats.</p>}>
          {(chat) => (
            <li class="relative">
              <A
                href={`/chats/${chat.id}`}
                class="h-14 flex items-center px-4 py-2 rounded-md border border-gray-300 hover:border-sky-400 focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50 shadow-sm transition-colors"
              >
                Chat from {chat.createdAt.toLocaleString()}
              </A>
              <button
                type="button"
                title="Delete chat"
                class="rounded-full border border-gray-300 bg-white p-2 text-center text-sm font-medium text-rose-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400 absolute-center-y right-2.5"
                onClick={() => deleteChat({ chatId: chat.id })}
              >
                <TablerTrash />
              </button>
            </li>
          )}
        </For>
      </ul>
      <button
        class="w-1/3 rounded-lg border border-sky-600 bg-sky-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-sky-200 disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-300 mx-auto"
        onClick={() => createChat({ chatId: generateId() })}
      >
        New chat
      </button>
    </div>
  )
}

export default ChatsPage
