import pathlib
import textwrap
import os
from dotenv import load_dotenv
import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

load_dotenv()

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

#for m in genai.list_models():
  #if 'generateContent' in m.supported_generation_methods:
    #print(m.name)

model = genai.GenerativeModel('gemini-pro')

response = model.generate_content("What is the ideal temperature range for the Begonia haageana houseplant? Answer in a full sentence please") 

to_markdown(response.text)

for chunk in response:
  print(chunk.text)
  print("_"*80)

print(to_markdown(response.text))