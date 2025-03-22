import React, { useState, useRef, useEffect } from "react";
import { sendToBackend } from "../utils/api";
import ChangingText from "../components/ChangingText";
import SpeechInputButton from "../components/SpeechInputButton";
import CodeOutputGrid from "../components/CodeOutputGrid";
import TranscriptFeedback from "../components/TranscriptFeedback";
import { AudioControl } from "../utils/audioControl";

interface SpeechRecognitionEvent extends Event {
   results: SpeechRecognitionResultList;
}

const messages = [
   "Accessible AI Code Assistant",
   "Speech-Powered Coding",
   "AI-Assisted Code Generation",
   "Helping the Visually Impaired Code",
   "Transforming Voice into Code",
];

// const AC: AudioControl = AudioControl.instance();
// AC.loadAudio("async_sample_blob_0")

const Homepage: React.FC = () => {
   const [speechInput, setSpeechInput] = useState<string>("");
   const [codeOutput, setCodeOutput] = useState<string[]>([]);
   const [isListening, setIsListening] = useState<boolean>(false);
   const recognitionRef = useRef<any>(null);
   const transcriptRef = useRef<string>("");

   const startListening = () => {
      const SpeechRecognition =
         (window as any).SpeechRecognition ||
         (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
         alert("Speech Recognition is not supported in this browser.");
         return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = false;

      transcriptRef.current = "";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
         setIsListening(false);
         if (transcriptRef.current.trim()) {
            setSpeechInput(transcriptRef.current);
            handleBackendRequest(transcriptRef.current);
         }
      };
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: Event) => {
         const speechEvent = event as SpeechRecognitionEvent;
         const result = (
            speechEvent.results[
               speechEvent.results.length - 1
            ] as SpeechRecognitionResult
         )[0].transcript;
         transcriptRef.current += result + " ";
      };

      recognition.start();
   };

   const stopListening = () => {
      recognitionRef.current?.stop();
   };

   const handleBackendRequest = async (text: string) => {
      const generatedCode = await sendToBackend(text);
      setCodeOutput(generatedCode);
   };

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.code === "Space" && !isListening) {
            e.preventDefault();
            startListening();
         }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
         if (e.code === "Space") {
            stopListening();
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
         window.removeEventListener("keydown", handleKeyDown);
         window.removeEventListener("keyup", handleKeyUp);
      };
   }, [isListening]);

   useEffect(() => {
      const handleMouseUp = () => {
         if (isListening) stopListening();
      };

      window.addEventListener("mouseup", handleMouseUp);
      return () => window.removeEventListener("mouseup", handleMouseUp);
   }, [isListening]);

   return (
      <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white px-4 pt-32 select-none">
         <div className="w-[40vw] max-w-full text-center mb-8">
            <ChangingText messages={messages} />
         </div>

         <SpeechInputButton
            isListening={isListening}
            startListening={startListening}
         />

         <TranscriptFeedback speechInput={speechInput} />

         <CodeOutputGrid codeOutput={codeOutput} />
      </div>
   );
};

export default Homepage;
