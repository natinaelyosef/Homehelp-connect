from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form, status, Body, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import shutil
import os
from datetime import datetime
from typing import Annotated, Optional, List
import uuid
from fastapi.security import OAuth2PasswordBearer
from schemas import BookingCreate, BookingResponse, ChatResponse, ChatInput

from jose import JWTError, jwt
from typing import Annotated

SECRET_KEY = "your_secret_key_here"  
ALGORITHM = "HS256"  
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

from database import get_db, engine
from auth import hash_password, verify_password, create_access_token, get_current_admin_user, get_current_super_admin, get_current_user
from models import (
    Base, 
    User, 
    ServiceProvider, 
    HomeOwner, 
    Service, 
    ProviderRegistrationRequest,
    UserRole,
    RegistrationStatus,
    Admin,
    Booking,
    BookingStatus
)
from schemas import ServiceCreate,AdminCreate,AdminResponse,Service as ServiceSchema, Token, ServiceUpdate

app = FastAPI()

from chat_assistant import Ai_Assistant

assistant = Ai_Assistant()

# Configure CORSnpm run dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
    expose_headers=["*"] 
)

# Create tables
Base.metadata.create_all(bind=engine)

UPLOAD_DIR = "static/uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    try:
        file_ext = os.path.splitext(upload_file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(destination, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
            
        return file_path
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}"
        )

# Modify the registration endpoint to make documents optional

@app.post("/register/provider/request")
async def register_provider_request(
    full_name: Annotated[str, Form(...)],
    email: Annotated[str, Form(...)],
    password: Annotated[str, Form(...)],
    phone_number: Annotated[Optional[str], Form()] = None,
    address: Annotated[Optional[str], Form()] = None,
    years_experience: Annotated[Optional[int], Form()] = None,
    id_verification: Optional[UploadFile] = File(None),
    certification: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    try:
        # Check if email exists in either User or ProviderRegistrationRequest
        if (db.query(User).filter(User.email == email).first() or
           db.query(ProviderRegistrationRequest).filter(ProviderRegistrationRequest.email == email).first()):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Handle file uploads if provided
        id_path = save_upload_file(id_verification, UPLOAD_DIR) if id_verification else None
        cert_path = save_upload_file(certification, UPLOAD_DIR) if certification else None

        # Create registration request instead of direct User/ServiceProvider
        registration_request = ProviderRegistrationRequest(
            full_name=full_name,
            email=email,
            phone_number=phone_number,
            address=address,
            years_experience=years_experience,
            password_hash=hash_password(password),
            id_verification=id_path,
            certification=cert_path,
            status=RegistrationStatus.PENDING.value,
            requested_at=datetime.utcnow()
        )

        db.add(registration_request)
        db.commit()

        return JSONResponse(
            status_code=201,
            content={
                "message": "Registration request submitted successfully. Please wait for admin approval.",
                "request_id": registration_request.id,
                "needs_documents": not (id_path and cert_path),
                "redirect_to": "/login"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting registration request: {str(e)}"
        )

@app.post("/provider/upload-documents")
async def upload_provider_documents(
    id_verification: UploadFile = File(...),
    certification: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Debug logging - print the entire current_user object
        print(f"Current user: {current_user}")
        print(f"User role: {current_user.role}")
        
        if current_user.role != UserRole.SERVICEPROVIDERS.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only service providers can upload documents"
            )

        # Save documents
        id_path = save_upload_file(id_verification, UPLOAD_DIR)
        cert_path = save_upload_file(certification, UPLOAD_DIR)

        # Update provider record
        provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == current_user.id).first()
        if not provider:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Provider not found"
            )

        provider.id_verification = id_path
        provider.certification = cert_path
        provider.is_verified = False  # Needs admin approval
        
        db.add(provider)
        db.commit()

        return {
            "message": "Documents uploaded successfully. Please wait for admin approval.",
            "provider_id": provider.id,
            "redirect_to": "/dashboard/provider"
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading documents: {str(e)}"
        )

@app.get("/provider/status")
async def check_provider_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.SERVICEPROVIDERS.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only service providers can access this endpoint"
        )
    
    provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == current_user.id).first()
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    return {
        "is_verified": provider.is_verified,
        "needs_documents": not (provider.id_verification and provider.certification)
    }


