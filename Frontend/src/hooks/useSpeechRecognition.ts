import { useState, useEffect, useRef } from "react";
import { sendToBackend } from "../utils/api";

interface SpeechRecognitionEvent extends Event {
   results: SpeechRecognitionResultList;
}

const getRecognition = () => {
   const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

   if (!SpeechRecognition) return null;

   const instance = new SpeechRecognition();
   instance.continuous = true;
   instance.lang = "en-US";
   instance.interimResults = false;
   return instance;
};

const useSpeechRecognition = () => {
   const [text, setText] = useState<string>("");
   const [isListening, setIsListening] = useState<boolean>(false);
   const [cooldownActive, setCooldownActive] = useState<boolean>(false);
   const [codeOutput, setCodeOutput] = useState<string[]>([]);
   const recognitionRef = useRef<any>(null);
   const transcriptRef = useRef<string>("");

   useEffect(() => {
      recognitionRef.current = getRecognition();

      if (!recognitionRef.current) return;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
         console.log("SpeechRecognitionEvent:", event);
         if (event.results.length > 0) {
            const result = (
               event.results[
                  event.results.length - 1
               ] as SpeechRecognitionResult
            )[0].transcript;
            transcriptRef.current += result + " ";
         }
      };

      recognitionRef.current.onend = () => {
         setIsListening(false);
         setCooldownActive(true);
         setTimeout(() => setCooldownActive(false), 2000); // 2-second cooldown
         const finalTranscript = transcriptRef.current.trim();
         if (finalTranscript) {
            setText(finalTranscript);
            handleBackendRequest(finalTranscript);
         }
      };

      recognitionRef.current.onerror = () => {
         setIsListening(false);
      };
   }, []);

   const handleBackendRequest = async (input: string) => {
      const generatedCode = await sendToBackend(input);
      setCodeOutput(generatedCode);
   };

   const startListening = () => {
      if (cooldownActive || isListening || !recognitionRef.current) return;
      setText("");
      transcriptRef.current = "";
      setIsListening(true);
      recognitionRef.current.start();
   };

   const stopListening = () => {
      if (!isListening || !recognitionRef.current) return;
      recognitionRef.current.stop();
      setIsListening(false);
   };

   const toggleListening = () => {
      if (cooldownActive) return;
      isListening ? stopListening() : startListening();
   };

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.code === "Space") {
            e.preventDefault();
            toggleListening();
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isListening, cooldownActive]);

   return {
      text,
      codeOutput,
      isListening,
      startListening,
      stopListening,
      toggleListening,
      hasRecognitionSupport: !!recognitionRef.current,
      cooldownActive,
   };
};

export default useSpeechRecognition;
