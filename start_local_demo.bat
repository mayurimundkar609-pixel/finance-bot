@echo off
setlocal
cd /d "%~dp0"
title Personal Finance Advisor Bot
echo ========================================================
echo Starting Personal Finance Advisor Bot
echo ========================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python server.py
    goto end
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    py server.py
    goto end
)

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    node -e "const http=require('http'),fs=require('fs'),path=require('path');const p=path.join(__dirname,'dist');http.createServer((q,s)=>{let f=path.join(p,q.url==='/'?'index.html':q.url);if(!fs.existsSync(f))f=path.join(p,'index.html');fs.createReadStream(f).pipe(s);}).listen(5000,()=>console.log('Running on http://localhost:5000'));require('child_process').exec('start http://localhost:5000');"
    goto end
)

echo [ERROR] Neither Python nor Node.js was found in PATH.
pause

:end
