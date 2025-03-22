// NOTE: This code was taken from Gael Beltran on Youtube

import { useState, useEffect, useRef } from "react";

const getRecognition = () => {
   const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

   if (!SpeechRecognition) return null;

   const instance = new SpeechRecognition();
   instance.continuous = true;
   instance.lang = "en-US";
   return instance;
};

const useSpeechRecognition = () => {
   const [text, setText] = useState<string>("");
   const [isListening, setIsListening] = useState<boolean>(false);
   const [cooldownActive, setCooldownActive] = useState<boolean>(false);
   const recognitionRef = useRef<any>(null);

   useEffect(() => {
      recognitionRef.current = getRecognition();

      if (!recognitionRef.current) return;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
         console.log("onresult event: ", event);
         if (event.results.length > 0) {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
         }
         stopListening(); // End recording automatically after receiving input
      };
   }, []);

   const startListening = () => {
      if (cooldownActive || isListening || !recognitionRef.current) return;
      setText("");
      setIsListening(true);
      recognitionRef.current.start();
   };

   const stopListening = () => {
      if (!isListening || !recognitionRef.current) return;
      recognitionRef.current.stop();
      setIsListening(false);

      setCooldownActive(true);
      setTimeout(() => setCooldownActive(false), 2000);
   };

   const toggleListening = () => {
      if (cooldownActive) return;
      isListening ? stopListening() : startListening();
   };

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.code === "Space") {
            e.preventDefault();
            toggleListening();
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isListening, cooldownActive]);

   return {
      text,
      isListening,
      startListening,
      stopListening,
      toggleListening,
      hasRecognitionSupport: !!recognitionRef.current,
      cooldownActive,
   };
};

export default useSpeechRecognition;

// import { useState, useRef, useEffect } from "react";
// import { sendToBackend } from "../utils/api";

// interface SpeechRecognitionEvent extends Event {
//    results: SpeechRecognitionResultList;
// }

// export const useSpeechRecognition = () => {
//    const [speechInput, setSpeechInput] = useState<string>("");
//    const [codeOutput, setCodeOutput] = useState<string[]>([]);
//    const [isListening, setIsListening] = useState<boolean>(false);
//    const [cooldownActive, setCooldownActive] = useState<boolean>(false);
//    const recognitionRef = useRef<any>(null);
//    const transcriptRef = useRef<string>("");

//    const startListening = () => {
//       if (cooldownActive || isListening) return;

//       const SpeechRecognition =
//          (window as any).SpeechRecognition ||
//          (window as any).webkitSpeechRecognition;

//       if (!SpeechRecognition) {
//          alert("Speech Recognition is not supported in this browser.");
//          return;
//       }

//       const recognition = new SpeechRecognition();
//       recognitionRef.current = recognition;

//       recognition.lang = "en-US";
//       recognition.continuous = true;
//       recognition.interimResults = false;

//       transcriptRef.current = "";

//       recognition.onstart = () => setIsListening(true);
//       recognition.onend = () => {
//          setIsListening(false);
//          setCooldownActive(true);
//          setTimeout(() => setCooldownActive(false), 2000); // 2-second cooldown
//          if (transcriptRef.current.trim()) {
//             setSpeechInput(transcriptRef.current);
//             handleBackendRequest(transcriptRef.current);
//          }
//       };
//       recognition.onerror = () => setIsListening(false);

//       recognition.onresult = (event: Event) => {
//          const speechEvent = event as SpeechRecognitionEvent;
//          console.log("SpeechRecognitionEvent:", speechEvent);
//          const result = (
//             speechEvent.results[
//                speechEvent.results.length - 1
//             ] as SpeechRecognitionResult
//          )[0].transcript;
//          transcriptRef.current += result + " ";
//       };

//       recognition.start();
//    };

//    const stopListening = () => {
//       recognitionRef.current?.stop();
//    };

//    const toggleListening = () => {
//       if (isListening) {
//          stopListening();
//       } else {
//          startListening();
//       }
//    };

//    const handleBackendRequest = async (text: string) => {
//       const generatedCode = await sendToBackend(text);
//       setCodeOutput(generatedCode);
//    };

//    useEffect(() => {
//       const handleKeyDown = (e: KeyboardEvent) => {
//          if (e.code === "Space") {
//             e.preventDefault();
//             toggleListening();
//          }
//       };

//       window.addEventListener("keydown", handleKeyDown);
//       return () => window.removeEventListener("keydown", handleKeyDown);
//    }, [isListening, cooldownActive]);

//    return {
//       speechInput,
//       codeOutput,
//       isListening,
//       cooldownActive,
//       toggleListening,
//    };
// };
