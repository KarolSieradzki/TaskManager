@echo off

REM --- Shutdown any running Redis server before starting a new one ---
echo Shutting down any running Redis server...
start /wait cmd /c "echo shutdown | redis-cli"

REM Wait a moment to ensure Redis is fully stopped
timeout /t 2

REM --- Start Redis server in a new terminal window ---
echo Starting Redis server...
start cmd /k "redis-server"

REM Wait to ensure Redis is ready
timeout /t 2

REM --- Start Celery worker in a new terminal window ---
echo Starting Celery worker...
start cmd /k "celery -A app.async_tasks worker --loglevel=info -P eventlet"

REM Wait to ensure Celery connects to Redis
timeout /t 2

REM --- Start Flask backend in a new terminal window ---
echo Starting Flask backend...
set FLASK_APP=run.py
set FLASK_ENV=development
start cmd /k "python run.py"

REM Wait to ensure Flask is up
timeout /t 2

REM --- Start Node.js WebSocket bridge in a new terminal window ---
echo Starting Node.js WebSocket bridge...
cd ../task-manager
start cmd /k "node server.js"
cd ../frontend

REM Wait to ensure Node.js bridge is running
timeout /t 2

REM --- Start Angular application in a new terminal window ---
echo Starting Angular app...
start cmd /k "ng serve"

REM --- All services started ---
echo All services have been started!
