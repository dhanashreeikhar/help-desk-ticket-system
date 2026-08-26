from pydantic import BaseModel
from typing import Optional


class LoginRequest(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TicketCreate(BaseModel):
    title: str
    description: str


class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class TicketStatusUpdate(BaseModel):
    status: str


class TicketAssign(BaseModel):
    assigned_to: int


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    creator_id: int
    assigned_to: Optional[int] = None
    creator_username: Optional[str] = None
    assigned_username: Optional[str] = None

    class Config:
        from_attributes = True