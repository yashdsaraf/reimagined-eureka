@echo off

REM Script control variables
set machine_name=plugncode
set images=openjdk:8 python:3 php:7.0-cli ruby:2

echo.
call :showLine
echo Checking docker setup..
call :showLine

echo. & echo Checking if machine already exists
docker-machine ls | findstr %machine_name% >nul
if %ERRORLEVEL% NEQ 0 (
  echo. & echo Creating new machine %machine_name%
  docker-machine create plugncode --driver="virtualbox"
  call :showErrorMsg
)

echo. & echo Checking if machine is running
docker-machine ls | findstr %machine_name% | findstr /I "running" >nul
if %ERRORLEVEL% NEQ 0 (
  echo. & echo Starting machine %machine_name%
  docker-machine start plugncode
  call :showErrorMsg
)

REM Setting up environment for machine
@FOR /f "tokens=*" %%i IN ('docker-machine env %machine_name%') DO @%%i
call :showErrorMsg

echo.
call :showLine
echo Pulling docker images..
call :showLine

for %%I in (%images%) do (
  echo. & echo %%I -- PULLING
  docker pull %%I
  call :showErrorMsg
)

echo. & echo Docker setup done!
goto :eof

:showErrorMsg
  if ERRORLEVEL 0 ( exit /b 0 )
  echo Seems like an error occurred while installing the dependencies
  echo Please try re-running this script
  echo If the issue still persists, please report the issue with all your system details at
  echo https://github.com/yashdsaraf/reimagined-eureka/issues/new
  pause>nul
  (goto) 2>nul & endlocal & exit /b %ERRORLEVEL%

:showLine
  echo ========================================
  exit /b
