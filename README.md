# solid-voice-chatbot

A fully-featured chatbot made with SolidJS and the Vercel AI SDK.

## Getting started

- Clone this repo
- `cp .env.example .env`, then place your OpenAI API key in `.env`
- Install dependencies with `pnpm i`
- Create SQLite db with `pnpm db:push`
- Run the dev server with `pnpm dev`
- Open the database editor with `pnpm db:studio`

## Features

- Conversational AI
- RAG: some examples using the GitHub APIs are included
- Render SolidJS components as messages via tools
- Web Speech API wrapper for SolidJS
- Record messages via speech recognition
- Play chatbot messages via speech synthesis

## TODO

- [x] Implement a UI for every tool
- [x] Interactive UI messages
- [x] Playing state for chat messages
- [x] Replay chat messages
- [ ] Error handling
- [ ] RAG answers with text only (no UI)
  - [ ] For the same RAG call, enable the chatbot to choose if it should display a UI or a text message based on the context
- [ ] Proactive chatbot: resume the conversation on its own when some event gets triggered
- [x] Refactor chat display and persistence using `ai@4.1.*`: streamText now always generates one message, but it may contain multiple parts (when maxSteps > 1), like a tool call followed up by a text message. This needs to be handled both on the frontend and when persisting the chat.
- [ ] Fix message reproduction: sometimes previous messages get played while a new one is being generated
- [ ] Fix chat deletion from the chat page not redirecting to `/chats`
