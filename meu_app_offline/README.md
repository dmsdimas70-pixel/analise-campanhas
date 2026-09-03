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

### 3. Iniciar o Aplicativo (Apenas 2 cliques!)
1. Dê **dois cliques** no arquivo **`run.bat`**.
2. Uma janela preta do Prompt de Comando irá se abrir.
3. O script irá:
   - Verificar e instalar automaticamente todas as bibliotecas necessárias (`requirements.txt`).
   - Iniciar o servidor local.
4. Quando você visualizar a mensagem:
   ```text
   >>> Aplicativo rodando com sucesso em http://localhost:7860 <<<
   ```
5. Abra o seu navegador (Chrome, Edge, Firefox, Brave) e acesse:
   👉 **[http://localhost:7860](http://localhost:7860)**

---

## 🛑 Como Encerrar o Aplicativo

Para fechar o programa:
- Clique na janela preta do Prompt de Comando e pressione as teclas **`Ctrl + C`**, ou
- Simplesmente **feche a janela preta** no "X".

---

## 📁 Estrutura de Pastas e Arquivos

```text
/meu_app_offline
├── app.py              # Código principal refatorado com servidor Gradio local
├── data/               # Coloque aqui seus arquivos CSV, JSON ou modelos (.pkl, .h5, .onnx)
│   └── .gitkeep
├── outputs/            # Todos os relatórios, logs e predições são gravados aqui
│   └── .gitkeep
├── requirements.txt    # Lista de dependências Python
├── run.bat             # Inicializador automático para Windows (1 clique)
├── .gitignore          # Arquivos ignorados pelo Git
├── .env.example        # Exemplo de chaves (opcional)
└── README.md           # Este manual de instruções
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
