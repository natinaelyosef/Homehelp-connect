from enum import Enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from typing import Optional
from database import Base
from sqlalchemy.orm import Mapped, mapped_column

class UserRole(str, Enum):
    HOMEOWNERS = "homeowners"
    SERVICEPROVIDERS = "serviceproviders"
    ADMIN = "admin"

class RegistrationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone_number = Column(String)
    profile_image = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(SQLAlchemyEnum(UserRole, name="userrole", values_callable=lambda x: [e.value for e in UserRole]), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    
    serviceproviders = relationship(
        "ServiceProvider", 
        back_populates="user", 
        uselist=False,
        foreign_keys="[ServiceProvider.user_id]"
    )
    homeowner = relationship(
        "HomeOwner", 
        back_populates="user", 
        uselist=False,
        foreign_keys="[HomeOwner.user_id]"
    )
    admin = relationship("Admin", back_populates="user", uselist=False)
    
    def __repr__(self):
        return f"<User {self.email} ({self.role})>"

class ServiceProvider(Base):
    __tablename__ = "serviceproviders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    business_name = Column(String)
    address = Column(String)
    years_experience = Column(Integer)
    service_description = Column(String)
    id_verification = Column(String)
    certification = Column(String)
    is_verified = Column(Boolean, default=False)
    verification_date = Column(DateTime)
    verification_by = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="serviceproviders", foreign_keys=[user_id])
    verified_by_admin = relationship("User", foreign_keys=[verification_by])
    services = relationship("Service", back_populates="provider", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ServiceProvider {self.business_name or self.user.full_name}>"

class HomeOwner(Base):
    __tablename__ = "homeowners"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    address = Column(String, nullable=True)
    
    user = relationship("User", back_populates="homeowner", foreign_keys=[user_id])
    
    def __repr__(self):
        return f"<HomeOwner {self.user.full_name if self.user else 'Unknown'}>"


class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("serviceproviders.id"))
    title = Column(String, nullable=False)
    description = Column(String)
    price = Column(Integer)
    image: Mapped[str] = mapped_column(String(255), nullable=True)
    rating = Column(Integer, default=0) 
    provider_name = Column(String)  
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    provider = relationship("ServiceProvider", back_populates="services")
    bookings = relationship("Booking", back_populates="service", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Service {self.title} by {self.provider_id}>"
    
    def transform_image_url(self):
        if self.image and not self.image.startswith(('http://', 'https://')):
            self.image = f"https://yourdomain.com/uploads/{self.image}"
        return self
    

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"))
    homeowner_id = Column(Integer, ForeignKey("homeowners.id"))
    booking_date = Column(DateTime, default=datetime.utcnow)
    status = Column(SQLAlchemyEnum(BookingStatus), default=BookingStatus.PENDING)
    scheduled_date = Column(DateTime)
    completed_date = Column(DateTime)
    
    service = relationship("Service", back_populates="bookings")
    homeowner = relationship("HomeOwner")
    
    def __repr__(self):
        return f"<Booking {self.id} for service {self.service_id}>"

class ProviderRegistrationRequest(Base):
    __tablename__ = "provider_registration_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    years_experience = Column(Integer, nullable=True)
    password_hash = Column(String, nullable=False)
    id_verification = Column(String, nullable=True)
    certification = Column(String, nullable=True)
    status = Column(SQLAlchemyEnum(RegistrationStatus), default=RegistrationStatus.PENDING)
    rejection_reason = Column(String, nullable=True)
    requested_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    processed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    processed_by_admin = relationship("User", foreign_keys=[processed_by])
    
    def __repr__(self):
        return f"<ProviderRegistrationRequest {self.email} ({self.status})>"
    

# In your User model, add this relationship:
admin = relationship(
    "Admin", 
    back_populates="user", 
    uselist=False,
    foreign_keys="[Admin.user_id]"
)

# And add the Admin model class:
class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    is_super_admin = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="admin", foreign_keys=[user_id])
    
    def __repr__(self):
        return f"<Admin {self.user.full_name if self.user else 'Unknown'}>"