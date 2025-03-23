import asyncio
import os
import numpy as np
from google import genai
from google.genai.types import EmbedContentConfig
from extract_data import positive, negative  # Import positive and negative lists

# Set your API key and initialize the client.
os.environ["GOOGLE_API_KEY"] = ''  # Replace with your actual API key
client = genai.Client(api_key='')   # Replace with your actual API key

# Limit concurrent requests.
concurrent_requests = 3
semaphore = asyncio.Semaphore(concurrent_requests)

# Initialize your embedder function.
async def embed_content(content):
    async with semaphore:
        # Optional delay to avoid rate limits.
        await asyncio.sleep(0.2)
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(
            None,
            lambda: client.models.embed_content(
                model="text-embedding-004",
                contents=content,
                config=EmbedContentConfig(
                    task_type="CLUSTERING"
                )
            )
        )
        return response.embeddings

async def add_new_entries(existing_file, new_entries):
    """
    Embed the new entries and append them to the existing NumPy array stored in `existing_file`.
    """
    # Create asynchronous tasks for each new entry.
    tasks = [asyncio.create_task(embed_content(content)) for content in new_entries]
    results = await asyncio.gather(*tasks)
    
    # Process the embeddings from the results.
    new_vectors = [np.array(result[0].values) for result in results]
    new_embeddings = np.vstack(new_vectors)
    
    # Load existing embeddings if the file exists; otherwise, create an empty array.
    try:
        existing_embeddings = np.load(existing_file)
        print(f"Loaded existing embeddings from {existing_file} with shape {existing_embeddings.shape}")
    except FileNotFoundError:
        existing_embeddings = np.empty((0, new_embeddings.shape[1]))
        print(f"No existing file found. Creating new array for {existing_file}.")
    
    # Append the new embeddings.
    updated_embeddings = np.concatenate([existing_embeddings, new_embeddings], axis=0)
    np.save(existing_file, updated_embeddings)
    print(f"Updated embeddings shape in {existing_file}: {updated_embeddings.shape}")

async def periodic_upload(existing_file, entries):
    """
    Process entries in batches of 50 every 60 seconds until all entries are processed.
    """
    batch_size = 30
    start_idx = 0
    #total_entries = len(entries)
    total_entries = 1
    
    while start_idx < total_entries:
        # Select the next 50 entries.
        end_idx = min(start_idx + batch_size, total_entries)
        current_batch = entries[start_idx:end_idx]
        print(f"\nProcessing entries {start_idx} to {end_idx}...")
        await add_new_entries(existing_file, current_batch)
        start_idx += batch_size
        
        if start_idx < total_entries:
            print("Waiting 60 seconds before processing the next batch...")
            await asyncio.sleep(60)
        else:
            print("All entries processed.")

async def main():
    # Update the positive embeddings file every 60 seconds with 50 new entries.
    print("Embedding positive responses...")
    await periodic_upload('positive_embeddings.npy', positive)

    # Update the negative embeddings file every 60 seconds with 50 new entries.
    print("Embedding negative responses...")
    await periodic_upload('negative_embeddings.npy', negative)

# Run the main async function.
asyncio.run(main())