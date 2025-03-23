import tensorflow as tf
import numpy as np
import os
import atexit
from google import genai
from test_script import test_script
# Set your API key and load your trained classification model.
# os.environ["GOOGLE_API_KEY"] = "YOUR_API_KEY"
loaded_model = tf.keras.models.load_model("saved_models/my_model.h5")


# Option B: If your embedder always returns a 768-d vector, create a projection layer
# to convert it to 500 dimensions (matching your training embeddings).
projection_layer = tf.keras.layers.Dense(500, activation='linear', name='projection_layer')

# Initialize the Google client for embeddings and code generation.
client = genai.Client(api_key="AIzaSyARbC-4FA1uQE8mWA7aVu6kBkHft5FP5U8")


# Register a cleanup function to close the client on exit (if the client supports it).
atexit.register(lambda: client.close() if hasattr(client, 'close') else None)

def score_code(code_snippet):
    """
    Given a code snippet as a string, embed it, project it to the classifier's expected dimension,
    and return the classifier score.
    """
    try:
        # Embed the code snippet using the Gemini model for embedding.
        result = client.models.embed_content(
            model="text-embedding-004",  # Use the correct embedding model.
            contents=code_snippet
        )
        # Extract embedding vector from the response.
        embedded_vector = np.array(result.embeddings[0].values)
        embedded_vector = embedded_vector.reshape(1, -1)

        # If the embedding is 768-d, project it to 500-d.
        if embedded_vector.shape[-1] == 768:
            embedded_tensor = tf.convert_to_tensor(embedded_vector, dtype=tf.float32)
            projected = projection_layer(embedded_tensor)
        else:
            projected = tf.convert_to_tensor(embedded_vector, dtype=tf.float32)

        # Get the classification score from the loaded model.
        score = loaded_model(projected)
        # Convert score to a scalar float.
        score_val = score.numpy()[0][0]
        return score_val
    except Exception as e:
        #print(f"Error scoring code snippet: {e}")
        return None

def generate_python_code(user_input):
    """
    Use Google Gemini to generate Python code based on the user's text input.
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents="Generate ONLY CODE TO ANSWER THE USER BASED ON THE INPUT. No comments either: " + user_input
        )
        generated_code = response.text
        return generated_code
    except Exception as e:
        #print(f"Error generating Python code: {e}")
        return None

def code_loop_gen(user_input):
    """
    The AI will regenerate code until the score is acceptable, while ensuring that previous mistakes are fixed
    and the code remains relevant to the original query.
    """
    tries = 0
    highest_score = 0
    output_code = None
    previous_code = None  # To store the previous code for comparison

    while True:
        # If there's a previous code, ask the AI to improve it.
        if previous_code:
            prompt = (
                f"The user asked the following question: '{user_input}'.\n\n"
                f"The previous code generated was:\n{previous_code}\n\n"
                "The code generated earlier didn't meet the quality threshold. Please revise the code, "
                "fix any mistakes, and ensure the new code remains relevant to the question."
            )
        else:
            prompt = user_input

        # Use Gemini to generate Python code.
        generated_code = generate_python_code(prompt)
        result = test_script(generated_code)

        while result["success"] == False:
            previous_code = generated_code
            #print(previous_code)
            prompt = (
                f"The user asked the following question: '{user_input}'.\n\n"
                f"The previous code generated was:\n{previous_code}\n\n"
                "The code generated earlier had some syntatical mistakes to it, "
                "Please correct those mistakes and ensure the new code remains relevant to the question."
            )
            generated_code = generate_python_code(prompt)
            result = test_script(generated_code)

        if generated_code is None:
            #print("An error occurred while generating Python code. Please try again.")
            continue

        # Score the generated code.
        score = score_code(generated_code)
        if score is None:
            #print("An error occurred while scoring the generated code. Please try again.")
            continue

        if score > highest_score:
            highest_score = score
            output_code = generated_code

        if tries > 4:
            output_code.replace("```python", "").replace("```", "").strip()
            return output_code

        previous_code = generated_code
        tries += 1

if __name__ == '__main__':
    code_loop_gen("Generate me a for loop that counts from 1-10")
