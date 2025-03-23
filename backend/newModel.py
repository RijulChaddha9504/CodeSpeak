import asyncio
import numpy as np
import json
import os
import joblib

from google import genai
from google.genai.types import EmbedContentConfig
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# ---------------------------
# 1. Load and Prepare Data
# ---------------------------
# This assumes your JSON file (generated_responses.json) has entries with:
# "algorithm" as the question, "solution" as the positive response,
# and "incorrect solution" as the negative response.
json_file_path = 'generated_responses.json'
with open(json_file_path, 'r') as file:
    data = json.load(file)
    data = data[:50]

questions = []
positive_responses = []
negative_responses = []

for entry in data:
    questions.append(entry.get("algorithm"))
    positive_responses.append(entry.get("solution"))
    negative_responses.append(entry.get("incorrect solution"))

# ---------------------------
# 2. Define Embedding Functions
# ---------------------------
# Asynchronous function to get an embedding for a given text.
async def embed_content(content, client):
    loop = asyncio.get_running_loop()
    response = await loop.run_in_executor(
        None,
        lambda: client.models.embed_content(
            model="text-embedding-004",
            contents=content,
            config=EmbedContentConfig(task_type="CLUSTERING")
        )
    )
    # Assume response.embeddings[0].values holds the embedding vector.
    return np.array(response.embeddings[0].values)

# Function to compute embeddings for a list of texts.
async def compute_embeddings(texts, client):
    tasks = [asyncio.create_task(embed_content(text, client)) for text in texts]
    embeddings = await asyncio.gather(*tasks)
    return embeddings

# ---------------------------
# 3. Build the Training Dataset
# ---------------------------
# For each question, compute the "difference" between the solution embedding and the question embedding.
# This difference serves as a feature representation of how the solution relates to the question.
async def build_dataset(client):
    # Compute embeddings for questions, positive responses, and negative responses.
    question_embeddings = await compute_embeddings(questions, client)
    positive_embeddings = await compute_embeddings(positive_responses, client)
    negative_embeddings = await compute_embeddings(negative_responses, client)
    
    X = []
    y = []
    
    # Use difference vectors as features for positive examples (label 1)
    for q_emb, pos_emb in zip(question_embeddings, positive_embeddings):
        diff = pos_emb - q_emb  # or you could use absolute difference or other metrics
        X.append(diff)
        y.append(1)
        
    # Do the same for negative examples (label 0)
    for q_emb, neg_emb in zip(question_embeddings, negative_embeddings):
        diff = neg_emb - q_emb
        X.append(diff)
        y.append(0)
        
    return np.array(X), np.array(y)

# ---------------------------
# 4. Train the Classifier
# ---------------------------
async def main():
    # Set your API key and initialize the GenAI client.
    os.environ["GOOGLE_API_KEY"] = 'AIzaSyARbC-4FA1uQE8mWA7aVu6kBkHft5FP5U8'  # Replace with your actual API key
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
    
    # Build the dataset
    print("Computing embeddings and building the dataset...")
    X, y = await build_dataset(client)
    print("Dataset shape:", X.shape)
    
    # Split the data into training and testing sets.
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train a logistic regression classifier.
    clf = LogisticRegression(max_iter=1000)
    clf.fit(X_train, y_train)
    
    # Evaluate the model.
    y_pred = clf.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the trained model for later use.
    joblib.dump(clf, 'intent_similarity_model.pkl')
    print("\nModel saved as 'intent_similarity_model.pkl'.")

# Run the asynchronous main function.
asyncio.run(main())
