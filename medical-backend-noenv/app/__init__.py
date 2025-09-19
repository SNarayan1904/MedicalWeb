from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors
from .models import User, Appointment

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})

    # register blueprints
    from .auth.routes import auth_bp
    from .users.routes import users_bp
    from .appointments.routes import appt_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(appt_bp)

    @app.route('/')
    def index():
        return {'msg': 'Medical backend running'}

    return app
