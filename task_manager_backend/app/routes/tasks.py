from flask import Blueprint, request, jsonify, abort
from datetime import datetime
from werkzeug.exceptions import BadRequest
from ..models import Task
from ..database import db
from ..async_tasks import send_notification_async

tasks_bp = Blueprint('tasks', __name__)

def parse_datetime(dt_str):
    if not dt_str:
        return None
    try:
        return datetime.fromisoformat(dt_str)
    except (TypeError, ValueError):
        raise BadRequest("Invalid date format. Use YYYY-MM-DDTHH:MM:SS")

def validate_task_data(data, require_title=True):
    if not data:
        raise BadRequest("Missing JSON body.")
    if require_title and not data.get('title'):
        raise BadRequest("Field 'title' is required.")
    if 'title' in data and len(data['title']) > 120:
        raise BadRequest("Field 'title' must be at most 120 characters.")
    if 'priority' in data and data['priority'] not in (None, 'low', 'medium', 'high'):
        raise BadRequest("Field 'priority' must be one of: low, medium, high.")

@tasks_bp.route('/', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'status': t.status,
        'priority': t.priority,
        'due_date': t.due_date.isoformat() if t.due_date else None,
        'assigned_to': t.assigned_to,
        'created_at': t.created_at.isoformat(),
        'updated_at': t.updated_at.isoformat()
    } for t in tasks])

@tasks_bp.route('/', methods=['POST'])
def create_task():
    data = request.get_json()
    validate_task_data(data)

    due_date = parse_datetime(data.get('due_date'))
    task = Task(
        title=data['title'],
        description=data.get('description'),
        status=data.get('status', 'todo'),
        priority=data.get('priority'),
        due_date=due_date,
        assigned_to=data.get('assigned_to')
    )

    db.session.add(task)
    db.session.commit()
    send_notification_async.delay(task.id)
    return jsonify({'id': task.id}), 201

@tasks_bp.route('/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'priority': task.priority,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'assigned_to': task.assigned_to,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    })

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    validate_task_data(data, require_title=False)
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data:
        task.status = data['status']
    if 'priority' in data:
        task.priority = data['priority']
    if 'due_date' in data:
        task.due_date = parse_datetime(data['due_date'])
    if 'assigned_to' in data:
        task.assigned_to = data['assigned_to']
    db.session.commit()
    send_notification_async.delay(task.id)
    return jsonify({'message': 'Task updated'})

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    send_notification_async.delay(task.id)
    return jsonify({'message': 'Task deleted'})
