import {
  Accessor,
  createContext,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  ParentComponent,
  useContext,
} from "solid-js"
import { isServer } from "solid-js/web"

type Ctx = {
  lang: Accessor<string>
  setLang: (lang: string) => void
  synthesis: {
    speak: (text: string) => Promise<void>
    stopSpeaking: () => void
    isSpeaking: Accessor<boolean>
    // TODO: add voice selection capabilities
    isSupported: boolean
  }
  recognition: {
    listen: (options?: { continuous: boolean }) => Promise<string>
    stopListening: () => void
    transcript: Accessor<string>
    resetTranscript: () => void
    isListening: Accessor<boolean>
    isMicrophoneAvailable: Accessor<boolean>
    isSupported: boolean
  }
}

const SpeechCtx = createContext<Ctx>()

export const SpeechProvider: ParentComponent = (props) => {
  const [lang, setLang] = createSignal("en-US")

  // Synthesis

  const [isSpeaking, setIsSpeaking] = createSignal(false)

  const speak = (text: string) =>
    new Promise<void>((resolve, reject) => {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = lang()
      utter.onend = () => {
        setIsSpeaking(false)
        resolve()
      }
      utter.onerror = (e) => {
        setIsSpeaking(false)
        reject(e)
      }
      setIsSpeaking(true)
      window.speechSynthesis.speak(utter)
    })

  const stopSpeaking = () => window.speechSynthesis.cancel()

  // Recognition

  const SpeechRecognition =
    typeof window === "undefined"
      ? undefined
      : window.SpeechRecognition ??
        window.webkitSpeechRecognition ??
        (window as any).mozSpeechRecognition ??
        (window as any).msSpeechRecognition ??
        (window as any).oSpeechRecognition

  const recognition = SpeechRecognition ? new SpeechRecognition() : undefined

  const [transcript, setTranscript] = createSignal("")
  const resetTranscript = () => setTranscript("")
  const [isListening, setIsListening] = createSignal(false)

  const listen: Ctx["recognition"]["listen"] = (options = { continuous: true }) =>
    new Promise<string>((resolve, reject) => {
      if (!recognition) {
        reject(new Error("Speech Recognition not supported."))
        return
      }
      if (isListening()) {
        reject(new Error("Already listening."))
        return
      }
      if (!options.continuous) resetTranscript()
      recognition.lang = lang()
      recognition.continuous = options.continuous
      recognition.onresult = (e) => resolve(e.results[e.resultIndex]?.[0]?.transcript ?? "")
      recognition.onerror = (e) => reject(e)
      recognition.onend = () => setIsListening(false)
      setIsListening(true)
      recognition.start()
    })

  const stopListening = () => recognition?.stop()

  const [isMicrophoneAvailable, { refetch }] = createResource(async () => {
    if (isServer) return false
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      return true
    } catch {
      return false
    }
  })
  onMount(() => {
    navigator.mediaDevices.addEventListener("devicechange", refetch)
    onCleanup(() => navigator.mediaDevices.removeEventListener("devicechange", refetch))
  })

  return (
    <SpeechCtx.Provider
      value={{
        lang,
        setLang,
        synthesis: {
          speak,
          isSpeaking,
          stopSpeaking,
          isSupported: typeof window === "undefined" ? false : "speechSynthesis" in window,
        },
        recognition: {
          listen,
          stopListening,
          transcript,
          resetTranscript,
          isListening,
          isMicrophoneAvailable: () => isMicrophoneAvailable() === true,
          isSupported: !!SpeechRecognition,
        },
      }}
    >
      {props.children}
    </SpeechCtx.Provider>
  )
}

export const useSpeech = () => useContext(SpeechCtx)!
