#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void SetWorkingDirToExePath() {
    char exePath[MAX_PATH];
    if (GetModuleFileNameA(NULL, exePath, MAX_PATH)) {
        char *lastSlash = strrchr(exePath, '\\');
        if (lastSlash) {
            *lastSlash = '\0';
            SetCurrentDirectoryA(exePath);
        }
    }
}

int FileExists(const char *path) {
    DWORD dwAttrib = GetFileAttributesA(path);
    return (dwAttrib != INVALID_FILE_ATTRIBUTES && !(dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

int DirExists(const char *path) {
    DWORD dwAttrib = GetFileAttributesA(path);
    return (dwAttrib != INVALID_FILE_ATTRIBUTES && (dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

int main() {
    SetConsoleTitleA("Meu App Offline Portable - ML & Analytics");
    SetWorkingDirToExePath();

    printf("=================================================================\n");
    printf("     APLICATIVO OFFLINE & PORTATIL (EXECUTAVEL PORTABLE .EXE)    \n");
    printf("=================================================================\n\n");

    char pythonCmd[MAX_PATH + 32] = "";
    int isPortable = 0;

    // 1. Verifica se existe Python Embutido/Portátil na pasta local (Ex: pendrive)
    if (FileExists("python\\python.exe")) {
        strcpy(pythonCmd, "\"python\\python.exe\"");
        isPortable = 1;
        printf("[MODO PORTATIL] Python Embutido detectado em: python\\python.exe\n");
        printf("[INFO] Executando de forma 100%% independente, sem instalacao no Windows!\n\n");
    } 
    // 2. Verifica se existe ambiente virtual local portátil
    else if (FileExists(".venv\\Scripts\\python.exe")) {
        strcpy(pythonCmd, "\".venv\\Scripts\\python.exe\"");
        isPortable = 1;
        printf("[MODO PORTATIL] Ambiente local detectado em: .venv\\Scripts\\python.exe\n\n");
    } 
    else if (FileExists("env\\Scripts\\python.exe")) {
        strcpy(pythonCmd, "\"env\\Scripts\\python.exe\"");
        isPortable = 1;
        printf("[MODO PORTATIL] Ambiente local detectado em: env\\Scripts\\python.exe\n\n");
    }
    // 3. Fallback: Python instalado no sistema Windows
    else if (system("python --version >nul 2>&1") == 0) {
        strcpy(pythonCmd, "python");
        printf("[MODO SISTEMA] Python detectado no sistema operacional Windows.\n\n");
    }
    else if (system("py -3 --version >nul 2>&1") == 0) {
        strcpy(pythonCmd, "py -3");
        printf("[MODO SISTEMA] Python Launcher (py -3) detectado no Windows.\n\n");
    }

    // Se nenhum Python for encontrado
    if (strlen(pythonCmd) == 0) {
        printf("[ERRO] Nao foi possivel localizar o Python para execucao.\n\n");
        printf("COMO RODAR DE FORMA 100%% PORTATIL:\n");
        printf("1. Execute o script 'preparar_portable_pendrive.bat' nesta pasta.\n");
        printf("   Ele baixa o Python portatil oficial e deixa a pasta 100%% autonoma!\n");
        printf("OU\n");
        printf("2. Instale o Python (versao 3.10+) em https://www.python.org/downloads/\n");
        printf("   (Lembre-se de marcar a opcao 'Add python.exe to PATH').\n\n");

        MessageBoxA(NULL,
            "Python nao encontrado.\n\nPara rodar 100% portatil (sem instalar nada):\nExecute o arquivo 'preparar_portable_pendrive.bat' nesta pasta.\n\nOu instale o Python em python.org marcando 'Add to PATH'.",
            "Modo Portatil - Meu App Offline",
            MB_ICONWARNING | MB_OK);

        system("pause");
        return 1;
    }

    printf("[1/3] Interpretador pronto: %s\n", pythonCmd);

    // Se não for o python embutido já preparado, garante dependências do requirements.txt
    if (!isPortable) {
        printf("[2/3] Verificando dependencias locais (requirements.txt)...\n");
        char pipCmd[MAX_PATH + 64];
        snprintf(pipCmd, sizeof(pipCmd), "%s -m pip install -q -r requirements.txt", pythonCmd);
        system(pipCmd);
    } else {
        printf("[2/3] Dependencias portateis prontas no disco local.\n");
    }

    printf("[3/3] Iniciando o servidor local offline em http://localhost:7860 ...\n");
    printf("-----------------------------------------------------------------\n");
    printf(">>> APLICATIVO PORTATIL RODANDO 100%% OFFLINE <<<\n");
    printf(">>> Para fechar o programa com seguranca, pressione CTRL+C <<<\n");
    printf("-----------------------------------------------------------------\n\n");

    // Abre o navegador padrão automaticamente
    system("start http://localhost:7860");

    // Executa app.py
    char runCmd[MAX_PATH + 64];
    snprintf(runCmd, sizeof(runCmd), "%s app.py", pythonCmd);
    int exitCode = system(runCmd);

    if (exitCode != 0) {
        printf("\nO processo encerrou com codigo: %d\n", exitCode);
        system("pause");
    }

    return exitCode;
}

