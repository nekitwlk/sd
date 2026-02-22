# backend/main.py
import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.types import Message
from aiogram.filters import CommandStart, Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

from config import settings


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

bot = Bot(token=settings.bot_token)
dp = Dispatcher()


@dp.message(CommandStart())
async def cmd_start(message: Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="Открыть настройки профиля 🎭",
                web_app=WebAppInfo(url="http://localhost:3000")  # ← временно, потом заменишь
            )
        ]
    ])

    await message.answer(
        "<b>Привет!</b>\n\n"
        "Я буду отвечать за тебя максимально естественно.\n"
        "Сначала зайди в настройки и заполни информацию о себе 👇",
        reply_markup=keyboard,
        parse_mode="HTML",
        disable_web_page_preview=True
    )


@dp.message(Command("test"))
async def cmd_test(message: Message):
    await message.answer("Бот живой! Всё ок.")


@dp.message()
async def echo_handler(message: Message):
    # пока просто повторяем, что написал пользователь
    await message.answer(f"Ты написал: {message.text}")


async def main():
    logger.info("Бот запускается...")
    await dp.start_polling(
        bot,
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True
    )


if __name__ == "__main__":
    asyncio.run(main())