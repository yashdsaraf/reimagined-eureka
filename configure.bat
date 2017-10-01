@echo off

:: BatchGotAdmin
:-------------------------------------
REM Check for permissions
  if "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
    >nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
  ) else (
    >nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
  )

REM If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
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

echo. & echo Checking for required binaries..
call :showLine

for %%I in (node npm mvn java javac) do (
  echo | set /p="%%I"
  call :isInstalled %%I
)

echo. & echo Installing the required dependencies..
call :showLine

echo | set /p="Angular CLI"
call :ifExists ng && ng --version | find "@angular/cli">nul
if %errorlevel% NEQ 0 (
  echo Installing angular-cli
  call npm install -g @angular/cli
  call :showErrorMsg
) else ( echo  -- INSTALLED )

echo | set /p="Gulp"
call :ifExists gulp
if %errorlevel% NEQ 0 (
  echo Installing gulp
  call npm install -g gulp
  call :showErrorMsg
) else ( echo  -- INSTALLED )

cd plug-n-code

echo. & echo Running `npm install`..
call :showLine
call npm install
call :showErrorMsg

echo. & echo Building semantic dist files..
call :showLine
call gulp build --gulpfile src/semantic/gulpfile.js --cwd src/semantic
call :showErrorMsg

cd ..

REM TODO: install server dependencies
REM mvn install:install-file -Dfile=lib/ojdbc6.jar -DgroupId=com.oracle -DartifactId=ojdbc6 -Dversion=11.2.0 -Dpackaging=jar

echo. & echo All done!
pause>nul
goto :eof

:showErrorMsg
  if %errorlevel% EQU 0 ( exit /b 0 )
  echo Seems like an error occurred while installing the dependencies
  echo Please try re-running this script
  echo If the issue still persists, please report the issue with all your system details at
  echo https://github.com/yashdsaraf/reimagined-eureka/issues/new
  pause>nul
  (goto) 2>nul & endlocal & exit /b %errorlevel%

:isInstalled
  call :ifExists %1 && (
    echo  -- INSTALLED
    exit /b 0
  )
  echo Could not find %1
  echo Please install all the required dependencies listed in
  echo https://github.com/yashdsaraf/reimagined-eureka/tree/master/INSTALL.md
  pause>nul
  (goto) 2>nul & endlocal & exit /b %errorlevel%

:ifExists
  where %1>nul 2>&1
  exit /b %errorlevel%

:showLine
  echo ====================================
  exit /b
