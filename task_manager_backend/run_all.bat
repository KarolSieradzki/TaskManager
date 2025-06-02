@echo off

REM Start Redis server in a new terminal window
start cmd /k "redis-server"

REM Wait a moment to make sure Redis is ready
timeout /t 2

REM Start Celery worker in a new terminal window
start cmd /k "celery -A app.async_tasks worker --loglevel=info -P eventlet"

REM Wait a moment to make sure Celery connects to Redis
timeout /t 2

REM Start Flask application in the current window
set FLASK_APP=run.py
set FLASK_ENV=development
python run.py
