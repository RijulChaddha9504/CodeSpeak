import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingOverlay() {

  const messages = ['Generating...', 'Loading...', 'Coding...'];

  const [currentMessage, setCurrentMessage] = useState(messages[0]); 
  const [opacity, setOpacity] = useState(1);
  const prevMessageIdx = useRef(0);  

  useEffect(() => { 
    const intervalId = setInterval(() => { 
      setOpacity(0); 
      setTimeout(() => { 
        let newIdx;
        do {
          newIdx = Math.floor(Math.random() * messages.length);
        } while (prevMessageIdx.current === newIdx);
        prevMessageIdx.current = newIdx; 
        // console.log(newIdx); 
        setCurrentMessage(messages[newIdx]); 
        setOpacity(1); 
      }, 500); 
    }, 1500); 

    return () => clearInterval(intervalId); 
  }); 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
      <div className="rounded-lg bg-indigo-500 p-12 shadow-xl flex flex-col items-center justify-center w-64 h-64">
        <Loader2 className="h-16 w-16 animate-spin text-white-700" />
        <span className="mt-6 text-white-700 font-medium text-xl"
              style={{ transition: 'opacity 0.5s ease-in-out', opacity }}>{currentMessage}</span>
      </div>
    </div>
  );
}