import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("Fetching available models...\n")

available_models = []
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        available_models.append(m.name)
        print(f"Found: {m.name}")

print("\nTesting 'gemini-2.5-flash'...")

try:
    model = genai.GenerativeModel('gemini-2.5-flash')  
    response = model.generate_content("Reply with 'API is working perfectly!' if you get this.")
    print("\nResult:", response.text)
except Exception as e:
    print("\nError aaya:", e)