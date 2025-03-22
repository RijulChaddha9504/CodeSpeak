import json

# Specify the path to your JSON file
json_file_path = 'generated_responses.json'

# Load the JSON data
with open(json_file_path, 'r') as file:
    data = json.load(file)

# Initialize empty lists for each column
questions = []
positive_responses = []
almost_responses = []
negative_responses = []

# Iterate over each entry in the data
for entry in data:
    question = entry.get("question")
    positive_response = entry.get("positive_response")
    almost_response = entry.get("almost_right_response")
    negative_response = entry.get("wrong_response")
    
    # Append questions to the questions list
    questions.append(question)
    positive_responses.append(positive_response)
    almost_responses.append(almost_response)
    negative_responses.append(negative_response)

# Helper function to clean and standardize response formatting
def clean_response(response):
    # Remove unnecessary escape characters and normalize spacing
    return "```python\n" + response.strip().replace("\r\n", "\n") + "\n```"

# Format the positive and negative responses as strings
positive = [f"Question: \n{q} \nCode: \n{clean_response(r)}" for q, r in zip(questions, positive_responses)]
negative = [f"Question: \n{q} \nCode: \n{r} " for q, r in zip(questions, negative_responses)]

print("Positive Responses:", positive[1])
print("Negative Responses:", negative[1])