# Admin Registration Endpoint
@app.post("/register/admin/")
async def register_admin(
    admin_data: AdminCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin)  # Only super admins can create new admins
):
    try:
        # Check if email exists
        if db.query(User).filter(User.email == admin_data.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create base User
        new_user = User(
            email=admin_data.email,
            password_hash=hash_password(admin_data.password),
            full_name=admin_data.full_name,
            role=UserRole.ADMIN.value,
            is_active=True
        )
        db.add(new_user)
        db.flush()  # Flush to get the user ID

        # Create Admin
        new_admin = Admin(
            user_id=new_user.id,
            is_super_admin=admin_data.is_super_admin
        )

        db.add(new_admin)
        db.commit()

        return {
            "message": "Admin created successfully",
            "user_id": new_user.id,
            "admin_id": new_admin.id,
            "is_super_admin": new_admin.is_super_admin
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating admin: {str(e)}"
        )
    
#admin login endpoint
@app.post("/admin/login")
async def admin_login(
    credentials: dict = Body(...),
    db: Session = Depends(get_db)
):
    try:
        email = credentials.get("email")
        password = credentials.get("password")
        is_super_admin = credentials.get("is_super_admin", False)

        if not email or not password:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Email and password are required"
            )

        user = db.query(User).filter(User.email == email).first()
        if not user or user.role != UserRole.ADMIN.value:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials"
            )

        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials"
            )

        # Now this will work because the relationship is properly defined
        if not user.admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not an admin"
            )

        if is_super_admin and not user.admin.is_super_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Super admin privileges required"
            )

        access_token = create_access_token(
            data={
                "sub": user.email,
                "user_id": user.id,
                "role": user.role,
                "is_super_admin": user.admin.is_super_admin
            }
        )
        
        # Determine the appropriate dashboard URL based on admin type
        dashboard_url = "/dashboard/admin/super" if user.admin.is_super_admin else "/dashboard/admin"
        
        return {
            "token": access_token,
            "token_type": "bearer",
            "admin": {
                "id": user.admin.id,
                "email": user.email,
                "full_name": user.full_name,
                "is_super_admin": user.admin.is_super_admin
            },
            "redirect_to": dashboard_url  # Add this line to specify where to redirect
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

#Fetch available admins

@app.get("/admins", response_model=List[AdminResponse])
async def get_all_admins(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin)  # Only super admins can access
):
    """
    Fetch all admin users from the database
    Requires super admin privileges
    """
    try:
        # Query all admin users with their related User information
        admins = db.query(Admin).join(User).all()
        
        return [
            {
                "id": admin.id,
                "email": admin.user.email,
                "full_name": admin.user.full_name,
                "is_super_admin": admin.is_super_admin,
                "created_at": admin.user.created_at
            }
            for admin in admins
        ]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching admins: {str(e)}"
        )

# Admin Approval Endpoints
@app.get("/admin/registration-requests")
async def get_registration_requests(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    try:
        query = db.query(ProviderRegistrationRequest)
        if status:
            query = query.filter(ProviderRegistrationRequest.status == status)
        requests = query.order_by(ProviderRegistrationRequest.requested_at.desc()).all()
        return requests
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching requests: {str(e)}"
        )

# approval endpoint
@app.post("/admin/registration-requests/{request_id}/approve")
async def approve_registration(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    try:
        # Get the registration request
        registration_request = db.query(ProviderRegistrationRequest).filter(
            ProviderRegistrationRequest.id == request_id,
            ProviderRegistrationRequest.status == RegistrationStatus.PENDING.value
        ).first()

        if not registration_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Request not found or already processed"
            )

        # Check if documents are provided
        if not registration_request.id_verification or not registration_request.certification:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot approve provider without ID verification and certification documents"
            )

        # Create base User first
        new_user = User(
            email=registration_request.email,
            password_hash=registration_request.password_hash,
            full_name=registration_request.full_name,
            phone_number=registration_request.phone_number,
            role=UserRole.SERVICEPROVIDERS.value,
            is_active=True
        )
        db.add(new_user)
        db.flush()  # Flush to get the user ID

        # Create ServiceProvider linked to the User
        new_provider = ServiceProvider(
            user_id=new_user.id,
            business_name=registration_request.full_name,
            address=registration_request.address,
            years_experience=registration_request.years_experience,
            id_verification=registration_request.id_verification,
            certification=registration_request.certification,
            is_verified=True,
            verification_date=datetime.utcnow(),
            verification_by=current_user.id
        )

        # Update request status
        registration_request.status = RegistrationStatus.APPROVED.value
        registration_request.processed_at = datetime.utcnow()
        registration_request.processed_by = current_user.id

        db.add(new_provider)
        db.add(registration_request)
        db.commit()

        # Get updated list of pending requests
        pending_requests = db.query(ProviderRegistrationRequest).filter(
            ProviderRegistrationRequest.status == RegistrationStatus.PENDING.value
        ).all()

        return {
            "message": "Registration approved successfully",
            "user_id": new_user.id,
            "provider_id": new_provider.id,
            "updatedRequests": pending_requests  # Return fresh list
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error approving registration: {str(e)}"
        )

