from src.core.config import settings
import google.generativeai as genai

print(settings.GEMINI_API_KEY)

genai.configure(
    api_key=settings.GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-pro"
)

def ask_gemini(prompt):
    response = model.generate_content(prompt)
    return response.text