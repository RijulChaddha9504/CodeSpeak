import numpy as np
import time
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split

# Set seeds for reproducibility (helps get consistent results)
SEED = 42
np.random.seed(SEED)
tf.random.set_seed(SEED)

# Timing utility for measuring execution duration
class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self
    def __exit__(self, *args):
        elapsed = time.perf_counter() - self.start
        print(f"\033[1mExecuted in {elapsed:.2f} seconds.\033[0m")

def build_model():
    """
    Build a feed-forward neural network with dropout and batch normalization.
    Adjust layer sizes or add regularization as needed for your dataset size.
    """
    model = keras.Sequential([ 
        layers.Dense(256, activation='relu'), 
        layers.BatchNormalization(), 
        layers.Dropout(0.3),

        layers.Dense(128, activation='relu'), 
        layers.BatchNormalization(), 
        layers.Dropout(0.3),

        layers.Dense(64, activation='relu'), 
        layers.BatchNormalization(), 
        layers.Dropout(0.2),

        layers.Dense(32, activation='relu'), 
        layers.BatchNormalization(), 
        layers.Dropout(0.2),

        # Final output layer for binary classification
        layers.Dense(1, activation='sigmoid') 
    ])

    # Use Adam with a moderate learning rate
    optimizer = keras.optimizers.Adam(learning_rate=0.001)

    model.compile(
        optimizer=optimizer,
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    return model

def train_model_neural_network(class0, class1):
    """
    Train a binary classification model on the given embeddings.
    class0 -> label 0
    class1 -> label 1
    """
    # Combine embeddings into X, create labels y
    X = np.vstack([class0, class1])
    y = np.array([0]*len(class0) + [1]*len(class1))

    # Perform a stratified train/validation split (80/20 by default)
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=SEED, stratify=y
    )

    # Build the model
    model = build_model()
    model.summary()  # Print model architecture for debugging

    # Train the model without early stopping (ensures full epochs run)
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=30,  # Number of epochs to run
        batch_size=64,  # Adjust if your dataset is very small or large
        shuffle=True
    )
    return model, history

# Example usage
if __name__ == "__main__":
    # Load your embeddings
    good_embeds = np.load('positive_embeddings.npy')
    poor_embeds = np.load('negative_embeddings.npy')

    with Timer():
        trained_model, history = train_model_neural_network(poor_embeds, good_embeds)
        trained_model.save("saved_models/my_model.h5")
