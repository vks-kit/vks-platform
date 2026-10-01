@echo off
rem VKS UI docs launcher: starts the local docs server if needed, then opens it in the browser.
set PORT=5201
set DIST=%~dp0apps\docs\dist
if not exist "%DIST%\index.html" (
  echo Docs not built yet. Building...
  pushd "%~dp0" && call npm run build:docs && popd
)
netstat -ano | findstr /R /C:":%PORT% .*LISTENING" >nul
if errorlevel 1 (
  start "VKS UI docs server" /min cmd /c "cd /d "%DIST%" && python -m http.server %PORT% --bind 127.0.0.1"
  timeout /t 2 /nobreak >nul
)
start "" "http://127.0.0.1:%PORT%/#/docs"
