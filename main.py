import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher
from config import settings
from handlers import user_handlers, appeal_handlers, admin_handlers
from database.models import init_db

async def main():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    # Initialize database
    await init_db()

    bot = Bot(token=settings.BOT_TOKEN)
    dp = Dispatcher()

    # Register routers
    dp.include_router(user_handlers.router)
    dp.include_router(appeal_handlers.router)
    dp.include_router(admin_handlers.router)

    logging.info("Bot is starting...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        sys.exit(0)
