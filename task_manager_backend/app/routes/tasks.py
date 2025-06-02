from flask import Blueprint, request, jsonify
from ..models import Task
from ..database import db
from ..async_tasks import send_notification_async

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/', methods=['GET'])
def get_tasks():
    pass

@tasks_bp.route('/', methods=['POST'])
def create_task():
    pass
