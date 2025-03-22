import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import numpy as np
from mpl_toolkits.mplot3d import Axes3D

# Load the saved embeddings
positive_embeddings = np.load('positive_embeddings.npy')
negative_embeddings = np.load('negative_embeddings.npy')

# Combine both embeddings into a single dataset
embeddings = np.vstack([positive_embeddings, negative_embeddings])

# Create labels: 0 for positive, 1 for negative
labels = np.array([0] * len(positive_embeddings) + [1] * len(negative_embeddings))

# Perform PCA for 2D visualization
tsne_3d = TSNE(n_components=3, random_state=0)
embeddings_tsne_3d = tsne_3d.fit_transform(embeddings)

# Plot 3D t-SNE
fig = plt.figure(figsize=(8, 6))
ax = fig.add_subplot(111, projection='3d')
scatter_tsne_3d = ax.scatter(embeddings_tsne_3d[:, 0], embeddings_tsne_3d[:, 1], embeddings_tsne_3d[:, 2], 
                             c=labels, cmap='coolwarm', alpha=0.7)
ax.set_title("3D t-SNE of Embeddings")
ax.set_xlabel("t-SNE Component 1")
ax.set_ylabel("t-SNE Component 2")
ax.set_zlabel("t-SNE Component 3")

cbar = plt.colorbar(scatter_tsne_3d, ax=ax, pad=0.1)
cbar.set_label("Label (0=Positive, 1=Negative)")

plt.show()