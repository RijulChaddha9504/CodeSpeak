#!/usr/bin/env python

# Copyright 2021 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import asyncio
import sys

import os
from functools import partial
from google.cloud import storage


"""Sample that asynchronously uploads a file to GCS
"""


# [START storage_async_upload]
# This sample can be run by calling `async.run(async_upload_blob('bucket_name'))`
async def async_upload_blob(bucket_name):
    """Uploads a number of files in parallel to the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    loop = asyncio.get_running_loop()

    tasks = []
    count = 3
    for x in range(count):
        blob_name = f"async_sample_blob_{x}"
        content = f"Hello world #{x}"
        blob = bucket.blob(blob_name)
        # The first arg, None, tells it to use the default loops executor
        tasks.append(loop.run_in_executor(None, partial(blob.upload_from_string, content)))

    # If the method returns a value (such as download_as_string), gather will return the values
    await asyncio.gather(*tasks)

    print(f"Uploaded {count} files to bucket {bucket_name}")


# [END storage_async_upload]

"""Sample that asynchronously uploads a wav audio file as blob to GCS
"""

async def async_upload_wav_blob(bucket_name, file_path):
    """Uploads a wav audio file to the bucket."""

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    loop = asyncio.get_running_loop()

    try:
        with open(file_path, "rb") as audio_file:
            blob_name = os.path.basename(file_path)
            blob = bucket.blob(blob_name)
            await loop.run_in_executor(None, partial(blob.upload_from_file, audio_file))

        print(f"Uploaded {blob_name} to bucket {bucket_name}")

    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

bucket_name = "wav-audio-bucket"

# if __name__ == "__main__":
#     asyncio.run(async_upload_wav_blob(
#         bucket_name=bucket_name, file_path="en-US-Standard-A.wav"
#     ))