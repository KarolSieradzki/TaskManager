from flask import Flask
from .database import db, init_db
from .routes.tasks import tasks_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    db.init_app(app)
    init_db(app)
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    return app