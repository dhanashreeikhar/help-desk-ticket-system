# Mini Helpdesk Ticket Management System

## Technologies

Frontend:
React.js

Backend:
FastAPI

Database:
SQLite

Authentication:
JWT

## Requirements

Python
Node.js
Git

## Backend Setup

cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python seed.py

uvicorn app.main:app --reload

## Frontend Setup

cd frontend

npm install

npm run dev

## Test Accounts

Admin:
username: admin
password: admin123

Support:
username: john
password: john123

Support:
username: jane
password: jane123

## URLs

Frontend:
http://localhost:5173

Backend:
http://localhost:8000

Swagger:
http://localhost:8000/docs
