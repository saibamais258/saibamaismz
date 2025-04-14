document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input'); // Campo de entrada de texto
    const fileUpload = document.getElementById('file-upload'); // Campo de upload de arquivo
    const publishButton = document.getElementById('publish-button'); // Botão de publicar
    const previewContainer = document.getElementById('preview-container'); // Contêiner de visualização de arquivos

    initFormEvents(textInput, fileUpload, publishButton, previewContainer);
    initDarkModeToggle();
    initMenuToggle();
    initModalEvents();

    // Evento ao clicar no botão de publicar
    publishButton.addEventListener('click', () => {
        publishPost(textInput, fileUpload, previewContainer);
    });
});

function initFormEvents(textInput, fileUpload, publishButton, previewContainer) {
    // Evento ao digitar no campo de texto
    textInput.addEventListener('input', () => {
        if (textInput.value.trim() !== "" || fileUpload.files.length > 0) {
            publishButton.style.display = 'inline-block'; // Mostrar o botão de publicar
        } else {
            publishButton.style.display = 'none'; // Ocultar o botão de publicar
        }
        textInput.style.height = '40px';
        textInput.style.height = (textInput.scrollHeight) + 'px'; // Ajustar a altura do campo de texto
    });

    // Evento ao selecionar um arquivo no campo de upload
    fileUpload.addEventListener('change', () => {
        previewContainer.innerHTML = ''; // Limpar contêiner de visualização
        Array.from(fileUpload.files).forEach(file => {
            const preview = document.createElement(file.type.startsWith('image') ? 'img' : 'video'); // Criar elemento de visualização
            preview.src = URL.createObjectURL(file);
            preview.controls = file.type.startsWith('video');
            previewContainer.appendChild(preview); // Adicionar pré-visualização ao contêiner

            const removeButton = document.createElement('button'); // Botão para remover a pré-visualização
            removeButton.className = 'preview-remove';
            removeButton.innerHTML = '&times;';
            preview.appendChild(removeButton);

            // Evento para remover a pré-visualização ao clicar no botão de remover
            removeButton.addEventListener('click', () => {
                previewContainer.removeChild(preview);
                if (previewContainer.innerHTML === '' && textInput.value.trim() === '') {
                    publishButton.style.display = 'none'; // Ocultar o botão de publicar se não houver conteúdo
                }
            });
        });
    });

    // Evento ao focar no campo de texto para rolar a tela suavemente
    textInput.addEventListener('focus', () => {
        setTimeout(() => {
            textInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 300);
    });

    // Ajustar a altura do campo de texto conforme o conteúdo
    textInput.addEventListener('input', () => {
        if (textInput.scrollHeight > textInput.clientHeight) {
            textInput.style.height = textInput.scrollHeight + 'px';
        }
    });
}

function publishPost(textInput, fileUpload, previewContainer) {
    const textInputContent = textInput.value.trim(); // Certifique-se de que o texto não está vazio
    if (textInputContent === "" && fileUpload.files.length === 0) {
        customAlert('Preencha a mensagem ou carregue um arquivo.'); // Exibir alerta se ambos os campos estiverem vazios
        return;
    }

    const firstParagraph = textInputContent.split('\n')[0];
    const remainingText = textInputContent.split('\n').slice(1).join('\n');
    const formattedText = `<h2>${firstParagraph}</h2><p>${remainingText}</p>`;

    const formData = new FormData();
    formData.append('title', firstParagraph);
    formData.append('content', textInputContent.trim());
    formData.append('text', formattedText); // Adicionar o texto ao FormData

    if (fileUpload.files.length > 0) {
        for (let i = 0; i < fileUpload.files.length; i++) {
            formData.append('files', fileUpload.files[i]); // Adicionar os arquivos ao FormData
        }
    }

    // Emitir evento via Socket.io
    const socket = io();
    socket.emit('publish', { text: formattedText, files: Array.from(fileUpload.files).map(file => file.name) });

    // Enviar dados para o servidor via Fetch API
    fetch('/publish', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.message === 'Publicação armazenada e enviada com sucesso') {
            customAlert(result.message); // Exibir alerta de sucesso
            // Adicionar a nova publicação à div com id="index"
            const postContainer = document.getElementById('index');
            const newPost = document.createElement('div');
            newPost.className = 'post-item';
            newPost.innerHTML = `
                ${formattedText}
                ${Array.from(fileUpload.files).map(file => file.type.startsWith('image') ? `<img src="/uploads/${file.name}" />` : `<video src="/uploads/${file.name}" controls></video>`).join('')}
            `;
            postContainer.appendChild(newPost);
        } else {
            customAlert('Erro ao publicar.'); // Exibir alerta de erro
        }
    })
    .catch(error => {
        console.error('Erro ao publicar:', error);
        customAlert('Erro ao publicar.'); // Exibir alerta de erro
    });

    // Limpar o formulário após a publicação
    form.reset();
    previewContainer.innerHTML = '';
    publishButton.style.display = 'none';
}

// Função para Custom Alert:
function customAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.innerText = message;
    document.body.appendChild(alertBox); // Adicionar alerta à página
    setTimeout(() => {
        alertBox.remove(); // Remover alerta após 3 segundos
    }, 3000);
}

// Funções adicionais (não modificadas) para fácil manutenção
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        const icon = darkModeToggle.querySelector('i');
        icon.classList.toggle('fa-sun');
        icon.classList.toggle('fa-moon');
    });
}

function initMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuModal = document.getElementById('menu-modal');
    menuToggle.addEventListener('click', () => {
        menuModal.style.display = 'block';
    });

    window.addEventListener('click', (event) => {
        if (event.target == menuModal) {
            menuModal.style.display = 'none';
        }
    });
}

function initModalEvents() {
    const closeModalButtons = document.querySelectorAll('.modal .close');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.parentElement.parentElement.style.display = 'none';
        });
    });
}