from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    username: str
    password: str
    phone_number: str
    role: str


class UserResponse(UserBase):
    id: int = Field(...,
    serialization_alias="user_id",
    validation_alias="user_id")
    username: str
    is_blocked: str
    role: str
    phone_number: str
    creation_date: datetime

    class Config:
        from_attributes = True
        populate_by_name = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
