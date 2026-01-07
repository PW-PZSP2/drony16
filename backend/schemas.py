from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal, Dict, Any
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    user_name: str
    password: str
    phone_number: str
    role: Literal["adm", "ope", "cli"]


class UserResponse(UserBase):
    id: int = Field(..., serialization_alias="user_id", validation_alias="user_id")
    user_name: str
    is_blocked: str
    roles: list[str]
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


class OrderBase(BaseModel):
    name: str
    deadline: datetime
    location: str
    description: str
    completion_date: bool
    raid_date: bool


class ServiceRequest(BaseModel):
    service_name: str
    parameters: Dict[str, Any]


class OrderCreate(OrderBase):
    services: list[ServiceRequest]


class OrderResponse(OrderBase):
    id: int = Field(..., serialization_alias="order_id", validation_alias="order_id")
    services: list[ServiceRequest]
    client_id: int
    operator_id: Optional[int] = None
    creation_date: datetime
