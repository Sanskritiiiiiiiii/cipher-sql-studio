import json
import os
import sys
import google.generativeai as genai


def generate_hint(payload):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY missing")

    genai.configure(api_key=api_key)

    assignment = payload.get("assignment", {})
    query = payload.get("query", "")

    prompt = f"""
You are a SQL mentor. Give a short hint only.
Do not provide the final SQL solution.

Assignment: {assignment.get("title")}
Difficulty: {assignment.get("difficulty")}

Problem:
{assignment.get("description")}

Schema:
{assignment.get("schema")}

Student Query:
{query or "No query yet"}

Provide one hint under 100 words.
"""

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    return response.text.strip()


def main():
    payload = json.loads(sys.stdin.read() or "{}")
    hint = generate_hint(payload)
    print(json.dumps({"hint": hint}))


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)