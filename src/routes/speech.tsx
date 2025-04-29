import { createSignal, For } from "solid-js"
import AppTitle from "~/components/app-title"
import { useSpeech } from "~/lib/speech"
import { langs } from "~/lib/speech-languages"

const SpeechPage = () => {
  return (
    <div class="container md:max-w-2xl flex flex-col gap-6 py-16 mx-auto">
      <AppTitle>Speech</AppTitle>
      <h1 class="text-center text-2xl text-sky-700 uppercase mb-16">Solid Voice Chatbot</h1>
      <div class="grid sm:grid-cols-2 gap-4">
        <LanguageSelector />
        <VoiceSelector />
      </div>
      <TextToSpeech />
      <SpeechToText />
    </div>
  )
}

const LanguageSelector = () => {
  const { lang, setLang } = useSpeech()

  return (
    <div>
      <p class="mb-1 block text-sm font-medium text-gray-700">Language</p>
      <select
        onInput={(e) => setLang(e.currentTarget.value)}
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        <option value={undefined}>Default</option>
        <For each={langs}>
          {(variant) => (
            <option value={variant.value} selected={variant.value == lang()}>
              {variant.value} • {variant.name}
            </option>
          )}
        </For>
      </select>
    </div>
  )
}

const VoiceSelector = () => {
  const { synthesis } = useSpeech()

  return (
    <div>
      <p class="mb-1 block text-sm font-medium text-gray-700">Voice</p>
      <select
        onInput={(e) =>
          synthesis.setSelectedVoice(synthesis.voices()?.find((v) => v.name == e.target.value))
        }
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        <option value={undefined}>Default</option>
        <For each={synthesis.voices()}>
          {(voice) => (
            <option value={voice.name} selected={voice.name == synthesis.selectedVoice()?.name}>
              {voice.name} • {voice.lang}
            </option>
          )}
        </For>
      </select>
    </div>
  )
}

const TextToSpeech = () => {
  const { synthesis } = useSpeech()

  const [text, setText] = createSignal("")

  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Text to speech</h2>
      <div class="flex gap-3">
        <div class="grow">
          <label for="speech" class="mb-1 block text-sm font-medium text-gray-700">
            Text
          </label>
          <input
            value={text()}
            onInput={(e) => setText(e.target.value)}
            id="speech"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <button
          class="rounded-lg border border-sky-600 bg-sky-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-sky-200 disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-300 mt-auto"
          onClick={() => synthesis.speak(text())}
          disabled={synthesis.isSpeaking()}
        >
          Synthesize
        </button>
      </div>
    </div>
  )
}

const SpeechToText = () => {
  const { recognition } = useSpeech()

  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold">Speech to text</h2>
      <div class="w-full mb-2">
        <label for="speech" class="mb-1 block text-sm font-medium text-gray-700">
          Transcript
        </label>
        <input
          value={recognition.transcript()}
          type="text"
          placeholder="The transcript will appear here."
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          readOnly
          disabled={recognition.transcript() == ""}
        />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <button
          class="rounded-lg border border-sky-600 bg-sky-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-sky-200 disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-300"
          onClick={() => recognition.listen()}
          disabled={recognition.isListening()}
        >
          {recognition.isListening() ? "Listening..." : "Start"}
        </button>
        <button
          class="rounded-lg border border-sky-600 bg-sky-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-sky-200 disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-300"
          onClick={recognition.stopListening}
        >
          Stop
        </button>
        <button
          class="rounded-lg border border-sky-600 bg-sky-600 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-sky-700 hover:bg-sky-700 focus:ring focus:ring-sky-200 disabled:cursor-not-allowed disabled:border-sky-300 disabled:bg-sky-300"
          onClick={recognition.resetTranscript}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default SpeechPage
