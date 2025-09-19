# Medical Backend (Flask + SQLite, no environment variables)
This repository is a ready-to-run Flask + SQLite backend to pair with the `medical-frontend` React/Vite project.

## Features
- Flask + SQLAlchemy (SQLite by default)
- Flask-Migrate (database migrations)
- JWT auth (Flask-JWT-Extended)
- Password hashing (werkzeug.security)
- CORS enabled for frontend
- Blueprints for `auth`, `users`, and `appointments`

## Quick start
1. Create and activate a Python virtualenv.
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Initialize database (optional migrations):
   ```
   flask db init
   flask db migrate -m "initial"
   flask db upgrade
   ```
   Or just run `python run.py` — the app will auto-create the SQLite DB.
4. Run the app:
   ```
   python run.py
   ```
5. API base: `http://localhost:5000/`
