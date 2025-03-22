import React, { useState } from "react";
import "./app.css";

// Fix: TypeScript does not recognize SpeechRecognition, so we define it manually.
const SpeechRecognition =
   (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface SpeechRecognitionEvent extends Event {
   results: SpeechRecognitionResultList;
}

const App: React.FC = () => {
   const [speechInput, setSpeechInput] = useState<string>("");
   const [codeOutput, setCodeOutput] = useState<string[]>([]);
   const [isListening, setIsListening] = useState<boolean>(false);

   // Speech-to-text function
   const startListening = () => {
      if (!SpeechRecognition) {
         alert("Speech Recognition is not supported in this browser.");
         return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
         setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
         const transcript = (event.results[0] as SpeechRecognitionResult)[0]
            .transcript;
         setSpeechInput(transcript);
         sendToBackend(transcript);
      };

      recognition.onerror = () => {
         setIsListening(false);
      };

      recognition.onend = () => {
         setIsListening(false);
      };

      recognition.start();
   };

   // Send text input to backend (for LLM processing)
   const sendToBackend = async (text: string) => {
      try {
         const response = await fetch("http://localhost:5000/generateCode", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: text }),
         });

         const data = await response.json();
         if (data.code) {
            setCodeOutput(data.code.split("\n")); // Splitting into lines for grid display
         }
      } catch (error) {
         console.error("Error fetching code:", error);
      }
   };

   return (
      <div className="container">
         <h1 className="title">Accessible AI Code Assistant</h1>
         <button
            className="record-btn"
            onClick={startListening}
            disabled={isListening}
         >
            {isListening ? "Listening..." : "Start Speaking"}
         </button>

         {speechInput && <p className="speech-text">You said: {speechInput}</p>}

         <div className="code-grid">
            {codeOutput.length > 0 ? (
               codeOutput.map((line, index) => (
                  <div key={index} className="code-block">
                     {line}
                  </div>
               ))
            ) : (
               <p className="placeholder">
                  Your generated code will appear here.
               </p>
            )}
         </div>
      </div>
   );
};

export default App;
