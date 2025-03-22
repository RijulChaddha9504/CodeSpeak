import React from "react";
import { useState } from "react";
import ChangingText from "../components/ChangingText";
import SpeechInputButton from "../components/SpeechInputButton";
import CodeOutputGrid from "../components/CodeOutputGrid";
import TranscriptFeedback from "../components/TranscriptFeedback";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
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

const Homepage: React.FC = () => {

   const [userId, setUserId] = useState(0);

   const {
      text,
      startListening,
      stopListening,
      toggleListening,
      isListening,
      hasRecognitionSupport,
      cooldownActive,
   } = useSpeechRecognition();

   return (
      <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white px-4 pt-32 select-none">
         <div className="w-[40vw] max-w-full text-center mb-8">
            <ChangingText messages={messages} />
         </div>

         <div>
            {hasRecognitionSupport ? (
               <>
                  <SpeechInputButton
                     isListening={isListening}
                     toggleListening={toggleListening}
                     cooldownActive={cooldownActive}
                  />
                  <TranscriptFeedback speechInput={text} />
               </>
            ) : (
               <h1>Your browser has no speech recognition support</h1>
            )}
            <CodeOutputGrid
               codeMatrix={[
                  ["def is_prime(n):"],
                  ["i-if", "if n <= 1:"],
                  ["i-if", "return False"],
                  ["i-for", "for i in range(2, int(n**0.5) + 1):"],
                  ["i-for", "i-if", "if n % i == 0:"],
                  ["i-for", "i-if", "return False"],
                  ["return True"],
               ]}
            />
         </div>
      </div>
   );
};

export default Homepage;
