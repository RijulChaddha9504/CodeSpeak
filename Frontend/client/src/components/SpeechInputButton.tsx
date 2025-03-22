import React from "react";

interface SpeechInputButtonProps {
   isListening: boolean;
   startListening: () => void;
}

const SpeechInputButton: React.FC<SpeechInputButtonProps> = ({
   isListening,
   startListening,
}) => {
   const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isListening) startListening();
   };

   return (
      <button
         onMouseDown={handleMouseDown}
         disabled={isListening}
         className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-lg transition-all focus:ring-4 focus:ring-yellow-400 mb-6"
         aria-label="Hold to speak or press space"
      >
         {isListening ? "Listening..." : "Hold to Speak (or Press Space)"}
      </button>
   );
};

export default SpeechInputButton;
