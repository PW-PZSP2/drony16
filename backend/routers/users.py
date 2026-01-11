from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import User
from schemas import UserChangePassword
from auth import get_current_user, verify_password, get_password_hash

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.put("/me/password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: UserChangePassword,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(password_data.current_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password"
        )

    hashed_password = get_password_hash(password_data.new_password)
    current_user.password = hashed_password

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return {"message": "Password changed successfully"}
