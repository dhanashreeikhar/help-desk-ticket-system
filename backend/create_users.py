from app.database import SessionLocal
from app.models import User
from app.auth import hash_password


db = SessionLocal()


users = [
    {
        "username": "admin",
        "password": "admin123",
        "role": "admin"
    },
    {
        "username": "john",
        "password": "john123",
        "role": "support"
    },
    {
        "username": "jane",
        "password": "jane123",
        "role": "support"
    }
]


for user_data in users:

    existing_user = db.query(User).filter(
        User.username == user_data["username"]
    ).first()

    if not existing_user:

        user = User(
            username=user_data["username"],
            password=hash_password(user_data["password"]),
            role=user_data["role"]
        )

        db.add(user)

        print(
            f"Created user: {user_data['username']}"
        )

    else:

        print(
            f"User already exists: {user_data['username']}"
        )


db.commit()
db.close()

print("Users created successfully!")