from backend.database import SessionLocal, engine, Base
from backend.models import User
from backend.auth import get_password_hash

def seed_demo_users():
    db = SessionLocal()
    
    users = [
        {
            "name": "Super Admin (Vignan)",
            "email": "admin@vignan.ac.in",
            "password": "password123",
            "role": "admin"
        },
        {
            "name": "Vignan Administrator",
            "email": "vignan",
            "password": "password123",
            "role": "admin"
        },
        {
            "name": "Admin User",
            "email": "admin",
            "password": "password123",
            "role": "admin"
        },
        {
            "name": "Dr. V. Rao (NAAC Auditor)",
            "email": "auditor@naac.gov.in",
            "password": "password123",
            "role": "auditor"
        },
        {
            "name": "Prof. S. Nehra (Faculty)",
            "email": "faculty@vignan.ac.in",
            "password": "password123",
            "role": "faculty"
        }
    ]

    for u in users:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if not existing:
            new_user = User(
                name=u["name"],
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                role=u["role"]
            )
            db.add(new_user)
            print(f"Created user: {u['email']} ({u['role']})")
        else:
            print(f"User exists: {u['email']}")

    db.commit()
    db.close()

if __name__ == "__main__":
    seed_demo_users()
