import "../index.css";
import React, { useState, useEffect } from "react";

interface ChangingTextProps {
   messages: string[]; // List of rotating messages
   typingSpeed?: number; // Speed of typing (default: 100ms)
   deletingSpeed?: number; // Speed of deleting (default: 50ms)
   delay?: number; // Delay before deleting starts (default: 2000ms)
}

const ChangingText: React.FC<ChangingTextProps> = ({
   messages,
   typingSpeed = 100,
   deletingSpeed = 50,
   delay = 2000,
}) => {
   const [currentMessage, setCurrentMessage] = useState(messages[0]);
   const [displayedText, setDisplayedText] = useState("");
   const [typingIndex, setTypingIndex] = useState(0);
   const [deleting, setDeleting] = useState(false);

   useEffect(() => {
      let timeout: ReturnType<typeof setTimeout>;

      if (deleting) {
         // Delete text one letter at a time
         if (displayedText.length > 0) {
            timeout = setTimeout(() => {
               setDisplayedText(displayedText.slice(0, -1));
            }, deletingSpeed);
         } else {
            // Once deleted, switch message and start typing
            const nextMessage =
               messages[Math.floor(Math.random() * messages.length)];
            setCurrentMessage(nextMessage);
            setTypingIndex(0);
            setDeleting(false);
         }
      } else {
         // Type new message letter by letter
         if (typingIndex < currentMessage.length) {
            timeout = setTimeout(() => {
               setDisplayedText((prev) => prev + currentMessage[typingIndex]);
               setTypingIndex((prev) => prev + 1);
            }, typingSpeed);
         } else {
            // After completing typing, wait and then start deleting
            timeout = setTimeout(() => setDeleting(true), delay);
         }
      }

      return () => clearTimeout(timeout);
   }, [displayedText, typingIndex, deleting, currentMessage]);

   return (
      <h1 className="text-3xl font-bold text-yellow-400">
         {displayedText}
         <span className="animate-blink">|</span>
      </h1>
   );
};

export default ChangingText;
