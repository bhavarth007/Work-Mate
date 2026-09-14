@echo off
title WorkMate - On-Demand Blue-Collar Labour Platform
echo ======================================================================
echo           WorkMate (वर्कमेट): आपका भरोसेमंद लेबर साथी
echo       On-Demand Blue-Collar Labour Platform (Python + Flutter)
echo ======================================================================
echo.
echo [1/3] Checking Python dependencies...
python -m pip install -q fastapi uvicorn pydantic requests httpx firebase-admin
echo [2/3] Initializing Database and Seeding Initial Mockup Records...
python -c "import backend.app; print('>> Database ready!')"
echo [3/3] Launching WorkMate Server on http://localhost:8069 ...
start http://localhost:8069
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8069 --reload
pause
