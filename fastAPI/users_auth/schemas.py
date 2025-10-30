from pydantic import BaseModel, EmailStr, Field, SecretStr, HttpUrl
from typing import Optional, Union
import re
from datetime import datetime

class UserCreate(BaseModel):
    full_name: str
    role:str
    email: EmailStr
    phone_number: str
    address: str
    years_experience: str
    password: str
    

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str

# Update your token response schema
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int  # Add this field
    redirect_to: str

class ServiceBase(BaseModel):
    title: str
    description: str
    price: float
    image: str

class ServiceCreate(ServiceBase):
    provider_id: int

from pydantic import ConfigDict

class Service(BaseModel):
    id: int
    title: str
    description: str
    price: int
    image: str
    rating: int
    provider_name: str
    created_at: datetime
    provider_id: int
    
    # Add this configuration
    model_config = ConfigDict(from_attributes=True)
    
    # Old way (Pydantic v1) - if you're using an older version:
    # class Config:
    #     from_attributes = True
    #     orm_mode = True  # For Pydantic v1 compatibility


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    image: Optional[str] = None
    is_active: Optional[bool] = None
    
    class Config:
        orm_mode = True

class AdminCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    is_super_admin: bool = False

class AdminResponse(BaseModel):
    id: int
    email: str
    full_name: str
    is_super_admin: bool
    created_at: datetime

class BookingCreate(BaseModel):
    service_id: int
    scheduled_date: datetime
    homeowner_id: Optional[int] = None  # Will be set from current user
    
class BookingResponse(BaseModel):
    id: int
    service_id: int
    homeowner_id: int
    booking_date: datetime
    status: str
    scheduled_date: datetime
    completed_date: Optional[datetime] = None
    service_title: str
    provider_name: str

class ChatInput(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str