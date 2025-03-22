import React, { useState, useRef, useEffect } from "react";
import { sendToBackend } from "../utils/api";
import ChangingText from "../components/ChangingText";

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
      recognition.continuous = true; // 🔥 Keep listening beyond one sentence
      recognition.interimResults = false;

      transcriptRef.current = ""; // Clear previous session transcript

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
         setIsListening(false);
         // Final backend call with the collected transcript
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

   // Spacebar hold to speak
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

   // Mouse hold to speak — listen globally for mouseup
   useEffect(() => {
      const handleMouseUp = () => {
         if (isListening) stopListening();
      };

      window.addEventListener("mouseup", handleMouseUp);
      return () => window.removeEventListener("mouseup", handleMouseUp);
   }, [isListening]);

   return (
      <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white px-4 pt-32 select-none">
         {/* Animated Changing Text */}
         <div className="w-[40vw] max-w-full text-center mb-8">
            <ChangingText messages={messages} />
         </div>

         {/* Speech Input Button */}
         <button
            onMouseDown={(e) => {
               e.preventDefault(); // prevent focus
               if (!isListening) startListening();
            }}
            disabled={isListening}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-lg transition-all focus:ring-4 focus:ring-yellow-400 mb-6"
            aria-label="Hold to speak or press space"
         >
            {isListening ? "Listening..." : "Hold to Speak (or Press Space)"}
         </button>

         {/* User's Spoken Text */}
         {speechInput && (
            <p className="text-lg text-blue-300 mb-6">
               You said: {speechInput}
            </p>
         )}

         {/* Code Output Box */}
         <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg shadow-lg text-yellow-400 font-mono text-lg whitespace-pre-wrap">
            {codeOutput.length > 0 ? (
               codeOutput.map((line, index) => <div key={index}>{line}</div>)
            ) : (
               <p className="text-gray-500">
                  Your generated code will appear here.
               </p>
            )}
         </div>
      </div>
   );
};

export default Homepage;
