@echo off
title Meu App Offline
echo ======================================
echo Verificando e instalando dependencias...
echo ======================================
pip install -r requirements.txt
echo.
echo ======================================
echo Iniciando o aplicativo offline...
echo Abra http://localhost:7860 no navegador
echo ======================================
python app.py
pause
