from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def seed_data():
    from .models import Task
    from datetime import datetime

    db.session.query(Task).delete()
    tasks = [
        Task(
            title="Task 1",
            description="Description of task 1",
            status="todo",
            priority="high",
            due_date=datetime(2025, 6, 10, 12, 0),
            assigned_to="Alice"
        ),
        Task(
            title="Task 2",
            description="Description of task 2",
            status="in_progress",
            priority="medium",
            due_date=datetime(2025, 6, 15, 15, 30),
            assigned_to="Bob"
        ),
        Task(
            title="Task 3",
            description="Description of task 3",
            status="done",
            priority="low",
            due_date=datetime(2025, 6, 20, 9, 0),
            assigned_to="Charlie"
        ),
        Task(
            title="Task 4",
            description="Description of task 4",
            status="todo",
            priority="medium",
            due_date=datetime(2025, 6, 25, 17, 45),
            assigned_to="Diana"
        ),
        Task(
            title="Task 5",
            description="Description of task 5",
            status="in_progress",
            priority="high",
            due_date=datetime(2025, 6, 30, 11, 15),
            assigned_to="Eve"
        ),
        Task(
            title="Task 6",
            description="Description of task 6",
            status="done",
            priority="medium",
            due_date=datetime(2025, 7, 5, 14, 0),
            assigned_to="Frank"
        ),
        Task(
            title="Task 7",
            description="Description of task 7",
            status="todo",
            priority="low",
            due_date=datetime(2025, 7, 10, 10, 30),
            assigned_to="Grace"
        ),
    ]
    db.session.bulk_save_objects(tasks)
    db.session.commit()


def init_db(app):
    with app.app_context():
        db.drop_all()
        db.create_all()
        seed_data()
