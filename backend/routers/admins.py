from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Text, delete
from database import get_db
from models import Order, User
from auth import get_current_user
from datetime import date
from schemas import AdminCreate
from datetime import datetime
from auth import get_password_hash
from fastapi.concurrency import run_in_threadpool
from utils import get_coordinates

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


@router.get("/list")
async def list_admins(
    db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")

    stmt = select(User.user_id, User.user_name, User.is_blocked).where(
        cast(User.role, Text) == "adm", User.user_id != current_user.user_id
    )
    res = await db.execute(stmt)
    rows = res.all()
    admins = [{"user_id": r[0], "user_name": r[1], "is_blocked": r[2]} for r in rows]
    return admins


@router.patch("/block/{user_id}")
async def block_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")

    result = await db.execute(select(User).filter(User.user_id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_blocked = "1"
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"user_id": user.user_id, "is_blocked": user.is_blocked}


@router.patch("/unblock/{user_id}")
async def unblock_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")

    result = await db.execute(select(User).filter(User.user_id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_blocked = "0"
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"user_id": user.user_id, "is_blocked": user.is_blocked}


@router.delete("/remove/{user_id}")
async def remove_admin(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")

    if user_id == current_user.user_id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    result = await db.execute(select(User).filter(User.user_id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role != "adm":
        raise HTTPException(status_code=400, detail="User is not an admin")

    await db.execute(delete(User).where(User.user_id == user_id))
    await db.commit()

    return {"deleted_user_id": user_id}


@router.post("/create")
async def create_admin(
    data: AdminCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")

    # unique email / user_name checks
    result = await db.execute(select(User).filter(User.email == data.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    result = await db.execute(select(User).filter(User.user_name == data.user_name))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="user_name already registered")

    hashed_password = get_password_hash(data.password)

    new_user = User(
        email=data.email,
        user_name=data.user_name,
        password=hashed_password,
        role="adm",
        phone_number=data.phone_number,
        creation_date=datetime.now(),
        localisation=data.localisation,
        area=data.area,
    )

    if data.localisation:
        coords = await run_in_threadpool(get_coordinates, data.localisation)
        if coords:
            new_user.latitude = float(coords[0])
            new_user.longitude = float(coords[1])

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {
        "user_id": new_user.user_id,
        "user_name": new_user.user_name,
        "email": new_user.email,
    }


@router.get("/users")
async def list_users(
    db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")

    stmt = select(
        User.user_id,
        User.user_name,
        User.email,
        User.role,
        User.creation_date,
        User.is_blocked,
    ).where(cast(User.role, Text).in_(["ope", "cli"]))

    res = await db.execute(stmt)
    rows = res.all()

    users = []
    for r in rows:
        role_raw = r[3]
        role_label = "Operator" if role_raw == "ope" else "Klient"
        is_blocked_raw = r[5]
        blocked_flag = (
            "Zablokowany" if str(is_blocked_raw).upper() in ("1") else "Aktywny"
        )
        creation = r[4]
        creation_val = (
            creation.isoformat() if hasattr(creation, "isoformat") else creation
        )
        users.append(
            {
                "user_id": r[0],
                "user_name": r[1],
                "email": r[2],
                "type": role_label,
                "creation_date": creation_val,
                "status": blocked_flag,
            }
        )

    return users


@router.get("/stat_clients")
async def list_clients(
    db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")

    stmt = (
        select(
            User.user_id,
            User.user_name,
            User.email,
            User.creation_date,
            User.is_blocked,
            func.count(Order.order_id),
        )
        .select_from(User)
        .join(Order, Order.client_id == User.user_id, isouter=True)
        .where(cast(User.role, Text) == "cli")
        .group_by(User.user_id, User.user_name, User.creation_date, User.is_blocked)
    )

    res = await db.execute(stmt)
    rows = res.all()

    out = []
    for r in rows:
        is_blocked_raw = r[4]
        blocked_flag = (
            "Zablokowany" if str(is_blocked_raw).upper() in ("1") else "Aktywny"
        )
        creation = r[3]
        creation_val = (
            creation.isoformat() if hasattr(creation, "isoformat") else creation
        )
        out.append(
            {
                "user_id": r[0],
                "user_name": r[1],
                "email": r[2],
                "type": "Klient",
                "creation_date": creation_val,
                "status": blocked_flag,
                "orders_count": int(r[5] or 0),
            }
        )
    return out


@router.get("/stat_operators")
async def list_operators(
    db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)
):
    if not current_user or current_user.role != "adm":
        raise HTTPException(status_code=403, detail="Forbidden")

    stmt = (
        select(
            User.user_id,
            User.user_name,
            User.email,
            User.creation_date,
            User.is_blocked,
            func.count(Order.order_id),
        )
        .select_from(User)
        .join(Order, Order.operator_id == User.user_id, isouter=True)
        .where(cast(User.role, Text) == "ope")
        .group_by(User.user_id, User.user_name, User.creation_date, User.is_blocked)
    )

    res = await db.execute(stmt)
    rows = res.all()

    out = []
    for r in rows:
        is_blocked_raw = r[4]
        blocked_flag = (
            "Zablokowany" if str(is_blocked_raw).upper() in ("1") else "Aktywny"
        )
        creation = r[3]
        creation_val = (
            creation.isoformat() if hasattr(creation, "isoformat") else creation
        )
        out.append(
            {
                "user_id": r[0],
                "user_name": r[1],
                "email": r[2],
                "type": "Operator",
                "creation_date": creation_val,
                "status": blocked_flag,
                "orders_count": int(r[5] or 0),
            }
        )

    return out
