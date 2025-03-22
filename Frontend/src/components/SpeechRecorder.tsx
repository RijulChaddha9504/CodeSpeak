import React, { useEffect, useRef, useState } from 'react';

const SpeechRecorder: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = '';
      console.log("ran")
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (e) => {
      console.error('Speech recognition error', e);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setTranscript('');
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!recognitionRef.current || !isRecording) return;
    recognitionRef.current.stop();
    setIsRecording(false);
    console.log("ended")
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <div
        style={{
          border: '1px solid gray',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '100px',
          marginBottom: '1rem',
          backgroundColor: isRecording ? '#f0fff0' : '#f8f8f8',
        }}
      >
        {transcript || 'Your speech will appear here...'}
      </div>
      <button onClick={startRecording} disabled={isRecording} style={{ marginRight: '1rem' }}>
        Start
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>
    </div>
  );
};

export default SpeechRecorder;