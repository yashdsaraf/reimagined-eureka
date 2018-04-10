@echo off

start "FRONTEND" cmd /K ".\start-frontend.bat"
start "BACKEND" cmd /K ".\start-server.bat"
