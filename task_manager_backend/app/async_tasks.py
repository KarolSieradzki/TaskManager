from celery import Celery

celery =  Celery(
    'app',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

@celery.task
def send_notification_async(task_id):
    print(f"Notification: the operation on task {task_id} has been performed.")