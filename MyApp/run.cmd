@echo off
setlocal
set "PYTHON=%~dp0..\.venv\Scripts\python.exe"

if not exist "%PYTHON%" (
    echo Python environment is missing. Follow the MyApp setup in README.md.
    pause
    exit /b 1
)

"%PYTHON%" "%~dp0main.py"
if errorlevel 1 pause
