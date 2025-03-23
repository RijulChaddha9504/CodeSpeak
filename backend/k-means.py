from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

# Sample dataset of code snippets
code_samples = [
    "def add(a, b):\n    return a + b",
    "def multiply(a, b):\n    return a * b",
    "for i in range(10):\n    print(i)",
    "if x > 10:\n    print('Big')\nelse:\n    print('Small')"
]

# Convert text into numerical form using TF-IDF
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(code_samples)

# Train K-Means
kmeans = KMeans(n_clusters=2, random_state=42)
kmeans.fit(X)

# Convert `newStr` to TF-IDF features before prediction
newStr = "def add(a, b):\n    return a - b"
newStr_transformed = vectorizer.transform([newStr])

# Predict cluster
predicted_cluster = kmeans.predict(newStr_transformed)
print("Predicted Cluster:", predicted_cluster[0])
