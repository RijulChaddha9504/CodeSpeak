import "../index.css";
import React, { useState, useEffect } from "react";

interface ChangingTextProps {
   messages: string[];
   typingSpeed?: number;
   deletingSpeed?: number;
   delay?: number; // How long the blinking phase lasts (ms)
}

const ChangingText: React.FC<ChangingTextProps> = ({
   messages,
   typingSpeed = 100,
   deletingSpeed = 50,
   delay = 3000, // 3 seconds of blinking
}) => {
   const [currentMessage, setCurrentMessage] = useState(messages[0]);
   const [displayedText, setDisplayedText] = useState("");
   const [typingIndex, setTypingIndex] = useState(0);
   const [deleting, setDeleting] = useState(false);
   const [blinkingPause, setBlinkingPause] = useState(false);
   const [showCursor, setShowCursor] = useState(true); // NEW

   useEffect(() => {
      let timeout: ReturnType<typeof setTimeout>;

      // Handle typing/deleting logic
      if (blinkingPause) {
         // Cursor blinking logic (manual blink)
         const blinkInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
         }, 500); // blink every 500ms

         // After delay ends, move on to deleting
         timeout = setTimeout(() => {
            clearInterval(blinkInterval);
            setShowCursor(true);
            setBlinkingPause(false);
            setDeleting(true);
         }, delay);

         return () => {
            clearInterval(blinkInterval);
            clearTimeout(timeout);
         };
      } else if (deleting) {
         if (displayedText.length > 0) {
            timeout = setTimeout(() => {
               setDisplayedText(displayedText.slice(0, -1));
            }, deletingSpeed);
         } else {
            let nextMessage = currentMessage;
            while (nextMessage === currentMessage && messages.length > 1) {
               nextMessage =
                  messages[Math.floor(Math.random() * messages.length)];
            }
            setCurrentMessage(nextMessage);
            setTypingIndex(0);
            setDeleting(false);
         }
      } else {
         if (typingIndex < currentMessage.length) {
            timeout = setTimeout(() => {
               setDisplayedText((prev) => prev + currentMessage[typingIndex]);
               setTypingIndex((prev) => prev + 1);
            }, typingSpeed);
         } else {
            setBlinkingPause(true);
         }
      }

      return () => clearTimeout(timeout);
   }, [displayedText, typingIndex, deleting, blinkingPause, currentMessage]);

   return (
      <h1 className="text-3xl font-bold text-yellow-400">
         {displayedText}
         <span
            className="inline-block w-[1ch] transition-opacity duration-200"
            style={{ opacity: showCursor ? 1 : 0 }}
         >
            |
         </span>
      </h1>
   );
};

export default ChangingText;
