@echo off
title WorkMate - On-Demand Blue-Collar Labour Platform
echo ======================================================================
echo           WorkMate (वर्कमेट): आपका भरोसेमंद लेबर साथी
echo       On-Demand Blue-Collar Labour Platform (Python + Flutter)
echo ======================================================================
echo.
echo [1/3] Checking Python dependencies...
python -m pip install -q fastapi uvicorn pydantic requests httpx
echo [2/3] Initializing Database and Seeding Initial Mockup Records...
python -c "import backend.app; print('>> Database ready!')"
echo [3/3] Launching WorkMate Server on http://127.0.0.1:8000 ...
start http://127.0.0.1:8000
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
pause
