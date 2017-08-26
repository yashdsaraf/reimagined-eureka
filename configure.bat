@echo off

:: BatchGotAdmin
:-------------------------------------
rem Check for permissions
    if "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) else (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

rem If error flag set, we do not have admin.
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

rem Check for necessary dependencies and install them as needed

for %%I in (node npm gem mvn java javac) do (
    echo Checking if %%I exists in the system...
    call :isInstalled %%I
)

echo. & echo Installing the required dependencies..

echo. & echo Angular CLI
call :ifExists ng && ng --version | find "@angular/cli">nul
if %errorlevel% NEQ 0 (
    echo Installing angular-cli
    npm install -g @angular/cli
    call :showErrorMsg
)

echo. & echo SASS
call :ifExists sass || (
    echo Installing sass
    gem install sass
    call :showErrorMsg
)

echo. & echo Running npm-install
cd plug-n-code
npm install
call :showErrorMsg

cd ../server
rem TODO: install server dependencies
rem mvn install:install-file -Dfile=lib/ojdbc6.jar -DgroupId=com.oracle -DartifactId=ojdbc6 -Dversion=11.2.0 -Dpackaging=jar

echo. & echo All done!
pause>nul
goto :eof

:showErrorMsg
    if '%errorlevel%' EQU 0 exit /b 0
    echo Seems like an error occurred while installing the dependencies
    echo Please try re-running this script
    echo If the issue still persists, please report the issue with all your system details at
    echo https://github.com/yashdsaraf/reimagined-eureka/issues/new
    pause>nul
    (goto) 2>nul & endlocal & exit /b %errorlevel%

:isInstalled
    call :ifExists %1 && exit /b 0
    echo Could not find %1
    echo Please install all the required dependencies listed in
    echo https://github.com/yashdsaraf/reimagined-eureka/tree/master/INSTALL.md
    pause>nul
    (goto) 2>nul & endlocal & exit /b %errorlevel%

:ifExists
    where %1>nul 2>&1
    exit /b %errorlevel%
