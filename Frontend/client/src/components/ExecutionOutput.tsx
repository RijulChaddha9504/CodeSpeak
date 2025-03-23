import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { useCompleted } from '../context/CompletedContext';

function ExecutionOutput() {
  const [output, setOutput] = useState(""); 

  const { completed, setCompleted, clearComplete, setClearComplete } = useCompleted(); 
  useEffect(() => { 
    const fetchCode = async () => {
      const code = await apiClient.getCompiledCode(); 
      console.log(code.output); 
      setOutput(code.output);
      setClearComplete(false);
    }
    fetchCode();
  }, [completed, clearComplete]); 

  return (<div className="bg-gray-100 flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-800 text-white px-4 py-2">
          <h2 className="text-lg font-semibold">Code output</h2>
        </div>
      <pre className="bg-gray-50 p-4 overflow-x-auto">
        <code className="text-sm font-mono text-gray-800">
            {output}
        </code>
      </pre>
      </div>
    </div>); 
}

export default ExecutionOutput; 