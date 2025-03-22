import React, { useState } from "react";

interface GridEditorProps {
   codeMatrix: string[][];
}

const colorPalettes: Record<string, string> = {
   "i-if": "bg-yellow-400 text-black",
   "i-elif": "bg-yellow-300 text-black",
   "i-else": "bg-orange-300 text-black",
   "i-for": "bg-lime-400 text-black",
   "i-while": "bg-green-400 text-black",
   "i-try": "bg-pink-300 text-black",
   "i-except": "bg-pink-400 text-black",
   "i-finally": "bg-orange-400 text-black",
   "i-def": "bg-violet-300 text-black",
   "i-class": "bg-rose-300 text-black",
   "i-with": "bg-cyan-300 text-black",
   "i-async": "bg-teal-300 text-black",
   "i-match": "bg-red-300 text-black",
   "i-case": "bg-amber-300 text-black",
};

const GridEditor: React.FC<GridEditorProps> = ({ codeMatrix }) => {
   const maxDepth = Math.max(...codeMatrix.map((row) => row.length));
   const [activeCell, setActiveCell] = useState<{
      content: string;
      line: number;
   } | null>(null);

   const lowerTrimmed = (str: string) => str.toLowerCase().trim();

   const filteredMatrix = codeMatrix.filter(
      (row) =>
         !row.some((cell) =>
            ["#codespeak - script begins", "#codespeak - script ends"].includes(
               lowerTrimmed(cell)
            )
         )
   );

   const getFontSizeClass = (content: string) => {
      const length = content.length;
      if (length <= 20) return "text-7xl";
      if (length <= 40) return "text-5xl";
      if (length <= 60) return "text-4xl";
      return "text-3xl";
   };

   return (
      <div className="overflow-x-auto mt-3 mb-3 relative">
         {/* Popout Overlay */}
         {activeCell && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
               <div className="bg-white border-4 border-black shadow-2xl rounded-3xl p-16 w-[90vw] max-w-[1200px] max-h-[90vh]">
                  <div className="flex justify-end mb-6">
                     <button
                        onClick={() => setActiveCell(null)}
                        className="text-black font-bold text-4xl px-6 py-2 rounded hover:bg-gray-200"
                     >
                        ✕
                     </button>
                  </div>
                  <div
                     className={`text-black font-mono mb-10 whitespace-pre-wrap ${getFontSizeClass(
                        activeCell.content
                     )}`}
                  >
                     {activeCell.content}
                  </div>
                  <div className="text-2xl text-gray-500 font-bold">
                     Line {activeCell.line}
                  </div>
               </div>
            </div>
         )}

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

                  // Line number cell
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
                     const isOnlyCell =
                        codeMatrix.length === 1 && maxDepth === 1;
                     const cornerClass = isOnlyCell ? "rounded-2xl" : "";

                     if (cellContent.startsWith("i-")) {
                        const style =
                           colorPalettes[cellContent] ||
                           "bg-gray-200 text-black";
                        cells.push(
                           <td
                              key={colIndex}
                              onClick={() =>
                                 setActiveCell({
                                    content: cellContent.replace(
                                       "i-",
                                       "within "
                                    ),
                                    line: rowIndex + 1,
                                 })
                              }
                              className={`${baseClasses} ${style} text-base font-bold text-center align-middle ${cornerClass}`}
                           >
                              {cellContent.replace("i-", "within ")}
                           </td>
                        );
                     } else if (colIndex === row.length - 1) {
                        cells.push(
                           <td
                              key={colIndex}
                              colSpan={maxDepth - colIndex}
                              onClick={() =>
                                 setActiveCell({
                                    content: cellContent,
                                    line: rowIndex + 1,
                                 })
                              }
                              className={`${baseClasses} bg-white text-black font-mono text-base font-bold align-middle px-4 ${cornerClass}`}
                           >
                              {cellContent}
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

                  // Add block cell
                  const addBlockClass = [
                     "w-48 h-16 border-1 border-black bg-gray-300 overflow-hidden",
                     isFirstRow ? "rounded-tr-2xl" : "",
                     isLastRow ? "rounded-br-2xl" : "",
                  ]
                     .filter(Boolean)
                     .join(" ");

                  cells.push(
                     <td key={`add-${rowIndex}`} className={addBlockClass}>
                        <div className="w-full h-full" />
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
