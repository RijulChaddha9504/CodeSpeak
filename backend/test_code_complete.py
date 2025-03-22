from google import genai
from google.genai import types
import os

# def display_code_execution_result(response):
#   for part in response.candidates[0].content.parts:
#     if part.text is not None:
#       display(Markdown(part.text))
#     if part.executable_code is not None:
#       code_html = f'<pre style="background-color: #BBBBEE;">{part.executable_code.code}</pre>' # Change code color
#       display(HTML(code_html))
#     if part.code_execution_result is not None:
#       display(Markdown(part.code_execution_result.output))
#     if part.inline_data is not None:
#       display(Image(data=part.inline_data.data, format="png"))
#     display(Markdown("---"))

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

system_prompt = "Generate the code for the calculation, and only the code in Python. \
                            Do not include any comments or explanations. Avoid list comprehensions."

#prompt = "Write a function that computes the sum of the first 50 prime numbers."
#prompt = "Write a function that creates a list of multiples of 2, starting from 2"
prompt = "Write an algorithm that finds the number of paths within a grid of size n * m from the top left to the bottom right."

response = client.models.generate_content(
    model='gemini-2.0-flash',
    contents=prompt + system_prompt,
)

print(response.text)

response_tests = client.models.generate_content(
  model="gemini-2.0-flash",
  contents=f"Generate a set of test cases for {prompt}.", 
  config=types.GenerateContentConfig(
    tools=[types.Tool(
      code_execution=types.ToolCodeExecution
    )]
  )
)

print(response_tests.text)
