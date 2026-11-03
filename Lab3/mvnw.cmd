@echo off
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (mvn %*) else (echo Maven is not installed. Install Maven or use IntelliJ IDEA Maven panel. & exit /b 1)
