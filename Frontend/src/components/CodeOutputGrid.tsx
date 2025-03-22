import React from "react";

interface GridEditorProps {
   codeMatrix: string[][];
}

const colorPalettes: Record<string, string[]> = {
   "i-if": ["bg-blue-500 text-white", "bg-blue-300 text-black"],
   "i-elif": ["bg-cyan-500 text-white", "bg-cyan-300 text-black"],
   "i-else": ["bg-sky-500 text-white", "bg-sky-300 text-black"],
   "i-for": ["bg-emerald-500 text-white", "bg-emerald-300 text-black"],
   "i-while": ["bg-green-600 text-white", "bg-green-300 text-black"],
   "i-try": ["bg-orange-500 text-white", "bg-orange-300 text-black"],
   "i-except": ["bg-amber-500 text-white", "bg-amber-300 text-black"],
   "i-finally": ["bg-yellow-500 text-black", "bg-yellow-300 text-black"],
   "i-def": ["bg-purple-600 text-white", "bg-purple-300 text-black"],
   "i-class": ["bg-pink-500 text-white", "bg-pink-300 text-black"],
   "i-with": ["bg-teal-500 text-white", "bg-teal-300 text-black"],
   "i-async": ["bg-lime-500 text-black", "bg-lime-300 text-black"],
   "i-match": ["bg-red-500 text-white", "bg-red-300 text-black"],
   "i-case": ["bg-rose-500 text-white", "bg-rose-300 text-black"],
};

const GridEditor: React.FC<GridEditorProps> = ({ codeMatrix }) => {
   const maxDepth = Math.max(...codeMatrix.map((row) => row.length));
   const blockCounters: Record<string, number> = {};

   return (
      <div className="overflow-x-auto">
         <table className="border-collapse">
            <tbody>
               {codeMatrix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                     {Array.from({ length: maxDepth }).map((_, colIndex) => {
                        const cellContent = row[colIndex] || "";

                        // Handle indentation cells
                        if (cellContent.startsWith("i-")) {
                           const blockType = cellContent;
                           const count = blockCounters[blockType] || 0;
                           const palette = colorPalettes[blockType] || [
                              "bg-gray-400 text-black",
                              "bg-gray-300 text-black",
                           ];
                           const style = palette[count % 2];

                           // Count each block type once per row
                           if (
                              row
                                 .filter((c) => c === blockType)
                                 .indexOf(cellContent) === colIndex
                           ) {
                              blockCounters[blockType] = count + 1;
                           }

                           return (
                              <td
                                 key={colIndex}
                                 className={`w-48 h-16 border-2 border-black text-base font-bold text-center align-middle ${style}`}
                              >
                                 {cellContent.replace("i-", "within ")}
                              </td>
                           );
                        }

                        // Statement cell
                        if (colIndex === row.length - 1) {
                           return (
                              <td
                                 key={colIndex}
                                 colSpan={maxDepth - colIndex}
                                 className="w-48 h-16 border-2 border-black bg-white text-black font-mono text-base font-bold align-middle px-4"
                              >
                                 {cellContent}
                              </td>
                           );
                        }

                        // Padding cell
                        return (
                           <td
                              key={colIndex}
                              className="w-48 h-16 border-2 border-black"
                           />
                        );
                     })}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default GridEditor;
