from supabase import create_client, Client
from app.core.config import settings
import httpx

url: str = settings.SUPABASE_URL
key: str = settings.SUPABASE_KEY

http_client = httpx.Client(timeout=60.0)

supabase: Client = create_client(
    url,
    key,
    options={"http_client": http_client}
)