import { useChat as useChatSdk } from "@ai-sdk/solid"
import { create } from "~/lib/context"

export const [ChatProvider, useChat] = create(
  (props: { options: Parameters<typeof useChatSdk>[0] }) => {
    const chat = useChatSdk(props.options)
    return chat
  }
)
