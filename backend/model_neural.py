import numpy as np
import time
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.regularizers import l2
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight

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
    Build a feed-forward neural network with dropout, batch normalization, and L2 regularization.
    Uses exponential learning rate decay for stability.
    """
    model = keras.Sequential([
        layers.Dense(128, activation='relu', kernel_regularizer=l2(0.001)),
        layers.BatchNormalization(),
        layers.Dropout(0.4),  # Increased dropout for better generalization

        layers.Dense(64, activation='relu', kernel_regularizer=l2(0.001)),
        layers.BatchNormalization(),
        layers.Dropout(0.4),

        layers.Dense(1, activation='sigmoid')
    ])

    # Learning rate decay over time
    lr_schedule = tf.keras.optimizers.schedules.ExponentialDecay(
        initial_learning_rate=0.001, decay_steps=100, decay_rate=0.95
    )
    optimizer = keras.optimizers.Adam(learning_rate=lr_schedule)

    model.compile(
        optimizer=optimizer,
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def add_noise(X, noise_level=0.01):
    """ Data Augmentation - Adds slight noise to prevent overfitting (Optional). """
    return X + noise_level * np.random.randn(*X.shape)

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

    # Optional: Data Augmentation (for small datasets)
    X_train_augmented = np.vstack([X_train, add_noise(X_train)])
    y_train_augmented = np.hstack([y_train, y_train])

    # Compute class weights for imbalanced datasets
    class_weights = compute_class_weight('balanced', classes=np.unique(y), y=y)
    class_weight_dict = {i: class_weights[i] for i in range(len(class_weights))}

    # Build the model
    model = build_model()
    model.summary()  # Print model architecture for debugging

    # Early stopping to avoid overfitting
    early_stop = keras.callbacks.EarlyStopping(
        monitor='val_loss', patience=10, restore_best_weights=True
    )

    # Train the model with improved settings
    history = model.fit(
        X_train_augmented, y_train_augmented,
        validation_data=(X_val, y_val),
        epochs=100,  # Max epochs, will stop early if overfitting
        batch_size=32,  # Reduced batch size for better gradient updates
        shuffle=True,
        class_weight=class_weight_dict,  # Handles class imbalance
        callbacks=[early_stop]
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
