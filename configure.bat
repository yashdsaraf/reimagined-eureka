@echo off

REM Script control variables
set required_dependencies=node npm mvn java javac docker docker-machine
set machine_name=plugncode
set images=openjdk:8

net session >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  goto docker_ran
)

echo.
call :showLine
echo Checking if dependencies are satisfied..
call :showLine

for %%I in (%required_dependencies%) do (
  echo | set /p="%%I"
  call :isInstalled %%I
)

set "NO_PROMPT=%1"
setx NO_PROMPT "%NO_PROMPT%" >nul

cd server

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
  echo "%%I -- PULLING"
  docker pull %%I
  call :showErrorMsg
)

cd ..

echo. & echo Docker setup done!
if "%NO_PROMPT%" == "" (
  echo. & echo Press enter to continue..
  pause >nul
)

:docker_ran

:: BatchGotAdmin
:-------------------------------------
REM Check for permissions
  if "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
    >nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
  ) else (
    >nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
  )

REM If error flag set, we do not have admin.
if %ERRORLEVEL% NEQ 0 (
  echo Requesting administrative privileges...
  goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
  echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
  set params = %*:"=""
  echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params%", "", "runas", 1 >> "%temp%\getadmin.vbs"

  "%temp%\getadmin.vbs"
  del "%temp%\getadmin.vbs"
  exit /b

:gotAdmin
  pushd "%CD%"
  CD /D "%~dp0"
:--------------------------------------

echo.
call :showLine
echo Installing..
call :showLine

echo | set /p="Angular CLI"
call :ifExists ng
if %ERRORLEVEL% NEQ 0 (
  echo  -- INSTALLING
  call npm install -g @angular/cli
  call :showErrorMsg
) else ( echo  -- INSTALLED )

echo | set /p="Gulp"
call :ifExists gulp
if %ERRORLEVEL% NEQ 0 (
  echo  -- INSTALLING
  call npm install -g gulp
  call :showErrorMsg
) else ( echo  -- INSTALLED )

cd frontend

echo.
call :showLine
echo Running `npm install`..
call :showLine
call npm install
call :showErrorMsg

echo.
call :showLine
echo Building semantic dist files..
call :showLine
call gulp build --gulpfile src/semantic/gulpfile.js --cwd src/semantic
call :showErrorMsg

if defined NO_PROMPT (
  setx NO_PROMPT "" >nul
  goto :eof
)

echo.
call :showLine
echo All done!
call :showLine
echo. & echo Press enter to continue..
pause>nul
goto :eof

:showErrorMsg
  if ERRORLEVEL 0 ( exit /b 0 )
  echo Seems like an error occurred while installing the dependencies
  echo Please try re-running this script
  echo If the issue still persists, please report the issue with all your system details at
  echo https://github.com/yashdsaraf/reimagined-eureka/issues/new
  pause>nul
  (goto) 2>nul & endlocal & exit /b %ERRORLEVEL%

:isInstalled
  call :ifExists %1 && (
    echo  -- INSTALLED
    exit /b 0
  )
  echo Could not find %1
  echo Please install all the required dependencies listed in
  echo https://github.com/yashdsaraf/reimagined-eureka/tree/master/INSTALL.md
  pause>nul
  (goto) 2>nul & endlocal & exit /b %ERRORLEVEL%

:ifExists
  where %1>nul 2>&1
  exit /b %ERRORLEVEL%

:showLine
  echo ========================================
  exit /b
