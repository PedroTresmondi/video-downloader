const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const ytdl = require('ytdl-core');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'assets/vdownloader.png'),
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true
    });
    mainWindow.setMenuBarVisibility(false)
    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-directory', async () => {
    const result = await dialog.showSaveDialog({
        title: 'Escolha o local para salvar o vídeo',
        defaultPath: 'video.mp4',
        filters: [{ name: 'Vídeo', extensions: ['mp4'] }],
    });

    return result.filePath || null;
});

ipcMain.handle('get-video-info', async (event, url) => {
    if (!ytdl.validateURL(url)) {
        throw new Error("URL inválida.");
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails.pop().url;

    const formatMap = new Map();

    info.formats
        .filter(format => format.hasVideo)
        .forEach(format => {
            if (!formatMap.has(format.qualityLabel)) {
                formatMap.set(format.qualityLabel, {
                    quality: format.qualityLabel,
                    itag: format.itag,
                    hasAudio: format.hasAudio
                });
            }
        });

    const formats = Array.from(formatMap.values());

    return { title, thumbnail, formats };
});

ipcMain.handle('download-video', (event, { url, quality, savePath }) => {
    return new Promise((resolve) => {
        const downloadCommand = `yt-dlp -f "${quality}+bestaudio" --ffmpeg-location "${ffmpegPath}" -o "${savePath}.%(ext)s" "${url}" --no-part`;
        const downloadProcess = spawn(downloadCommand, { shell: true });

        // Captura a saída do processo para monitorar o progresso
        downloadProcess.stdout.on('data', (data) => {
            const output = data.toString();
            const match = output.match(/(\d{1,3}\.\d)%/); // Extrai a porcentagem (ex: 45.3%)

            if (match) {
                const progress = parseFloat(match[1]);
                event.sender.send('download-progress', progress); // Envia o progresso para o renderer.js
            }
        });

        downloadProcess.stderr.on('data', (data) => {
            console.error(`Erro de download: ${data}`);
        });

        downloadProcess.on('close', (code) => {
            if (code === 0) {
                resolve("Download concluído com sucesso!");
            } else {
                resolve("Download finalizado com avisos.");
            }
        });
    });
});

