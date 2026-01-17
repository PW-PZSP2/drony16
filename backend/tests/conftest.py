import os
import sys
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from typing import AsyncGenerator
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool

os.environ["DB_HOST"] = "localhost"

DB_USER = "write_db_password_here"
DB_PASS = "write_db_username_here"
DB_NAME = "dbname"
DATABASE_URL_VAL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@localhost/{DB_NAME}"
os.environ["DATABASE_URL"] = DATABASE_URL_VAL

backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

import database  # noqa: E402
import main  # noqa: E402
from main import app  # noqa: E402


@pytest_asyncio.fixture(scope="session", autouse=True)
async def db_engine():
    new_engine = create_async_engine(DATABASE_URL_VAL, poolclass=NullPool)

    original_db_engine = database.engine
    original_main_engine = main.engine
    original_session_local = database.SessionLocal

    database.engine = new_engine
    main.engine = new_engine

    database.SessionLocal = async_sessionmaker(
        bind=new_engine, class_=AsyncSession, expire_on_commit=False
    )

    async with new_engine.begin() as conn:
        await conn.run_sync(database.Base.metadata.create_all)

    yield new_engine

    await new_engine.dispose()

    database.engine = original_db_engine
    main.engine = original_main_engine
    database.SessionLocal = original_session_local


@pytest_asyncio.fixture(scope="function")
async def client(db_engine) -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
