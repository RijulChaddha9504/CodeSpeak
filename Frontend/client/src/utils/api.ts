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
const SERVER_URL = "http://127.0.0.1:5000"

class apiClient {
   public static async fetchCodeMatrix(userId: number = 1) {
      const response = await fetch(SERVER_URL + "/get-parsed-code/" + String(userId));
      if (response.ok) {
         return await response.json();
      }
   }

   public static async sendPrompt(code: string, userId: number = 1) {
      const SET_MESSAGE_URL = SERVER_URL + "/post-prompt/" + String(userId);
      const response = await fetch(SET_MESSAGE_URL, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({file_prompt: code})
       })

      if (response.ok) {
         return response.json()
      } else {
         throw Error("could not send prompt")
      }
   }

   public static async setCode(code: string, userId: number = 1) {
      const SET_CODE_URL = SERVER_URL + "/set-code/" + String(userId);
      const response = await fetch(SET_CODE_URL, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({file_content: code})
       })

      if (response.ok) {
         return response.json()
      } else {
         throw Error("could not set code")
      }
   }


   public static async updateCode(code: string[][], userId = 1) {
      // add parsing here
      let resultString = ""
      for (const row of code) {
         for (const el of row) {
            if (el.startsWith("i-")) {
               resultString += "  ";
            } else {
               resultString += el + "\n";
            }
         }
      }
      console.log(resultString)
      const SET_CODE_URL = SERVER_URL + "/set-code/" + String(userId);
      const response = await fetch(SET_CODE_URL, {
         method: "PATCH",
         headers: {"Content-Type": "application/json" }, 
         body: JSON.stringify({file_content: resultString})
      })
      if (response.ok) {
         return response.json();
      } else {
         throw Error ("Could not update code in database")
      }
   }
}

export default apiClient