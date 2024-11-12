const { ipcRenderer } = require('electron');

let videoInfo = null;
let savePath = null;

document.getElementById('get-info').addEventListener('click', async () => {
    const url = document.getElementById('url').value;

    if (!url) {
        document.getElementById('status').innerText = "Por favor, insira uma URL.";
        return;
    }

    try {
        videoInfo = await ipcRenderer.invoke('get-video-info', url);

        document.getElementById('video-title').innerText = videoInfo.title;
        const thumbnail = document.getElementById('thumbnail');
        thumbnail.src = videoInfo.thumbnail;
        thumbnail.classList.remove('hidden');

        const qualitySelect = document.getElementById('quality');
        qualitySelect.innerHTML = '';
        videoInfo.formats.forEach(format => {
            const option = document.createElement('option');
            option.value = format.itag;
            option.innerText = format.quality;
            qualitySelect.appendChild(option);
        });

        const sanitizedTitle = sanitizeFilename(videoInfo.title);
        savePath = `${sanitizedTitle}.mp4`;
        document.getElementById('file-path').innerText = savePath;

        document.getElementById('info-section').classList.remove('hidden');
        document.getElementById('status').innerText = "Informações do vídeo carregadas com sucesso!";
    } catch (error) {
        document.getElementById('status').innerText = `Erro ao obter informações: ${error.message}`;
    }
});

function sanitizeFilename(filename) {
    return filename.replace(/[<>:"/\\|?*]/g, '')
        .replace(/[#\s]/g, '-')
        .replace(/\.+$/, '')
        .toLowerCase();
}


document.getElementById('choose-folder').addEventListener('click', async () => {
    savePath = await ipcRenderer.invoke('select-directory');
    document.getElementById('file-path').innerText = savePath || "Não selecionado";
});

document.getElementById('download').addEventListener('click', async () => {
    if (!videoInfo || !savePath) {
        document.getElementById('status').innerText = "Carregue as informações do vídeo e selecione o local.";
        return;
    }

    const quality = document.getElementById('quality').value;

    document.getElementById('status').innerText = "Baixando...";
    document.getElementById('progress-container').classList.remove('hidden');

    try {
        await ipcRenderer.invoke('download-video', { url: document.getElementById('url').value, quality, savePath });
        document.getElementById('status').innerText = "Download concluído com sucesso!";
        document.getElementById('progress-bar').style.width = '100%';
    } catch (error) {
        document.getElementById('status').innerText = `Erro no download: ${error.message}`;
    }
});


ipcRenderer.on('download-progress', (event, progress) => {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progress}%`;
    progressBar.innerText = `${progress.toFixed(1)}%`;
});