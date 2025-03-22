import asyncio
from extract_data import positive, negative
from google import genai
from google.genai.types import EmbedContentConfig
import numpy as np
from google.genai import types

# Initialize the client with your API key
client = genai.Client(api_key="AIzaSyARbC-4FA1uQE8mWA7aVu6kBkHft5FP5U8")  # Replace with your actual API key

# Define a semaphore to limit concurrent requests (adjust the value as needed)
concurrent_requests = 3
semaphore = asyncio.Semaphore(concurrent_requests)
async def embed_content(content):
    async with semaphore:
        # Optionally, you can add a small delay here if needed
        await asyncio.sleep(0.2)  # adjust the delay as appropriate
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(
            None,
            lambda: client.models.embed_content(
                model="text-embedding-004",
                contents=content,
                config=EmbedContentConfig(
                    output_dimensionality=500,
                    task_type="CLUSTERING"  # Include both configurations in a single config object
                )
            )
        )
        return response.embeddings

async def main():
    # Create tasks for each content in your 'positive' list
    positive_tasks = [asyncio.create_task(embed_content(content)) for content in positive]
    # Run tasks concurrently with the semaphore limiting the rate
    positive_results = await asyncio.gather(*positive_tasks)

    negative_tasks = [asyncio.create_task(embed_content(content)) for content in negative]
    negative_results = await asyncio.gather(*negative_tasks)
    
    # Process the results
    positive_vectors = [np.array(embedding[0].values) for embedding in positive_results]

# Optionally, stack them into a 2D array if all vectors have the same length (e.g., 600)
    pos_embeddings = np.vstack(positive_vectors)
    print(pos_embeddings.shape)

    print("NEGATIVE RESULTS")

    neg_vectors = [np.array(embedding[0].values) for embedding in negative_results]

# Optionally, stack them into a 2D array if all vectors have the same length (e.g., 600)
    neg_embeddings = np.vstack(neg_vectors)
    print(neg_embeddings.shape)

    np.save('positive_embeddings.npy', pos_embeddings)
    np.save('negative_embeddings.npy', neg_embeddings)


    '''neg_embedding_obj = negative_results[0][0]  # Index into the inner list
    neg_vector = np.array(neg_embedding_obj.values)
    print(neg_vector.shape) '''


# Run the main async function
asyncio.run(main())
