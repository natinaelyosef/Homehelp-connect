from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from auth import hash_password

DATABASE_URL = "postgresql://postgres:12345@localhost:7000/homehelpConnectDB"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def create_tables():
    from models import Base
    Base.metadata.create_all(bind=engine)

def create_admin():
    session = Session()
    try:
        # Check if admin exists - using text() wrapper
        admin_exists = session.execute(
            text("SELECT 1 FROM users WHERE role = 'admin' LIMIT 1")
        ).scalar()
        
        if admin_exists:
            print("Admin already exists")
            return

        # Create admin user - using text() with parameters
        session.execute(
            text("""
                INSERT INTO users 
                (email, password_hash, full_name, role, is_active, created_at)
                VALUES 
                (:email, :password, :name, 'admin', TRUE, NOW())
            """),
            {
                "email": "homehelp@connect.com",
                "password": hash_password("Pass@123"),  # Change this!
                "name": "Super Admin"
            }
    
        )
        # Get the new user's ID - using text()
        user_id = session.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": "homehelp@connect.com"}
        ).scalar()
        
        # Create admin record - using text()
        session.execute(
            text("""
                INSERT INTO admins (user_id, is_super_admin)
                VALUES (:user_id, TRUE)
            """),
            {"user_id": user_id}
        )
        
        session.commit()
        print("Super admin created successfully")
  # Remove in production!
    except Exception as e:
        session.rollback()
        print(f"Error: {str(e)}", file=sys.stderr)
        raise
    finally:
        session.close()

if __name__ == "__main__":
    import sys
    create_tables()
    create_admin()