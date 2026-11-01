# Penetrative Library

A library management app with AI-powered support chat and book recommendations.

## Run locally (Windows PowerShell)

From the project directory:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

Edit `.env` and set `OPENROUTER_API_KEY` to your own OpenRouter key, then start the app:

```powershell
python web_app.py
```

Open http://127.0.0.1:5000. The standalone assistant is at http://127.0.0.1:5000/assistant.

## AI features

- The member support chat calls `/api/assistant/chat` when an admin is away.
- The standalone assistant uses the same endpoint and retains recent conversation context during the chat.
- The Books page sends the member's preferences and currently available catalog entries to `/api/assistant/recommend`.
- The OpenRouter key is read by the server from `.env`; it is not sent to browser code.

Keep `.env` private. The `.env` and `.venv` paths are ignored by Git.
