export const sendToBackend = async (text: string): Promise<string[]> => {
   try {
      const response = await fetch("http://localhost:5000/generateCode", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ prompt: text }),
      });

      const data = await response.json();
      return data.code ? data.code.split("\n") : []; // Returns an array of lines
   } catch (error) {
      console.error("Error fetching code:", error);
      return [];
   }
};
