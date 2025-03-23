import json

# Specify the path to your JSON file
json_file_path = 'generated_responses.json'

# Load the JSON data
with open(json_file_path, 'r') as file:
    data = json.load(file)

# Initialize empty lists for each column
questions = []
positive_responses = []
negative_responses = []

# Iterate over each entry in the data
for entry in data:
    question = entry.get("algorithm")
    positive_response = entry.get("solution")
    negative_response = entry.get("incorrect solution")
    
    # Append questions to the questions list
    questions.append(question)
    positive_responses.append(positive_response)
    negative_responses.append(negative_response)

# Helper function to clean and standardize response formatting
def clean_response(response):
    # Remove unnecessary escape characters and normalize spacing
    return "```python\n" + response.strip().replace("\r\n", "\n") + "\n```"

# Format the positive and negative responses as strings

print("Positive Responses:", positive_responses)
print("Negative Responses:", negative_responses)
positive = positive_responses
negative = negative_responses