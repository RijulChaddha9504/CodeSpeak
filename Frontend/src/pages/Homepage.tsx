
import React, { useState, useEffect } from "react";
import "./app.css";

// Fix: TypeScript does not recognize SpeechRecognition, so we define it manually.
const SpeechRecognition =
   (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

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
   const [currentMessage, setCurrentMessage] = useState(messages[0]);
   const [isFading, setIsFading] = useState(false);
   const [scrollProgress, setScrollProgress] = useState(0);

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

   // Making a cycling text animation in the changingDescription text box
   useEffect(() => {
      const interval = setInterval(() => {
         setIsFading(true); // Start fade-out animation
         setTimeout(() => {
            // Change message after fade-out
            setCurrentMessage(
               messages[Math.floor(Math.random() * messages.length)]
            );
            setIsFading(false); // Start fade-in animation
         }, 1000); // Wait for fade-out animation before changing text
      }, 4000); // Change text every 4 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
   }, []);

   useEffect(() => {
      const handleScroll = () => {
         const scrollTop = document.documentElement.scrollTop;
         const scrollHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
         const progress = (scrollTop / scrollHeight) * 100;
         setScrollProgress(progress);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <div className="container">
         {/* Custom Scroll Progress Bar */}
         <div className="scroll-progress">
            <div
               className="scroll-progress-bar"
               style={{ width: `${scrollProgress}%` }}
            ></div>
         </div>

         {/* Page Content */}
         <div className="changingDescriptionContainer">
            <h1
               className={`changingDescription ${
                  isFading ? "fade-out" : "fade-in"
               }`}
            >
               {currentMessage}
            </h1>
         </div>
         <button
            className="record-btn"
            onClick={startListening}
            disabled={isListening}
            aria-label="Start speech recognition"
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
         {/* TODO: REMOVE THIS */}
         {/* These mindless newlines are for testing the scroll bar */}
         <p>
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
            d <br />
         </p>
      </div>
   );
};

export default Homepage;
