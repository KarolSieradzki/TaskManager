import json
from celery import Celery
import redis
from datetime import datetime

celery = Celery(
    'app',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

r = redis.Redis(host='localhost', port=6379, db=0)

@celery.task
def send_notification_async(event_type, headline, body, task_data):
    message = {
        "type": "task",
        "event": event_type,
        "headline": headline,
        "body": body,
        "task": task_data,
        "timestamp": datetime.utcnow().isoformat() + "+02:00"
    }
    print(f"[CELERY] Publishing notification: {message}")
    r.publish('notifications', json.dumps(message))
