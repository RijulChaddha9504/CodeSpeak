import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from mpl_toolkits.mplot3d import Axes3D

# Load embeddings
good_embeds = np.load('positive_embeddings.npy')
poor_embeds = np.load('negative_embeddings.npy')

# Combine data
X = np.vstack([poor_embeds, good_embeds])
y = np.array([0]*len(poor_embeds) + [1]*len(good_embeds))

# Apply PCA to reduce to 3 dimensions
pca = PCA(n_components=3)
X_pca = pca.fit_transform(X)

# Apply t-SNE to reduce to 3 dimensions
tsne = TSNE(n_components=3, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X)

# Function to plot 3D scatter
def plot_3d(data, title):
    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    scatter = ax.scatter(data[:, 0], data[:, 1], data[:, 2], c=y, cmap='coolwarm', alpha=0.7)
    ax.set_title(title)
    plt.colorbar(scatter, ax=ax, label='Class')
    plt.show()

# Plot PCA and t-SNE
plot_3d(X_pca, "PCA Projection")
plot_3d(X_tsne, "t-SNE Projection")