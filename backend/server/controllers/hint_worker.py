import asyncio
import json
import os
import sys
from pathlib import Path

import google.generativeai as genai
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")


async def generate_hint(payload: dict) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GEMINI_API_KEY")

    genai.configure(api_key=api_key)

    assignment = payload.get("assignment", {})
    user_query = payload.get("query", "")

    prompt = f"""
Provide a short hint to help solve this SQL problem.
Do not return the full SQL solution.

Assignment: {assignment.get('title')}
Problem: {assignment.get('description')}

Schema:
{assignment.get('schema')}

Student Query:
{user_query or "No query yet"}
"""

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    hint = response.text.strip()

    return hint[:900]


async def main():
    payload = json.loads(sys.stdin.read() or "{}")
    hint = await generate_hint(payload)
    print(json.dumps({"hint": hint}))


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)