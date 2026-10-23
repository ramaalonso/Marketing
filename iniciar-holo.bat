@echo off
title Yerbazo Holo IA - Estudio de Marketing Autonomo
cd /d "%~dp0"
echo ========================================================
echo   YERBAZO HOLO IA - MARKETING STUDIO (PORT 3002)
echo ========================================================
start "" "http://localhost:3002"
node server.js
pause
