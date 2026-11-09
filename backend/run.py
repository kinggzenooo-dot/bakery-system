import uvicorn
import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

if __name__ == "__main__":
    print("==========================================================")
    print(" [*] Starting Fredy Bills Baker Management System Backend")
    print(" [>] Interactive Swagger API Docs: http://127.0.0.1:8000/docs")
    print(" [>] Frontend URL: http://127.0.0.1:8000/static/index.html")
    print(" [>] Login Page: http://127.0.0.1:8000/static/login.html")
    print("==========================================================")
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
