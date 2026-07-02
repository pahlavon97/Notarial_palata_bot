from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    BOT_TOKEN: str
    ADMIN_CHAT_IDS: str
    MAIN_ADMIN_ID: int
    
    @property
    def admin_ids(self) -> List[int]:
        return [int(x.strip()) for x in self.ADMIN_CHAT_IDS.split(",") if x.strip()]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
