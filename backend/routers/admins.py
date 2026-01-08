from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Text
from database import get_db
from models import Order, User
from auth import get_current_user
from datetime import date

router = APIRouter(
    prefix="/admins",
    tags=["admins"],
    responses={404: {"description": "Not found"}},
)


def _month_range(year: int, month: int):
    start = date(year, month, 1)
    if month == 12:
        next_start = date(year + 1, 1, 1)
    else:
        next_start = date(year, month + 1, 1)
    return start, next_start


async def _count_users_in_range(db: AsyncSession, role: str, start: date, end: date):
    stmt = (
        select(func.count())
        .select_from(User)
        .where(
            cast(User.role, Text) == role,
            User.creation_date >= start,
            User.creation_date < end,
        )
    )
    res = await db.execute(stmt)
    return int(res.scalar() or 0)


async def _count_orders_in_range(db: AsyncSession, start: date, end: date):
    stmt = (
        select(func.count())
        .select_from(Order)
        .where(Order.creation_date >= start, Order.creation_date < end)
    )
    res = await db.execute(stmt)
    return int(res.scalar() or 0)


@router.get("/stats/clients")
async def clients_month_stats(
    db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")

    today = date.today()
    start_curr, start_next = _month_range(today.year, today.month)

    total_stmt = (
        select(func.count()).select_from(User).where(cast(User.role, Text) == "cli")
    )
    total_res = await db.execute(total_stmt)
    total_clients = int(total_res.scalar() or 0)

    month_new = await _count_users_in_range(db, "cli", start_curr, start_next)

    return {"total_clients": total_clients, "new_this_month": month_new}


@router.get("/stats/operators")
async def operators_month_stats(
    db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")
    today = date.today()
    start_curr, start_next = _month_range(today.year, today.month)

    total_stmt = (
        select(func.count()).select_from(User).where(cast(User.role, Text) == "ope")
    )
    total_res = await db.execute(total_stmt)
    total_operators = int(total_res.scalar() or 0)

    month_new = await _count_users_in_range(db, "ope", start_curr, start_next)

    return {"total_operators": total_operators, "new_this_month": month_new}


@router.get("/stats/orders")
async def orders_month_stats(
    db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")
    today = date.today()
    start_curr, start_next = _month_range(today.year, today.month)

    total_stmt = select(func.count()).select_from(Order)
    total_res = await db.execute(total_stmt)
    total_orders = int(total_res.scalar() or 0)

    month_new = await _count_orders_in_range(db, start_curr, start_next)

    return {"total_orders": total_orders, "new_this_month": month_new}
