import React from "react";
import { useState } from "react";
import ChangingText from "../components/ChangingText";
import CodeOutputGrid from "../components/CodeOutputGrid";
import SpeechPrompt from "../components/SpeechPrompt";


const messages = [
   "Accessible AI Code Assistant",
   "Speech-Powered Coding",
   "AI-Assisted Code Generation",
   "Helping the Visually Impaired Code",
   "Transforming Voice into Code",
];

const Homepage: React.FC = () => {

   const [userId, setUserId] = useState(0);



   return (
      <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white px-4 pt-32 select-none">
         <div className="w-[40vw] max-w-full text-center mb-8">
            <ChangingText messages={messages} />
         </div>

         <div>
            <SpeechPrompt></SpeechPrompt>
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
