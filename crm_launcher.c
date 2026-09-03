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

int CheckNodeInstalled() {
    int res = system("node --version >nul 2>&1");
    return (res == 0);
}

int main() {
    SetConsoleTitleA("Attribution CRM & Diario de Lojas - Servidor Local");
    SetWorkingDirToExePath();

    printf("=================================================================\n");
    printf("        INICIANDO ATTRIBUTION CRM (EXECUTAVEL WINDOWS)           \n");
    printf("=================================================================\n\n");

    if (!CheckNodeInstalled()) {
        printf("[ERRO] O Node.js nao foi encontrado no seu computador.\n\n");
        printf("Para rodar o sistema:\n");
        printf("1. Baixe o instalador oficial em: https://nodejs.org\n");
        printf("2. Instale com as opcoes padrao.\n");
        printf("3. Execute este arquivo .exe novamente.\n\n");
        
        MessageBoxA(NULL, 
            "O Node.js nao foi encontrado no sistema.\n\nPor favor, instale o Node.js em https://nodejs.org para executar o servidor local.", 
            "Node.js Necessario - Attribution CRM", 
            MB_ICONWARNING | MB_OK);

        system("pause");
        return 1;
    }

    printf("[1/3] Node.js detectado com sucesso!\n");
    printf("[2/3] Verificando dependencias locais...\n");
    
    // Executa npm install apenas se node_modules não existir
    FILE *f = fopen("node_modules", "r");
    if (!f) {
        printf("Instalando modulos iniciais (apenas na primeira vez)...\n");
        system("npm install");
    } else {
        fclose(f);
    }

    printf("[3/3] Iniciando servidor do sistema na porta 3000...\n");
    printf("-----------------------------------------------------------------\n");
    printf(">>> Abrindo navegador em http://localhost:3000 <<<\n");
    printf("-----------------------------------------------------------------\n\n");

    // Abre navegador
    system("start http://localhost:3000");

    // Inicia o app
    int exitCode = system("npm run dev");

    if (exitCode != 0) {
        printf("\nO processo encerrou com codigo: %d\n", exitCode);
        system("pause");
    }

    return exitCode;
}
