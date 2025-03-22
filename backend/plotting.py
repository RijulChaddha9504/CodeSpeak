import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import numpy as np

# Load the saved embeddings
positive_embeddings = np.load('positive_embeddings.npy')
negative_embeddings = np.load('negative_embeddings.npy')

# Combine both embeddings into a single dataset
embeddings = np.vstack([positive_embeddings, negative_embeddings])

# Create labels: 0 for positive, 1 for negative
labels = np.array([0] * len(positive_embeddings) + [1] * len(negative_embeddings))

# Perform PCA
pca = PCA(n_components=2)
embeddings_pca = pca.fit_transform(embeddings)

# Perform t-SNE
tsne = TSNE(n_components=2, random_state=0)
embeddings_tsne = tsne.fit_transform(embeddings)

# Plot PCA
plt.figure(figsize=(12, 6))

plt.subplot(1, 2, 1)
scatter_pca = plt.scatter(embeddings_pca[:, 0], embeddings_pca[:, 1], c=labels, cmap='viridis', alpha=0.7)
plt.title("PCA of Embeddings")
plt.xlabel("PCA Component 1")
plt.ylabel("PCA Component 2")
plt.colorbar(scatter_pca, label="Label (0=Positive, 1=Negative)")

# Plot t-SNE
plt.subplot(1, 2, 2)
scatter_tsne = plt.scatter(embeddings_tsne[:, 0], embeddings_tsne[:, 1], c=labels, cmap='viridis', alpha=0.7)
plt.title("t-SNE of Embeddings")
plt.xlabel("t-SNE Component 1")
plt.ylabel("t-SNE Component 2")
plt.colorbar(scatter_tsne, label="Label (0=Positive, 1=Negative)")

plt.show()