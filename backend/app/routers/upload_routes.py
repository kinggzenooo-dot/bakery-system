import os
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/upload", tags=["Image & File Uploads"])

# Upload directory fallback (uses /tmp on Vercel to avoid read-only filesystem crash)
if os.environ.get("VERCEL"):
    UPLOAD_DIR = Path("/tmp") / "uploads"
else:
    UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"

try:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
except Exception as e:
    print(f"[Upload Router] UPLOAD_DIR creation note: {e}")

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY")

supabase_client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"[Upload Router] Supabase client init note: {e}")

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Only JPEG, PNG, WebP, and GIF are allowed."
        )

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is too large. Maximum image size is 10MB."
        )

    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "jpg"
    filename = f"img_{uuid.uuid4().hex[:12]}.{ext}"

    # 1. Save local backup file if filesystem is writable
    try:
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception as e:
        print(f"[Upload Router] Local write note: {e}")

    # Full backend URL fallback
    BACKEND_BASE = os.getenv("BACKEND_BASE_URL", "http://127.0.0.1:8000")
    local_url = f"{BACKEND_BASE}/uploads/{filename}"
    final_url = local_url

    # 2. Upload to Supabase Storage bucket 'bakery-images'
    if supabase_client:
        bucket_name = "bakery-images"
        try:
            res = supabase_client.storage.from_(bucket_name).upload(
                path=filename,
                file=content,
                file_options={"content-type": file.content_type or "image/jpeg", "upsert": "true"}
            )
            # Public Supabase URL
            final_url = f"{SUPABASE_URL.rstrip('/')}/storage/v1/object/public/{bucket_name}/{filename}"
            print(f"[Upload] Successfully uploaded to Supabase Storage: {final_url}")
        except Exception as e:
            print(f"[Upload] Supabase Storage upload note (using fallback): {e}")
            final_url = local_url

    return {
        "success": True,
        "filename": filename,
        "url": final_url,
        "content_type": file.content_type,
        "size": len(content)
    }
