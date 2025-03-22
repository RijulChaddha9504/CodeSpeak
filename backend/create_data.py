import os
import json
from google import genai

# Define file names
input_file = "mbpp.jsonl"  # Replace with the actual filename
output_file = "generated_responses.json"  # Output filename

# Initialize lists to store examples and questions
positive_examples = []
questions = []
almost_right_examples = []
wrong_examples = []

# Process the input JSONL file for entries from the second to the tenth (indices 1 to 9)
with open(input_file, "r", encoding="utf-8") as in_f:
    for i, line in enumerate(in_f):
        if i < 1:  # Skip the first entry (index 0)
            continue
        if i >= 5:  # Stop after the 10th entry (index 9)
            break
        data = json.loads(line)
        if "code" in data:
            positive_examples.append(data["code"])
        if "text" in data:
            questions.append(data["text"])

# Setup the client for generating responses
#AIzaSyARbC-4FA1uQE8mWA7aVu6kBkHft5FP5U8
#AIzaSyD74Rh1CjhDDRc33mbJbkRVPtOEtuDPEBo
#AIzaSyB3dh3pIe01hsctBjgEFxGTH97DZwM8YpE
#AIzaSyD5x4Ox6lIGKx8xxYCmnAc1l66O86JKLtw
#AIzaSyCMpx_rhk6753vuZg7ZQGC9AQSGl7jxcVE
#AIzaSyDZWralV25Gmwl9QxC7WgVS3uUjc6wr4G4

client = genai.Client(api_key="AIzaSyD5x4Ox6lIGKx8xxYCmnAc1l66O86JKLtw")  # Replace with your actual API key

almost_right_prompt = ("For each question, generate code in Python for it which is almost right "
                         "but has some issues that prevent it from being the correct code")
wrong_prompt = ("For each question, generate code in Python which is the worst way to accomplish the task")
system_prompt = ("Generate the code for the calculation, and only the code in Python. "
                 "Do not include any comments or explanations. Avoid list comprehensions.")

one_prompt = ("Don't create more than one code example no matter what. "
"In addition, make the function name only two words for its intended purpose if it was correct"
"Include only a neutral tone")
# Generate responses for each question from the selected entries
for question in questions:
    response_almost_right = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=question + " " + almost_right_prompt + " " + system_prompt + one_prompt,
    )
    almost_right_examples.append(response_almost_right.text)

    response_wrong = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=question + " " + wrong_prompt + " " + system_prompt + one_prompt,
    )
    wrong_examples.append(response_wrong.text)

# Combine the new responses into a JSON structure
new_entries = []
for i in range(len(questions)):
    new_entries.append({
        "question": questions[i],
        "positive_response": positive_examples[i],
        "almost_right_response": almost_right_examples[i],
        "wrong_response": wrong_examples[i]
    })

# Load existing data if the output file already exists; otherwise, initialize an empty list
if os.path.exists(output_file):
    with open(output_file, "r", encoding="utf-8") as in_f:
        try:
            existing_data = json.load(in_f)
        except json.JSONDecodeError:
            existing_data = []
else:
    existing_data = []

# Append the new entries to the existing data
existing_data.extend(new_entries)

# Write the combined data back to the JSON file
with open(output_file, "w", encoding="utf-8") as out_f:
    json.dump(existing_data, out_f, indent=4)

print(f"Appended {len(new_entries)} entries to {output_file}")
