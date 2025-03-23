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

   function setCode(str: string) {
      
   }

   return (
      <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white px-4 pt-32 select-none">
         <div className="w-[40vw] max-w-full text-center mb-8">
            <ChangingText messages={messages} />
         </div>
         
         <div>
            <SpeechPrompt onResolveCallback={setCode}></SpeechPrompt>
            <CodeOutputGrid
               codeMatrix={[
                  ["import numpy as np"],
                  ["arr = np.zeros((3, 3, 3, 3, 3, 3))"],
                  ["for i in range(3):"],
                  ["i-for", "for j in range(3):"],
                  ["i-for", "i-for", "for k in range(3):"],
                  ["i-for", "i-for", "i-for", "for l in range(3):"],
                  ["i-for", "i-for", "i-for", "i-for", "for m in range(3):"],
                  [
                     "i-for",
                     "i-for",
                     "i-for",
                     "i-for",
                     "i-for",
                     "for n in range(3):",
                  ],
                  [
                     "i-for",
                     "i-for",
                     "i-for",
                     "i-for",
                     "i-for",
                     "i-for",
                     "arr[i, j, k, l, m, n] = 0",
                  ],
               ]}
            />
         </div>
      </div>
   );
};

export default Homepage;
