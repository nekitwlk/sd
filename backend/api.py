# backend/api.py
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import aiosqlite
from contextlib import asynccontextmanager

app = FastAPI(title="Auto Answer Bot Stats")

# CORS — чтобы Mini App мог делать запросы с Telegram-домена
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://web.telegram.org", "*"],  # можно сузить позже
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE = "profiles.db"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создаём БД при старте, если нет
    async with aiosqlite.connect(DATABASE) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS profiles (
                user_id INTEGER PRIMARY KEY,
                name TEXT,
                age INTEGER,
                height INTEGER,
                weight INTEGER,
                hobbies TEXT
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()
    yield

app.router.lifespan_context = lifespan

@app.get("/stats")
async def get_stats(x_telegram_user_id: str = Header(None)):
    if not x_telegram_user_id:
        raise HTTPException(status_code=400, detail="User ID required")

    try:
        user_id = int(x_telegram_user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    async with aiosqlite.connect(DATABASE) as db:
        # Общее кол-во пользователей
        cursor = await db.execute("SELECT COUNT(DISTINCT user_id) FROM profiles")
        total_users = (await cursor.fetchone())[0]

        # Кол-во сообщений этого юзера
        cursor = await db.execute(
            "SELECT COUNT(*) FROM messages WHERE user_id = ?",
            (user_id,)
        )
        user_messages = (await cursor.fetchone())[0]

    return {
        "totalUsers": total_users,
        "userMessages": user_messages
    }