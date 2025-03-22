import React from "react";

interface CodeOutputGridProps {
   codeOutput: string[];
}

const CodeOutputGrid: React.FC<CodeOutputGridProps> = ({ codeOutput }) => {
   return (
      <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg shadow-lg text-yellow-400 font-mono text-lg whitespace-pre-wrap">
         {codeOutput.length > 0 ? (
            codeOutput.map((line, index) => <div key={index}>{line}</div>)
         ) : (
            <p className="text-gray-500">
               Your generated code will appear here.
            </p>
         )}
      </div>
   );
};

export default CodeOutputGrid;
