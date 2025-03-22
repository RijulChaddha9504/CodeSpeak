import React from "react";

interface TranscriptFeedbackProps {
   speechInput: string;
}

const TranscriptFeedback: React.FC<TranscriptFeedbackProps> = ({
   speechInput,
}) => {
   if (!speechInput) return null;

   return <p className="text-lg text-blue-300 mb-6">You said: {speechInput}</p>;
};

export default TranscriptFeedback;
