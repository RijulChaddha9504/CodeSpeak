import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import React from "react";

const SpeechPrompt = () => {

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-neutral-700 rounded-xl shadow-md flex flex-col items-center gap-4">
      <div className="flex w-full items-center flex-row justify-between gap-4">
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${listening ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          Microphone: {listening ? 'On' : 'Off'}
        </span>

        <div className="flex flex-row justify-center gap-4 w-80 h-full">
          <button
            className=" h-full w-40 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={SpeechRecognition.startListening}
          >
            Start
          </button>

          <button
            className="w-40 px-2 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            onClick={SpeechRecognition.stopListening}
          >
            Stop
          </button>
        </div>
        

        
      </div>
      <div className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 text-sm min-h-[60px]">
        {transcript || <span className="text-gray-400">Transcript will appear here...</span>}
      </div>
    </div>
  );

}

export default SpeechPrompt