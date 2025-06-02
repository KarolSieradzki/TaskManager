from celery import Celery

celery = Celery(__name__)

@celery.task
def send_notification_async(task_id):
    print(f"Notification: the operation on task {task_id} has been performed.")