# rejection endpoint 
@app.post("/admin/registration-requests/{request_id}/reject")
async def reject_registration(
    request_id: int,
    reason: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    try:
        registration_request = db.query(ProviderRegistrationRequest).filter(
            ProviderRegistrationRequest.id == request_id,
            ProviderRegistrationRequest.status == RegistrationStatus.PENDING.value
        ).first()

        if not registration_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Request not found or already processed"
            )

        registration_request.status = RegistrationStatus.REJECTED.value
        registration_request.rejection_reason = reason
        registration_request.processed_at = datetime.utcnow()
        registration_request.processed_by = current_user.id

        db.add(registration_request)
        db.commit()

        # Get updated list of pending requests
        pending_requests = db.query(ProviderRegistrationRequest).filter(
            ProviderRegistrationRequest.status == RegistrationStatus.PENDING.value
        ).all()

        return {
            "message": "Registration rejected successfully",
            "updatedRequests": pending_requests  # Return fresh list
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error rejecting registration: {str(e)}"
        )

# Homeowner Registration 
@app.post("/register/homeowner/")
async def register_homeowner(
    full_name: Annotated[str, Form(...)],
    email: Annotated[str, Form(...)],
    password: Annotated[str, Form(...)],
    phone_number: Annotated[Optional[str], Form()] = None,
    address: Annotated[Optional[str], Form()] = None,
    db: Session = Depends(get_db)
):
    try:
        if db.query(User).filter(User.email == email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create base User - use lowercase 'homeowner'
        new_user = User(
            email=email,
            password_hash=hash_password(password),
            full_name=full_name,
            phone_number=phone_number,
            role=UserRole.HOMEOWNERS.value,  # Changed to use .value
            is_active=True
        )
        db.add(new_user)
        db.flush()

        # Create HomeOwner
        new_homeowner = HomeOwner(
            user_id=new_user.id,
            address=address
        )

        db.add(new_homeowner)
        db.commit()

        return {
            "message": "Homeowner created successfully",
            "user_id": new_user.id,
            "homeowner_id": new_homeowner.id
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )


# Authentication Endpoints
@app.post("/signin/", response_model=Token)
def signin(
    email: Annotated[str, Form(...)],
    password: Annotated[str, Form(...)],
    role: Annotated[UserRole, Form(...)],
    db: Session = Depends(get_db)
):
    # First check if user exists in registration requests
    registration_request = db.query(ProviderRegistrationRequest).filter(
        ProviderRegistrationRequest.email == email,
        ProviderRegistrationRequest.status == RegistrationStatus.PENDING.value
    ).first()

    if registration_request:
        # Verify password matches the registration request
        if not verify_password(password, registration_request.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password"
            )
        
        # Check if the requested role matches
        if role != UserRole.SERVICEPROVIDERS:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Pending registration is for service provider role only"
            )
        
        # Return limited access token with pending status
        return JSONResponse(
            status_code=200,
            content={
                "access_token": create_access_token(
                    data={
                        "sub": registration_request.email,
                        "temp_user_id": registration_request.id,
                        "role": UserRole.SERVICEPROVIDERS.value,
                        "is_pending": True
                    }
                ),
                "token_type": "bearer",
                "role": UserRole.SERVICEPROVIDERS.value,
                "is_pending": True,
                "needs_documents": not (registration_request.id_verification and registration_request.certification),
                "redirect_to": "dashboard/provider/pending_user",
            }
        )

    # If not in registration requests, check the User table
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify role matches
    if user.role != role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have this role"
        )
    
    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    # For service providers, check verification status
    if role == UserRole.SERVICEPROVIDERS:
        provider = db.query(ServiceProvider).filter(ServiceProvider.user_id == user.id).first()
        if not provider:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Provider record not found"
            )
        
        needs_docs = not (provider.id_verification and provider.certification)
        
        if needs_docs or not provider.is_verified:
            return JSONResponse(
                status_code=200,
                content={
                    "access_token": create_access_token(
                        data={
                            "sub": user.email,
                            "user_id": user.id,
                            "role": user.role
                        }
                    ),
                    "token_type": "bearer",
                    "role": role.value,
                    "user_id": user.id,
                    "redirect_to": "register/upload-documents",
                    "needs_verification": True,
                    "needs_documents": needs_docs
                }
            )
    
    # Generate token with user details
    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role
        }
    )

    # Determine dashboard URL based on role
    dashboard_url = (
        "/dashboard/provider" if role == UserRole.SERVICEPROVIDERS.value
        else "/dashboard/homeowner"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": role.value,
        "user_id": user.id,
        "redirect_to": dashboard_url,
        "documents_verified": False
    }

