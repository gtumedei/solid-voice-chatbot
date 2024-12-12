import { createEffect, createResource, createSignal, on, onCleanup, onMount } from "solid-js"
import { isServer } from "solid-js/web"
import { create } from "~/lib/context"

export const [SpeechProvider, useSpeech] = create(() => {
  const [lang, setLang] = createSignal("en-US")

  // Synthesis

  const [isSpeaking, setIsSpeaking] = createSignal(false)

  const speak = (text: string) =>
    new Promise<void>((resolve, reject) => {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = lang()
      utter.voice = selectedVoice() ?? null
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

  const [voices, setVoices] = createSignal<SpeechSynthesisVoice[]>([])
  const refreshVoices = () => {
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang == lang())
    setVoices(voices)
    return voices
  }
  onMount(() => {
    speechSynthesis.onvoiceschanged = refreshVoices
    onCleanup(() => (speechSynthesis.onvoiceschanged = null))
  })
  // Refresh voices when the language changes
  createEffect(
    on(lang, () => {
      const newVoices = refreshVoices()
      if (selectedVoice() && !newVoices?.find((v) => v.name == selectedVoice()?.name)) {
        setSelectedVoice(newVoices?.[0])
      }
    })
  )

  const [selectedVoice, setSelectedVoice] = createSignal<SpeechSynthesisVoice | null>()

  const isSpeechSynthesisSupported =
    typeof window === "undefined" ? false : "speechSynthesis" in window

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

  const listen = (options = { continuous: true }) =>
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

  const [isMicrophoneAvailable, { refetch: refreshMicrophone }] = createResource(async () => {
    if (isServer) return false
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      return true
    } catch {
      return false
    }
  })
  onMount(() => {
    navigator.mediaDevices.addEventListener("devicechange", refreshMicrophone)
    onCleanup(() => navigator.mediaDevices.removeEventListener("devicechange", refreshMicrophone))
  })

  const isSpeechRecognitionSupported = !!SpeechRecognition

  return {
    lang,
    setLang,
    synthesis: {
      speak,
      isSpeaking,
      stopSpeaking,
      voices,
      selectedVoice,
      setSelectedVoice,
      isSupported: isSpeechSynthesisSupported,
    },
    recognition: {
      listen,
      stopListening,
      transcript,
      resetTranscript,
      isListening,
      isMicrophoneAvailable: () => isMicrophoneAvailable() === true,
      isSupported: isSpeechRecognitionSupported,
    },
  }
})
