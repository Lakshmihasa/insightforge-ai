import google.generativeai as genai

genai.configure(
    api_key="PASTE_YOUR_GEMINI_API_KEY_HERE"
)

for model in genai.list_models():
    print(model.name)