# Service Endpoints
@app.post("/services/", response_model=ServiceSchema)
async def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Verify the user is a service provider
        if current_user.role != UserRole.SERVICEPROVIDERS.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only service providers can create services"
            )

        # Get the provider record
        provider = db.query(ServiceProvider).filter(
            ServiceProvider.user_id == current_user.id
        ).first()
        
        if not provider:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Provider record not found"
            )

        # Verify provider is approved
        if not provider.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Provider account not yet approved"
            )

        # Create the service
        db_service = Service(
            title=service.title,
            description=service.description,
            price=service.price,
            provider_id=provider.id,
            image=service.image or "/placeholder-service.jpg",  # Default image
            rating=0,  # Default rating
            provider_name=current_user.full_name,
            created_at=datetime.utcnow()
        )
        
        db.add(db_service)
        db.commit()
        db.refresh(db_service)
        
        return db_service
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating service: {str(e)}"
        )
    

@app.patch("/services/{service_id}", response_model=ServiceSchema)
async def update_service(
    service_id: int,
    service_update: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Get the service to update
        db_service = db.query(Service).filter(Service.id == service_id).first()
        if not db_service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )

        # Verify the current user owns this service
        provider = db.query(ServiceProvider).filter(
            ServiceProvider.user_id == current_user.id,
            ServiceProvider.id == db_service.provider_id
        ).first()
        
        if not provider:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to update this service"
            )

        # Update only the fields that were provided
        update_data = service_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_service, field, value)

        db.add(db_service)
        db.commit()
        db.refresh(db_service)
        
        return db_service
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating service: {str(e)}"
        )

@app.get("/services/", response_model=List[ServiceSchema])
async def read_services(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    try:
        services = db.query(Service).offset(skip).limit(limit).all()
        return services  # FastAPI will automatically use ServiceSchema to serialize
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching services: {str(e)}"
        )
    

@app.get("/services/{service_id}", response_model=ServiceSchema)
async def read_service(
    service_id: int,
    db: Session = Depends(get_db)
):
    try:
        service = db.query(Service).filter(Service.id == service_id).first()
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )
        return ServiceSchema.from_orm(service)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching service: {str(e)}"
        )



