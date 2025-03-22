import React, { useState } from "react";
import { sendToBackend } from "../utils/api";
import ChangingText from "../components/ChangingText";

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

   const startListening = () => {
      const SpeechRecognition =
         (window as any).SpeechRecognition ||
         (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
         alert("Speech Recognition is not supported in this browser.");
         return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: Event) => {
         const speechEvent = event as SpeechRecognitionEvent;
         const transcript = (
            speechEvent.results[0] as SpeechRecognitionResult
         )[0].transcript;
         setSpeechInput(transcript);
         handleBackendRequest(transcript);
      };

      recognition.start();
   };

   const handleBackendRequest = async (text: string) => {
      const generatedCode = await sendToBackend(text);
      setCodeOutput(generatedCode);
   };

   return (
      <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white px-4 pt-32">
         {/* Animated Changing Text */}
         <div className="w-[40vw] max-w-full text-center mb-8">
            <ChangingText messages={messages} />
         </div>

         {/* Speech Input Button */}
         <button
            onClick={startListening}
            disabled={isListening}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-lg transition-all focus:ring-4 focus:ring-yellow-400 mb-6"
            aria-label="Start speech recognition"
         >
            {isListening ? "Listening..." : "Start Speaking"}
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
