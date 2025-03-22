import React from "react";

interface SpeechInputButtonProps {
   isListening: boolean;
   toggleListening: () => void;
   cooldownActive: boolean;
}

const SpeechInputButton: React.FC<SpeechInputButtonProps> = ({
   isListening,
   toggleListening,
   cooldownActive,
}) => {
   const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLButtonElement).blur();
      toggleListening();
   };

   return (
      <button
         onClick={handleClick}
         disabled={cooldownActive}
         className={`${
            isListening ? "bg-red-600" : "bg-green-500"
         } hover:opacity-90 disabled:bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-lg transition-all focus:ring-4 focus:ring-yellow-400 mb-6`}
         aria-label="Toggle speech input"
      >
         {isListening
            ? "Stop Listening"
            : "Start Listening (Click or Press Space)"}
      </button>
   );
};

export default SpeechInputButton;
