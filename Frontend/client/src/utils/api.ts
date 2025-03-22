// export const sendToBackend = async (text: string): Promise<string[]> => {
//    try {
//       const response = await fetch("http://localhost:5000/generateCode", {
//          method: "POST",
//          headers: {
//             "Content-Type": "application/json",
//          },
//          body: JSON.stringify({ prompt: text }),
//       });

//       const data = await response.json();
//       return data.code ? data.code.split("\n") : []; // Returns an array of lines
//    } catch (error) {
//       console.error("Error fetching code:", error);
//       return [];
//    }
// };
const SERVER_URL = "temp"

class apiClient {
   public static async fetchCodeMatrix(userId: number) {
      const response = await fetch(SERVER_URL + "/get-parsed-code/" + String(userId));
      if (response.ok) {
         return await response.json();
      }
   }

   public static async sendPrompt(code: string, userId: number) {
      const SET_MESSAGE_URL = SERVER_URL + "/post-prompt/" + String(userId);
      const response = await fetch(SET_MESSAGE_URL, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: code
       })

      if (response.ok) {
         return response.json()
      } else {
         throw Error("could not send prompt")
      }
   }


   public static async updateCode(code: string, userId) {
      const SET_CODE_URL = SERVER_URL + "/set-code/" + String(userId);
      const response = await fetch(SET_CODE_URL, {
         method: "PATCH",
         headers: {"Content-Type": "application/json" }, 
         body: code
      })
      if (response.ok) {
         return response.json();
      } else {
         throw Error ("Could not update code in database")
      }
   }
}

export default apiClient