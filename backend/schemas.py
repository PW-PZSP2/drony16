from pydantic import BaseModel, EmailStr, Field, model_validator
from typing import Optional, Literal, Dict, Any
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    user_name: str
    password: str
    phone_number: str
    role: Literal["adm", "ope", "cli"]
    localisation: Optional[str] = None
    area: Optional[int] = None

    @model_validator(mode="after")
    def check_operator_requirements(self):
        if self.role == "ope":
            if not self.localisation:
                raise ValueError("Localisation is required for operators")
            if self.area is None:
                raise ValueError("Area is required for operators")
        return self


class UserResponse(UserBase):
    id: int = Field(..., serialization_alias="user_id", validation_alias="user_id")
    user_name: str
    is_blocked: str
    roles: list[str]
    phone_number: str
    creation_date: datetime
    localisation: Optional[str] = None
    latitude: Optional[float]
    longitude: Optional[float]
    area: Optional[int]

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
    order_id: int = Field(...)
    services: list[ServiceRequest]
    client_id: int
    operator_id: Optional[int] = None
    creation_date: datetime
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    interested_operators: list[int] = []
    has_applied: Optional[bool] = False
    state: str = "Złożone"

    class Config:
        from_attributes = True
        populate_by_name = True


class OpinionCreate(BaseModel):
    score: int
    opinion: str


class OpinionResponse(BaseModel):
    order_id: int
    score: int
    opinion: str

    class Config:
        from_attributes = True
