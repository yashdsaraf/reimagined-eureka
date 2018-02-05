@echo off

echo. & echo Starting the backend...

cd server
mvn clean
mvn spring-boot:run
pause>nul
