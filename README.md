# solid-voice-chatbot

A fully-featured chatbot made with SolidJS and the Vercel AI SDK.

## Getting started

- Clone this repo
- `cp .env.example .env`, then place your OpenAI API key in `.env`
- Install dependencies with `pnpm i`
- Run the dev server with `pnpm dev`

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
- [ ] Playing state for chat messages
- [ ] Replay chat messages
- [ ] Error handling
- [ ] Answers with both UI and text
- [ ] RAG answers with text only (no UI)
  - [ ] For the same RAG call, enable the chatbot to choose if it should display a UI or a text message based on the context
- [ ] Proactive chatbot: resume the conversation on its own when some event gets triggered
