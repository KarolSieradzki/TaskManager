from flask import Flask
from .database import db, init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    db.init_app(app)

    from .models import Task
    from .routes.tasks import tasks_bp

    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')

    #seed database 
    init_db(app)

    return app
