import React, { useEffect, useState } from "react";
import apiClient from "../utils/api";
import { useCompleted } from "../context/CompletedContext.jsx";
import { LoadingOverlay } from "./LoadingOverlay.js";

interface GridEditorProps {
   codeMatrix: string[][];
}

const colorPalettes: Record<string, string> = {
   "i-if": "bg-yellow-400 text-black",
   "i-elif": "bg-yellow-300 text-black",
   "i-else:": "bg-orange-300 text-black",
   "i-for": "bg-lime-400 text-black",
   "i-while": "bg-green-400 text-black",
   "i-try:": "bg-pink-300 text-black",
   "i-except": "bg-pink-400 text-black",
   "i-finally:": "bg-orange-400 text-black",
   "i-def": "bg-violet-300 text-black",
   "i-class": "bg-rose-300 text-black",
   "i-with": "bg-cyan-300 text-black",
   "i-async": "bg-teal-300 text-black",
   "i-match": "bg-red-300 text-black",
   "i-case": "bg-amber-300 text-black",
};

const GridEditor: React.FC<GridEditorProps> = ({ codeMatrix }) => {
   const [matrix, setMatrix] = useState<string[][]>(codeMatrix);
   const [maxDepth, setMaxDepth] = useState(Math.max(...(matrix.map((row) => row.length))));
   const [activeCell, setActiveCell] = useState<{
      content: string;
      line: number;
      col: number;
      editable: boolean;
   } | null>(null);

   const [isEditing, setIsEditing] = useState(false);
   const [draftContent, setDraftContent] = useState("");

   const {completed, setCompleted, isLoading, setIsLoading} = useCompleted(); 

   const lowerTrimmed = (str: string) => str.toLowerCase().trim();

   const filteredMatrix = matrix.filter(
      (row) =>
         !row.some((cell) =>
            ["#codespeak - script begins", "#codespeak - script ends"].includes(
               lowerTrimmed(cell)
            )
         )
   );

   useEffect(() => { 
      if (completed) { 
         setCompleted(false); 
         const result = apiClient.fetchCodeMatrix();
         result.then((e) => {
            const newMatrix = e.parsed_code; 
            console.log("New Matrix: ", newMatrix); 
            setMatrix(newMatrix); 
            setMaxDepth(Math.max(...(newMatrix.map((row) => row.length)))); 
         }).catch((e) => e)
         setIsLoading(false); 
      }
   }, [completed]);

   const addNewRow = (rowIndex) => {
      const resultMatrix: string[][] = [];
      for (let i = 0; i < rowIndex; i++) {
         resultMatrix.push(matrix[i])
      }

      resultMatrix.push(["# empty line"])
      for (let i = rowIndex; i < matrix.length; i++) {
         resultMatrix.push(matrix[i])
      }
      const updateRes = apiClient.updateCode(resultMatrix);
      updateRes.then((e) => {
         const result = apiClient.fetchCodeMatrix();
         result.then((e) => {setMatrix(e.parsed_code)}).catch((e) => e)
      }).catch(e => e)
   }

   const deleteRow = (rowIndex) => {
      const resultMatrix = [...matrix]
      resultMatrix.splice(rowIndex, 1)
      const updateRes = apiClient.updateCode(resultMatrix);
      updateRes.then((e) => {
         const result = apiClient.fetchCodeMatrix();
         result.then((e) => {setMatrix(e.parsed_code)}).catch((e) => e)
      }).catch(e => e)
   }

   const getFontSizeClass = (content: string) => {
      const length = content.length;
      if (length <= 20) return "text-7xl";
      if (length <= 40) return "text-5xl";
      if (length <= 60) return "text-4xl";
      return "text-3xl";
   };

   return (
      
      <div className="mt-3 mb-3 relative w-full h-full">
         {isLoading && <LoadingOverlay />}
         {/* Popout Overlay */}
         {activeCell && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
               <div className="bg-white border-4 border-black shadow-2xl rounded-3xl p-16 w-[90vw] max-w-[1200px] max-h-[90vh]">
                  <div className="flex justify-end space-x-4 mb-6">
                     {isEditing ? (
                        <>
                           {/* Save (✔ on left) */}
                           <button
                              onClick={() => {
                                 // setMatrix((prev) => {
                                 //    const newMatrix = [...prev];
                                 //    const rowIndex = activeCell.line - 1;
                                 //    const colIndex = activeCell.col;
                                 //    newMatrix[rowIndex] = [
                                 //       ...newMatrix[rowIndex],
                                 //    ];
                                 //    newMatrix[rowIndex][colIndex] =
                                 //       draftContent;
                                 //    return newMatrix;
                                 // });
                                 const prevMat = matrix;
                                 const newMatrix = [...prevMat];
                                 const rowIndex = activeCell.line - 1;
                                 const colIndex = activeCell.col;
                                 newMatrix[rowIndex] = [
                                    ...newMatrix[rowIndex],
                                 ];
                                 newMatrix[rowIndex][colIndex] = draftContent;
                                 const updateRes = apiClient.updateCode(newMatrix);
                                 updateRes.then((e) => {
                                    const result = apiClient.fetchCodeMatrix();
                                    result.then((e) => {setMatrix(e.parsed_code)}).catch((e) => e)
                                 }).catch(e => e)
                                 
                                 
                                 setIsEditing(false);
                                 setActiveCell(null);
                              }}
                              className="text-black font-bold text-4xl px-6 py-2 rounded hover:bg-green-100"
                              title="Save"
                           >
                              ✔
                           </button>
                           {/* Cancel (✕ on right) */}
                           <button
                              onClick={() => {
                                 setIsEditing(false);
                                 setDraftContent("");
                              }}
                              className="text-black font-bold text-4xl px-6 py-2 rounded hover:bg-red-100"
                              title="Cancel"
                           >
                              ✕
                           </button>
                        </>
                     ) : (
                        <>
                           {activeCell.editable && (
                              <button
                                 onClick={() => {
                                    setIsEditing(true);
                                    setDraftContent(activeCell.content);
                                 }}
                                 className="text-black font-bold text-3xl px-4 py-2 rounded hover:bg-gray-100"
                                 title="Edit"
                              >
                                 ✏️
                              </button>
                           )}
                           <button
                              onClick={() => setActiveCell(null)}
                              className="text-black font-bold text-4xl px-6 py-2 rounded hover:bg-gray-200"
                              title="Close"
                           >
                              ✕
                           </button>
                        </>
                     )}
                  </div>

                  {isEditing ? (
                     <textarea
                        className={`w-full h-48 border-2 border-black rounded-xl font-mono resize-none px-4 py-2 bg-white text-black ${getFontSizeClass(
                           draftContent
                        )}`}
                        value={draftContent}
                        onChange={(e) => setDraftContent(e.target.value)}
                        autoFocus
                     />
                  ) : (
                     <div
                        className={`text-black font-mono mb-10 whitespace-pre-wrap ${getFontSizeClass(
                           activeCell.content
                        )}`}
                     >
                        {activeCell.content}
                     </div>
                  )}

                  <div className="text-2xl text-gray-500 font-bold mt-4">
                     Line {activeCell.line}
                  </div>
               </div>
            </div>
         )}
         
         <div className="flex w-full items-center justify-center gap-4">
         <button className="flex w-40 px-2 py-2 bg-red-500 justify-center items-center text-white rounded-lg hover:bg-gray-600 transition mb-2" 
                  onClick={() => {setMatrix([[]]); apiClient.setCode("");}}>Clear Code</button>
         </div>
         <table className="border-separate border-spacing-0 w-full">
            <tbody>
               {/* Script Start */}
               <tr>
                  <td
                     colSpan={maxDepth + 2}
                     className="h-16 border-2 border-black bg-indigo-200 text-black font-mono text-base font-bold px-4 rounded-2xl"
                  >
                     # CodeSpeak - Script Begins
                  </td>
               </tr>

               {filteredMatrix.map((row, rowIndex) => {
                  const isFirstRow = rowIndex === 0;
                  const isLastRow = rowIndex === filteredMatrix.length - 1;
                  const cells: React.JSX.Element[] = [];

                  cells.push(
                     <td
                        key={`line-${rowIndex}`}
                        className={[
                           "w-16 h-16 border-1 border-black bg-gray-300 text-black text-center font-bold",
                           isFirstRow ? "rounded-tl-2xl" : "",
                           isLastRow ? "rounded-bl-2xl" : "",
                        ]
                           .filter(Boolean)
                           .join(" ")}
                     >
                        <div className="w-full h-full flex items-center justify-center">
                           {rowIndex + 1}
                        </div>
                     </td>
                  );

                  row.forEach((cellContent, colIndex) => {
                     const baseClasses =
                        "w-48 h-16 border-1 border-black transition-colors duration-200 ease-in-out cursor-pointer hover:brightness-90";
                     const isOnlyCell = matrix.length === 1 && maxDepth === 1;
                     const cornerClass = isOnlyCell ? "rounded-2xl" : "";

                     const isInstruction = cellContent.startsWith("i-");
                     const cleanContent = isInstruction
                        ? cellContent.replace("i-", "within ")
                        : cellContent;

                     const openPopup = () => {
                        setActiveCell({
                           content: cleanContent,
                           line: rowIndex + 1,
                           col: colIndex,
                           editable: !isInstruction,
                        });
                        setIsEditing(false);
                     };

                     if (isInstruction) {
                        const style =
                           colorPalettes[cellContent] ||
                           "bg-gray-200 text-black";
                        cells.push(
                           <td
                              key={colIndex}
                              onClick={openPopup}
                              className={`${baseClasses} ${style} text-base font-bold text-center align-middle ${cornerClass}`}
                           >
                              {cleanContent}
                           </td>
                        );
                     } else if (colIndex === row.length - 1) {
                        cells.push(
                           <td
                              key={colIndex}
                              colSpan={maxDepth - colIndex}
                              onClick={openPopup}
                              className={`${baseClasses} bg-white text-black font-mono text-base font-bold align-middle px-4 ${cornerClass}`}
                           >
                              {cleanContent}
                           </td>
                        );
                     } else {
                        cells.push(
                           <td
                              key={colIndex}
                              className="w-48 h-16 border-1 border-black bg-gray-200"
                           />
                        );
                     }
                  });

                  const addBlockClass = [
                     "w-48 h-16 border-1 border-black bg-gray-300 overflow-hidden flex flex-row align-middle justify center",
                     isFirstRow ? "rounded-tr-2xl" : "",
                     isLastRow ? "rounded-br-2xl" : "",
                  ]
                     .filter(Boolean)
                     .join(" ");

                  cells.push(
                     <td key={`add-${rowIndex}`} className={addBlockClass}>
                        {/* <div className="w-50/100 h-full text-center text-black p-2 flex justify-center align-middle">
                           <button onClick={() => addNewRow(rowIndex)} className="w-full bg-green-600 rounded-2xl">
                              Add
                           </button>
                        </div>
                        <div className="w-50/100 h-full text-center text-black p-2 flex justify-center align-middle">
                           <button onClick={()=> {console.log("dete"); deleteRow(rowIndex)}} className="w-full bg-red-500 rounded-2xl">
                              Delete
                           </button>
                        </div> */}
                     </td>
                  );

                  return <tr key={rowIndex}>{cells}</tr>;
               })}

               {/* Script End */}
               <tr>
                  <td
                     colSpan={maxDepth + 2}
                     className="h-16 border-2 border-black bg-indigo-200 text-black font-mono text-base font-bold px-4 rounded-2xl"
                  >
                     # CodeSpeak - Script Ends
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
   );
};

export default GridEditor;
