from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, tickets, admin


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Mini Helpdesk Ticket Management System"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "message": "Helpdesk API is running"
    }