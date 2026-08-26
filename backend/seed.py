from app.database import SessionLocal, engine, Base
from app.models import User
from app.auth import hash_password


Base.metadata.create_all(bind=engine)

db = SessionLocal()


users = [
    User(
        username="admin",
        password=hash_password("admin123"),
        role="admin"
    ),
    User(
        username="john",
        password=hash_password("john123"),
        role="support"
    ),
    User(
        username="jane",
        password=hash_password("jane123"),
        role="support"
    )
]


for user in users:
    existing = db.query(User).filter(
        User.username == user.username
    ).first()

    if not existing:
        db.add(user)


db.commit()
db.close()

print("Users created successfully.")