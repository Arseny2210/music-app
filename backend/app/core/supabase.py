from supabase import create_client
from app.core.config import settings

url: str = settings.SUPABASE_URL
key: str = settings.SUPABASE_KEY

supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_KEY,
)