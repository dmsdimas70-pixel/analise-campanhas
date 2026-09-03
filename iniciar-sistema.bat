@echo off
title Attribution CRM & Diario de Lojas - Servidor Local
echo ========================================================
echo   INICIANDO ATTRIBUTION CRM NO SEU COMPUTADOR
echo ========================================================
echo.
echo 1. Verificando dependencias...
call npm install
echo.
echo 2. Iniciando servidor do sistema na porta 3000...
start http://localhost:3000
npm run dev
pause
