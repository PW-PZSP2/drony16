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
from models import Service, ServiceParameter  # noqa: E402
from sqlalchemy import select  # noqa: E402


async def seed_services(session: AsyncSession):
    result = await session.execute(select(Service))
    if result.scalars().first():
        return

    s1 = Service(name="Ortofotomapa")
    s2 = Service(name="Chmura Punktów")
    s3 = Service(name="Numeryczne Modele Terenu")
    s4 = Service(name="Modele 3D")
    s5 = Service(name="Film")
    s6 = Service(name="Scanning Laserowy")

    session.add_all([s1, s2, s3, s4, s5, s6])
    await session.flush()

    params = [
        ServiceParameter(name="Rozdzielczość", unit="cm/piksel", service=s1),
        ServiceParameter(name="Dokładność", unit="cm", service=s1),
        ServiceParameter(name="Odbiornik RTK", unit="bool", service=s1),
        ServiceParameter(name="Format", unit='"GeoTIFF", "JPEG", "PNG"', service=s1),
        ServiceParameter(name="Dokładność", unit="cm", service=s2),
        ServiceParameter(name="Gęstość punktów", unit="mln punktów/m²", service=s2),
        ServiceParameter(name="Kolorowa", unit="bool", service=s2),
        ServiceParameter(name="Zklasyfikowana", unit="bool", service=s2),
        ServiceParameter(name="Format", unit='"LAS", "LAZ", "E57"', service=s2),
        ServiceParameter(name="Rozdzielczość", unit="cm/piksel", service=s3),
        ServiceParameter(name="Dokładność", unit="cm", service=s3),
        ServiceParameter(name="Odbiornik RTK", unit="bool", service=s3),
        ServiceParameter(name="Format", unit='"GeoTIFF", "JPEG", "PNG"', service=s3),
        ServiceParameter(name="NMT", unit="bool", service=s3),
        ServiceParameter(name="NMPT", unit="bool", service=s3),
        ServiceParameter(name="Dokładność", unit="cm", service=s4),
        ServiceParameter(name="Ilość płaszczyzn", unit="mln", service=s4),
        ServiceParameter(name="Format", unit='"OBJ", "FBX", "STEP"', service=s4),
        ServiceParameter(name="Czas trwania", unit="minuty", service=s5),
        ServiceParameter(name="Jakość", unit='"4K", "Full HD"', service=s5),
        ServiceParameter(name="Stabilizacja", unit="bool", service=s5),
        ServiceParameter(name="Format", unit='"MP4", "MOV", "INSV"', service=s5),
        ServiceParameter(name="Chmura punktów", unit="bool", service=s6),
        ServiceParameter(name="Modele 3D", unit="bool", service=s6),
        ServiceParameter(name="Numeryczne Modele Terenu", unit="bool", service=s6),
    ]
    session.add_all(params)
    await session.commit()


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

    # Seed data
    async with database.SessionLocal() as session:
        await seed_services(session)

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
