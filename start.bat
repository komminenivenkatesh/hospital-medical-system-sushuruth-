@echo off
title Sushruth Healthcare - Full Stack Launcher
echo ========================================================
echo   Starting Sushruth (Database + ML + Backend + Frontend)
echo ========================================================
echo.

:: 1. Check and Start MongoDB service
echo [*] Checking MongoDB Service...
powershell -Command "Start-Service MongoDB -ErrorAction SilentlyContinue"

:: 2. Launch ML Service, Backend, and Frontend via npm start
echo [*] Launching ML Service (:5001), Backend (:5000), Frontend (:5175)...
npm run start

pause
