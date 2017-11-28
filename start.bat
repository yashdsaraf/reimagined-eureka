@echo off

echo. & echo Starting the frontend...

start "FRONTEND" cmd /c "cd frontend & npm start & pause>nul"

echo. & echo Starting the backend...

start "BACKEND" cmd /c "cd server & mvn spring-boot:run & pause>nul"

echo. & echo You can close this window now...
pause>nul
goto :eof

:showErrorMsg
  if ERRORLEVEL 0 ( exit /b 0 )
  echo Seems like an error occurred while starting the app
  echo Please try re-running this script after running configure.bat
  echo If the issue still persists, please report the issue with all your system details at
  echo https://github.com/yashdsaraf/reimagined-eureka/issues/new
  pause>nul
  (goto) 2>nul & endlocal & exit /b %ERRORLEVEL%
