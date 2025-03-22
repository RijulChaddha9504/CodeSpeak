import React from "react";

interface GridEditorProps {
   codeMatrix: string[][]; // Parsed code as rows of indentation + statement
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
   const lastRow = codeMatrix.length - 1;
   const hoverClasses = ""; // Optional hover effects
   return (
      <div className="overflow-x-auto">
         <table className="border-collapse">
            <tbody>
               {codeMatrix.map((row, rowIndex) => {
                  const cells = row.map((cellContent, colIndex) => {
                     const isFirstRow = rowIndex === 0;
                     const isLastRow = rowIndex === lastRow;
                     const isFirstCol = colIndex === 0;
                     const isLastCol = colIndex === maxDepth;
                     const isOnlyCell =
                        codeMatrix.length === 1 && maxDepth === 1;

                     const cornerClass = isOnlyCell
                        ? "rounded-2xl"
                        : [
                             isFirstRow && isFirstCol ? "rounded-tl-2xl" : "",
                             isFirstRow && isLastCol ? "rounded-tr-2xl" : "",
                             isLastRow && isFirstCol ? "rounded-bl-2xl" : "",
                             isLastRow && isLastCol ? "rounded-br-2xl" : "",
                          ]
                             .filter(Boolean)
                             .join(" ");

                     if (cellContent.startsWith("i-")) {
                        const style =
                           colorPalettes[cellContent] ||
                           "bg-gray-200 text-black";
                        return (
                           <td
                              key={colIndex}
                              className={`w-48 h-16 border-2 border-black text-base font-bold text-center align-middle ${hoverClasses} ${style} ${cornerClass}`}
                           >
                              {cellContent.replace("i-", "within ")}
                           </td>
                        );
                     }

                     if (colIndex === row.length - 1) {
                        return (
                           <td
                              key={colIndex}
                              colSpan={maxDepth - colIndex}
                              className={`w-48 h-16 border-2 border-black bg-white text-black font-mono text-base font-bold align-middle px-4 ${hoverClasses} ${cornerClass}`}
                           >
                              {cellContent}
                           </td>
                        );
                     }

                     return (
                        <td
                           key={colIndex}
                           className={`w-48 h-16 border-2 border-black bg-gray-200 ${hoverClasses} ${cornerClass}`}
                        />
                     );
                  });

                  // ✅ Gray end-of-row cell with proper corner rounding if it's a corner
                  const isFirstRow = rowIndex === 0;
                  const isLastRow = rowIndex === lastRow;

                  const grayCornerClass = [
                     isFirstRow ? "rounded-tr-2xl" : "",
                     isLastRow ? "rounded-br-2xl" : "",
                  ]
                     .filter(Boolean)
                     .join(" ");

                  cells.push(
                     <td
                        key="add-button"
                        className={`w-48 h-16 border-2 border-black bg-gray-300 ${hoverClasses} ${grayCornerClass}`}
                        title="Add block"
                     ></td>
                  );

                  return <tr key={rowIndex}>{cells}</tr>;
               })}
            </tbody>
         </table>
      </div>
   );
};

export default GridEditor;
