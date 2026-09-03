# 📦 Meu App Offline (Guia Completo de Instalação e Uso)

Aplicativo de Machine Learning e Análise refatorado para rodar **100% no computador do usuário (Windows/Mac/Linux)**, sem nenhuma necessidade de Google Colab, Google Drive ou conexão com a internet.

---

## 📋 Pré-requisito Único (Python no Windows)

Para rodar este aplicativo, seu computador precisa ter o **Python** instalado. Se você já tem o Python instalado, pode pular para o [Passo a Passo](#-passo-a-passo-para-o-usuário-final).

Se não tiver o Python instalado:
1. Baixe o instalador oficial no site: [https://www.python.org/downloads/](https://www.python.org/downloads/) (recomenda-se versão 3.10 ou superior).
2. **⚠️ PASSO MAIS IMPORTANTE DA INSTALAÇÃO:** Na primeira tela do instalador, **marque a caixinha**:
   > ☑️ **"Add python.exe to PATH"** (Adicionar Python ao PATH)
3. Clique em **"Install Now"** e aguarde concluir.

---

## 🚀 Passo a Passo para o Usuário Final (Sem complicação)

### 1. Baixar o projeto
1. No repositório do GitHub, clique no botão verde **`Code`** e depois em **`Download ZIP`**.
2. Salve o arquivo na sua pasta de preferência (ex: *Downloads* ou *Área de Trabalho*).

### 2. Descompactar a pasta
1. Clique com o botão direito no arquivo baixado (`.zip`) e selecione **"Extrair Tudo..."**.
2. Abra a pasta descompactada `meu_app_offline`.

### 3. Iniciar o Aplicativo (Apenas 2 cliques no arquivo .EXE!)
1. Dê **dois cliques** no arquivo executável **`iniciar_programa.exe`** (ou `MeuApp.exe` / `app.exe`).
2. O executável nativo do Windows irá:
   - Verificar se o Python está disponível no seu computador.
   - Instalar e verificar automaticamente todas as bibliotecas necessárias (`requirements.txt`).
   - Abrir automaticamente seu navegador padrão em:
     👉 **[http://localhost:7860](http://localhost:7860)**
   - Manter o servidor local rodando de forma 100% offline.

*(Alternativa: você também pode usar o arquivo `run.bat` para iniciar com 2 cliques).*

---

## 💾 Salvamento Permanente de Dados (Nada se perde ao fechar!)

O programa possui **persistência em disco integrada**:
- Na aba **"📝 Editor de Planilha & Arquivos"**, você pode editar clientes diretamente nas células ou cadastrar novos clientes.
- Ao clicar em **"Salvar Alterações no Disco"** ou ao cadastrar um atendimento na aba principal, os dados são salvos diretamente no arquivo permanente `data/clientes.csv` e `data/banco_offline.json`.
- **Garantia:** Se o programa for fechado, o computador for desligado ou reiniciado, **nenhum dado será perdido**. Ao abrir novamente com 2 cliques no `.exe`, todas as alterações anteriores continuarão lá!

---

## 🛑 Como Encerrar o Aplicativo

Para fechar o programa:
- Clique na janela preta do Prompt de Comando e pressione as teclas **`Ctrl + C`**, ou
- Simplesmente **feche a janela preta** no "X".
- Todos os seus dados já estarão devidamente salvos no disco.

---

## 📁 Estrutura de Pastas e Arquivos

```text
/meu_app_offline
├── iniciar_programa.exe # Executável Windows portátil (2 cliques para abrir)
├── MeuApp.exe           # Atalho executável adicional
├── app.py               # Código principal com editor de planilhas e ML local
├── data/                # Banco de dados local permanente
│   ├── clientes.csv     # Planilha de clientes salva permanentemente
│   ├── banco_offline.json # Cópia de segurança em formato JSON
│   └── clientes_amostra.csv
├── outputs/             # Históricos de atendimentos e relatórios gravados
│   └── historico_atendimentos.csv
├── requirements.txt     # Lista de dependências Python
├── run.bat              # Inicializador alternativo (.bat)
├── .env.example         # Exemplo de chaves (opcional)
└── README.md            # Este manual de instruções
```

---

## 🔌 Como Funciona o Modo 100% Offline

1. **Sem Google Drive:** Todas as referências a `/content/drive/MyDrive/` foram substituídas pelo caminho dinâmico da pasta do programa (`Path(__file__).parent`).
2. **Entrada de Arquivos:** Todo arquivo que seu modelo precisa ler deve ser colocado dentro da pasta `data/`.
3. **Saída de Arquivos:** Todos os arquivos gerados (ex: `historico_atendimentos.csv` e `ultimo_resultado.json`) são salvos automaticamente na pasta `outputs/`.
4. **Resiliência a Falhas de Internet:**
   - Se o computador estiver sem internet ou sem chaves de API cadastradas, o aplicativo ativa o **Modo Offline** automaticamente.
   - O usuário recebe uma resposta simulada e estruturada, garantindo que o programa nunca trave ou exiba erros de tela quebrada.

---

## 🔑 Configuração Opcional de Chaves (Apenas se desejar IA Online)

Se desejar usar chamadas reais para OpenAI ou Google Gemini quando estiver conectado à internet:
1. Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
2. Abra o arquivo com o Bloco de Notas e preencha suas chaves:
   ```env
   OPENAI_API_KEY=sua_chave_aqui
   GEMINI_API_KEY=sua_chave_aqui
   ```
3. Salve o arquivo. Se deixar em branco, o aplicativo continuará funcionando perfeitamente em modo offline local.
