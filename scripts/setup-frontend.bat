@echo off
cd /d "%~dp0..\frontend"
call npm install
echo Frontend ready. Run: npm run dev
