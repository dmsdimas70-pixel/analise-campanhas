@echo off
title Criar Executavel Unico Standalone com PyInstaller
echo ========================================================
echo   GERADOR DE EXECUTAVEL STANDALONE (PyInstaller)
echo ========================================================
echo.
echo 1. Instalando PyInstaller...
pip install pyinstaller
echo.
echo 2. Compilando app.py em um unico arquivo app_standalone.exe...
pyinstaller --noconfirm --onedir --console --add-data "data;data" --add-data "outputs;outputs" --name "App_Offline_ML" app.py
echo.
echo ========================================================
echo Concluido! O executavel foi gerado na pasta:
echo   dist\App_Offline_ML\App_Offline_ML.exe
echo ========================================================
pause