@app.get("/provider/services", response_model=List[ServiceSchema])
async def get_provider_services(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all services for the current provider
    """
    try:
        # Verify the user is a service provider
        if current_user.role != UserRole.SERVICEPROVIDERS.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only service providers can access this endpoint"
            )

        # Get the provider record
        provider = db.query(ServiceProvider).filter(
            ServiceProvider.user_id == current_user.id
        ).first()
        
        if not provider:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Provider not found"
            )

        # Get all services for this provider
        services = db.query(Service).filter(
            Service.provider_id == provider.id
        ).order_by(Service.created_at.desc()).all()

        return services
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching provider services: {str(e)}"
        )


@app.get("/auth/validate")
async def validate_token(
    current_user: User = Depends(get_current_admin_user)
):
    return {
        "valid": True,
        "user_id": current_user.id,
        "email": current_user.email
    }

@app.get("/auth/validate/user")
async def validate_token(
    current_user: User = Depends(get_current_user)
):
    return {
        "valid": True,
        "user_id": current_user.id,
        "email": current_user.email
    }

@app.get("/admins/me")
async def get_current_admin(
    current_user: User = Depends(get_current_admin_user)
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_super_admin": current_user.admin.is_super_admin
    }

@app.get("/providers")
async def get_providers(
    verified: bool = True,
    limit: int = 6,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    try:
        providers = db.query(ServiceProvider).filter(
            ServiceProvider.is_verified == verified
        ).limit(limit).all()
        
        return [
            {
                "id": p.id,
                "full_name": p.user.full_name,
                "email": p.user.email,
                "phone_number": p.user.phone_number,
                "years_experience": p.years_experience,
                "is_verified": p.is_verified,
                "created_at": p.user.created_at.isoformat()
            }
            for p in providers
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching providers: {str(e)}"
        )

@app.get("/reports")
async def get_reports(
    status: str = "open",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    
    try:
        return []
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching reports: {str(e)}"
        )
    

async def get_current_homeowner(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    if user.role != UserRole.HOMEOWNERS.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only homeowners can access this endpoint"
        )
    
    homeowner = db.query(HomeOwner).filter(HomeOwner.user_id == user.id).first()
    if not homeowner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Homeowner record not found"
        )
    
    return homeowner

# booking endpoint
@app.post("/bookings/", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_homeowner: HomeOwner = Depends(get_current_homeowner)
):
    """
    Create a new booking for a service
    """
    try:
        # Get the service
        service = db.query(Service).filter(
            Service.id == booking_data.service_id,
            Service.is_active == True
        ).first()
        
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )

        # Create the booking
        new_booking = Booking(
            service_id=booking_data.service_id,
            homeowner_id=current_homeowner.id,
            scheduled_date=booking_data.scheduled_date,
            status=BookingStatus.PENDING.value,
            booking_date=datetime.utcnow()
        )
        
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        # Return enriched booking data
        return {
            "id": new_booking.id,
            "service_id": new_booking.service_id,
            "homeowner_id": new_booking.homeowner_id,
            "booking_date": new_booking.booking_date,
            "status": new_booking.status,
            "scheduled_date": new_booking.scheduled_date,
            "completed_date": new_booking.completed_date,
            "service_title": service.title,
            "provider_name": service.provider_name
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating booking: {str(e)}"
        )

@app.get("/bookings/", response_model=List[BookingResponse])
async def get_bookings(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get bookings for the current user
    """
    try:
        query = db.query(Booking)
        
        # Filter by user role
        if current_user.role == UserRole.HOMEOWNERS.value:
            homeowner = db.query(HomeOwner).filter(
                HomeOwner.user_id == current_user.id
            ).first()
            if not homeowner:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Homeowner record not found"
                )
            query = query.filter(Booking.homeowner_id == homeowner.id)
            
        elif current_user.role == UserRole.SERVICEPROVIDERS.value:
            provider = db.query(ServiceProvider).filter(
                ServiceProvider.user_id == current_user.id
            ).first()
            if not provider:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Provider record not found"
                )
            query = query.join(Service).filter(Service.provider_id == provider.id)
        
        # Filter by status if provided
        if status:
            query = query.filter(Booking.status == status)
            
        bookings = query.order_by(Booking.scheduled_date).all()
        
        # Enrich with service info
        result = []
        for booking in bookings:
            service = db.query(Service).filter(Service.id == booking.service_id).first()
            result.append({
                **booking.__dict__,
                "service_title": service.title if service else "Unknown Service",
                "provider_name": service.provider_name if service else "Unknown Provider"
            })
            
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching bookings: {str(e)}"
        )

@app.patch("/bookings/{booking_id}", response_model=BookingResponse)
async def update_booking_status(
    booking_id: int,
    new_status: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update booking status (for providers and homeowners)
    """
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )

        # Verify user has permission to update this booking
        if current_user.role == UserRole.HOMEOWNERS.value:
            homeowner = db.query(HomeOwner).filter(
                HomeOwner.user_id == current_user.id
            ).first()
            if not homeowner or booking.homeowner_id != homeowner.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only update your own bookings"
                )
            # Homeowners can only cancel
            if new_status != BookingStatus.CANCELLED.value:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Homeowners can only cancel bookings"
                )
                
        elif current_user.role == UserRole.SERVICEPROVIDERS.value:
            provider = db.query(ServiceProvider).filter(
                ServiceProvider.user_id == current_user.id
            ).first()
            service = db.query(Service).filter(
                Service.id == booking.service_id,
                Service.provider_id == provider.id if provider else None
            ).first()
            if not service:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only update bookings for your services"
                )
                
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only homeowners and service providers can update bookings"
            )

        # Update status
        booking.status = new_status
        if new_status == BookingStatus.COMPLETED.value:
            booking.completed_date = datetime.utcnow()
            
        db.add(booking)
        db.commit()
        db.refresh(booking)

        # Return enriched booking data
        service = db.query(Service).filter(Service.id == booking.service_id).first()
        return {
            **booking.__dict__,
            "service_title": service.title if service else "Unknown Service",
            "provider_name": service.provider_name if service else "Unknown Provider"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating booking: {str(e)}"
        )
    
# chatAssistant endpoint
@app.post("/chat/", response_model=ChatResponse)
async def chat_with_bot(input: ChatInput):
    """
    Endpoint to interact with the HomeHelp Connect Chat Assistant.
    Receives a user message and returns the chatbot's response.
    """
    try:
        response_text = await assistant.generate_response(input.message)
        return {"response": response_text}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {e}")
    