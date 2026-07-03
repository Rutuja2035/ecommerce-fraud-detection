@echo off
cd /d "%~dp0..\backend"
if not exist venv (
  py -m venv venv 2>nul || python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
python -m app.ml.train
echo Backend ready. Run: uvicorn app.main:app --reload
