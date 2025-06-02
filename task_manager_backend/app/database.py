from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def seed_data():
    from .models import Task
    db.session.query(Task).delete()
    tasks = [
        Task(title="Task 1", description="Description of task 1", status="todo", priority="high"),
        Task(title="Task 2", description="Description of task 2", status="in_progress", priority="medium"),
    ]
    db.session.bulk_save_objects(tasks)
    db.session.commit()

def init_db(app):
    with app.app_context():
        db.drop_all()
        db.create_all()
        seed_data()
