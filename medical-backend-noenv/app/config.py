from pathlib import Path

basedir = Path(__file__).resolve().parent

class Config:
    # Hardcoded values
    SECRET_KEY = "dev-secret"
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + str(basedir.joinpath("..", "medical.db"))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "dev-jwt-secret"
