from celery import Celery
from flask import current_app

celery = Celery(__name__)

@celery.task
def send_notification_async(task_id):
    pass