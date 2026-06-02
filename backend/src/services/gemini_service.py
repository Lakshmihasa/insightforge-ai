import google.generativeai as genai

from src.core.config import settings

genai.configure(
    api_key=settings.GEMINI_API_KEY
)


def ask_gemini(prompt: str):

    try:

        model = genai.GenerativeModel(
            "gemini-2.0-flash"
        )

        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception:

        return (
            "AI service temporarily unavailable. "
            "Please try again later."
        )