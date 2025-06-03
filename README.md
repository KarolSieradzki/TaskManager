# Task Manager – Full Stack Exercise

## Overview

This project is a full-stack task management application with a modern architecture. It demonstrates:

- **Asynchronous notifications** using Flask, Celery, and Redis.
- **Real-time updates** to the Angular frontend via a Node.js WebSocket bridge.
- **Advanced RxJS integration** for efficient, reactive data filtering and merging in the UI.

---

## How to Run

You can start the entire stack with a single command:
```
run_all.bat
```


This script will:
- **Shutdown any running Redis server** (to avoid port conflicts).
- **Start Redis** in a new terminal window.
- **Start Celery worker** for asynchronous tasks.
- **Start Flask backend** (API).
- **Start Node.js WebSocket bridge** (for real-time notifications).
- **Start Angular frontend** (development server).

**Requirements:**  
- Python 3.8+  
- Node.js & npm  
- Redis  
- All dependencies installed (`pip install -r requirements.txt`, `npm install` in frontend and Node.js bridge directories)

---

## Architecture

[Angular Frontend] <--WebSocket--> [Node.js Bridge] <--Redis Pub/Sub--> [Flask API] <---> [Celery Worker]
|
[Database]


- **Flask**: Provides the REST API for CRUD operations on tasks.
- **Celery**: Handles all notification-sending tasks asynchronously, so the main thread is never blocked.
- **Redis**: Acts as both Celery broker and Pub/Sub channel for notifications.
- **Node.js Bridge**: Listens to Redis notifications and pushes them to all connected Angular clients via WebSocket.
- **Angular**: Displays tasks, allows full CRUD, and shows real-time notifications and advanced filtering.

---

## Asynchronous Notification (Backend)

- When a task is created, updated, or deleted, Flask triggers a Celery task (`send_notification_async`).
- Celery publishes a notification event to a Redis channel (e.g., `notifications`).
- Node.js bridge listens to this channel and forwards the event to all Angular clients via WebSocket.
- This ensures the main Flask thread is never blocked by notification logic, even under heavy load.

**Example Celery task:**
```
@celery.task
def send_notification_async(task_id, event_type):
message = {'task_id': task_id, 'event': event_type}
r.publish('notifications', json.dumps(message))
```



---

## RxJS Integration (Conceptual)

- **Data from backend:**  
  The Angular app fetches the full list of tasks from the Flask API as an Observable (`tasks$`).
- **Mixing with other data:**  
  The app maintains a reactive list of “favorite” tasks in localStorage, exposed as a `BehaviorSubject<number[]>` (`favoriteTaskIds$`).
- **Reactive filtering:**  
  All filtering (search, status, assigned user, favorites) is handled by combining `tasks$`, `favoriteTaskIds$`, and a reactive filter form using `combineLatest` from RxJS.
- **Efficient, performant:**  
  All filtering is done in-memory, reactively, with no extra HTTP requests. UI updates instantly on any change.

**Example RxJS integration:**
```
filteredTasks$ = combineLatest([
this.tasks$,
this.favoriteTaskIds$,
this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
]).pipe(
map(([tasks, favoriteIds, filters]) => {
return tasks
.filter(task => !filters.favoriteOnly || favoriteIds.includes(task.id))
.filter(task => !filters.status || task.status === filters.status)
.filter(task => !filters.assigned_to || (task.assigned_to || '').toLowerCase().includes(filters.assigned_to.toLowerCase()))
.filter(task => !filters.search || (task.title?.toLowerCase().includes(filters.search.toLowerCase()) || task.description?.toLowerCase().includes(filters.search.toLowerCase())));
})
);
```




---

## Technology Choices – Why These?

- **Flask**: Lightweight, fast to develop, and integrates easily with SQLAlchemy and Celery.
- **Celery**: Industry-standard for Python background tasks; handles async notifications robustly and efficiently.
- **Redis**: Reliable in-memory store for both Celery broker and Pub/Sub, with minimal configuration.
- **Node.js Bridge**: Simple way to push real-time events from Redis to Angular via WebSocket, decoupling backend and frontend.
- **Angular + RxJS**: Enables highly reactive, efficient UI with advanced filtering, merging, and instant feedback for the user.

---

## Random Data for Verification

- The backend seeds the database with random tasks on startup.
- You can modify `seed_data()` in `database.py` to add more sample tasks for testing.

---

## How Requirements Are Met

- **Asynchronous notifications:**  
  All notifications are sent via Celery, never blocking the main API thread.
- **RxJS Integration:**  
  Task data from the backend is merged with local data (favorites) and filtered in a single, efficient RxJS stream.
- **User Interaction:**  
  Angular frontend provides CRUD, advanced filtering, and real-time notifications.
- **Easy to verify:**  
  - Create/update/delete tasks in the UI and see instant notifications.
  - Mark tasks as favorites and filter for them.
  - Use search, status, and assigned user filters to test RxJS logic.

---

