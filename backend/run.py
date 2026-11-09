import os
import sys
from pathlib import Path
import uvicorn

# Ensure the backend directory is in sys.path so 'app' is cleanly importable
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print("==========================================================")
    print(" [*] Starting Fredy Bills Baker Management System Backend")
    print(f" [>] Interactive Swagger API Docs: http://127.0.0.1:{port}/docs")
    print(f" [>] Running on Port: {port}")
    print("==========================================================")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
