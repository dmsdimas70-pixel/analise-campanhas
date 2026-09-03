@echo off
setlocal enabledelayedexpansion
title Criar Pacote 100%% Portatil para Pendrive (Sem Instalador)
echo ====================================================================
echo   CRIADOR DE PACOTE 100%% PORTATIL (PENDRIVE / USB / QUALQUER PC)
echo ====================================================================
echo.
echo Este script prepara este aplicativo para rodar em qualquer computador
echo Windows, mesmo que o computador de destino NAO TENHA PYTHON INSTALADO!
echo.
echo Escolha como deseja preparar a versao portatil:
echo [1] Criar ambiente portatil local (.venv) usando o Python atual da sua maquina
echo [2] Baixar Python Embeddable oficial (3.11 64-bit) para a pasta python\ (Zero dependencias)
echo [3] Sair
echo.
set /p opcao="Digite a opcao desejada (1 ou 2): "

if "%opcao%"=="1" (
    echo.
    echo Criando ambiente virtual portatil em .venv ...
    python -m venv .venv
    if errorlevel 1 (
        echo [ERRO] Falha ao criar ambiente virtual com 'python'. Tentando 'py -3'...
        py -3 -m venv .venv
    )
    if exist ".venv\Scripts\python.exe" (
        echo Instalando dependencias portateis em .venv ...
        .venv\Scripts\python.exe -m pip install --upgrade pip
        .venv\Scripts\python.exe -m pip install -r requirements.txt
        echo.
        echo ====================================================================
        echo SUCESSO! A pasta .venv foi configurada com sucesso.
        echo Agora basta copiar esta pasta para um PENDRIVE e dar 2 cliques em:
        echo    iniciar_programa.exe  (ou MeuAppPortable.exe)
        echo ====================================================================
    ) else (
        echo [ERRO] Nao foi possivel criar o ambiente virtual.
    )
    goto fim
)

if "%opcao%"=="2" (
    echo.
    echo Baixando Python Windows 64-bit Embeddable oficial...
    powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.9/python-3.11.9-embed-amd64.zip' -OutFile 'python_embed.zip'"
    if exist "python_embed.zip" (
        echo Extraindo para a pasta python\ ...
        powershell -Command "Expand-Archive -Path 'python_embed.zip' -DestinationPath 'python' -Force"
        del python_embed.zip
        
        echo Ativando suporte a pacotes no Python embutido...
        powershell -Command "$file = Get-Item 'python\*._pth'; (Get-Content $file) -replace '#import site', 'import site' | Set-Content $file"

        echo Baixando instalador de pacotes pip...
        powershell -Command "Invoke-WebRequest -Uri 'https://bootstrap.pypa.io/get-pip.py' -OutFile 'python\get-pip.py'"
        python\python.exe python\get-pip.py --no-warn-script-location
        del python\get-pip.py

        echo Instalando dependencias offline no Python portatil...
        python\python.exe -m pip install -r requirements.txt --no-warn-script-location

        echo.
        echo ====================================================================
        echo PACOTE 100%% PORTATIL CRIADO COM SUCESSO!
        echo A pasta agora contem seu proprio Python independente na pasta python\
        echo Voce pode mover esta pasta para QUALQUER PC ou PENDRIVE!
        echo Para rodar em qualquer lugar, basta dar 2 cliques em:
        echo    iniciar_programa.exe
        echo ====================================================================
    ) else (
        echo [ERRO] Falha no download do pacote Python Embeddable.
    )
    goto fim
)

:fim
echo.
pause
