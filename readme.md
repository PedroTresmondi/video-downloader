<p align="center">
    ![Video Downloader Icon](assets/vdownloader.png)
</p>

# Video Downloader

<p align="center">
    Um aplicativo Electron para baixar vídeos do YouTube, desenvolvido para Windows, macOS e Linux.
    Ele permite que você insira a URL de um vídeo do YouTube, selecione a qualidade e faça o download diretamente para o seu computador.
</p>

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Build do Aplicativo](#build-do-aplicativo)
- [Estrutura do Projeto](#estrutura-do-projeto)

## Pré-requisitos

- **Node.js** (v14 ou superior) - [Instalar Node.js](https://nodejs.org/)
- **NPM** - Geralmente incluído com o Node.js
- **Certificado de Assinatura** - Necessário apenas para builds de produção no Windows

## Instalação

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/video-downloader.git
    cd video-downloader
    ```

2. **Instale as dependências:**

    ```bash
    npm install
    ```

## Uso

1. **Inicie o aplicativo em modo de desenvolvimento:**

    ```bash
    npm start
    ```

2. **Baixe um vídeo:**

    - Cole a URL de um vídeo do YouTube na entrada de URL.
    - Clique em "Obter Informações" para visualizar as informações do vídeo.
    - Escolha a qualidade do vídeo e selecione o local onde deseja salvá-lo.
    - Clique em "Baixar Vídeo" para iniciar o download.

## Build do Aplicativo

Para criar um executável do aplicativo:

- **Windows:** Gere o instalador `.exe` para Windows:

    ```bash
    npm run build
    ```

- **macOS:** Gere um instalador `.dmg` para macOS:

    ```bash
    npm run build
    ```

- **Linux:** Gere um arquivo `.AppImage` para Linux:

    ```bash
    npm run build
    ```

Os arquivos de saída estarão na pasta `dist`.

> **Nota**: O build para macOS e Linux requer um sistema operacional compatível ou o uso de um sistema de build em nuvem.

## Estrutura do Projeto

```plaintext
video-downloader/
├── assets/               # Ícones para cada sistema operacional
│   ├── vdownloader.ico   # Ícone para Windows
│   ├── vdownloader.icns  # Ícone para macOS
│   └── vdownloader.png   # Ícone para Linux
├── main.js               # Código principal do Electron
├── renderer.js           # Lógica da interface e manipulação do DOM
├── index.html            # Interface do usuário
├── styles.css            # Estilos para a interface
├── package.json          # Configurações do projeto e do Electron Builder
└── README.md             # Documentação do projeto
 ```
 
<p align="center">Feito por <a href="https://github.com/pedroTresmondi">3smondi</a></p>