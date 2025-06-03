from flask import Flask
from flask_cors import CORS
from .database import db, init_db

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object('config.Config')
    db.init_app(app)

    from .routes.tasks import tasks_bp
    from .error_handlers import register_error_handlers

    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    register_error_handlers(app)

    #seed database 
    init_db(app)

    return app
