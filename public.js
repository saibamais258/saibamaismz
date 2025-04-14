const apiCredentials = {
    url: 'https://mucachua-lyrics.wordpress.com/wp-json/wp/v2',
    username: 'Dcmucachua',
    password: '5UJu ugf2 ZqJZ chps tg1e awqf',
  };
  
  const token = btoa(`${apiCredentials.username}:${apiCredentials.password}`);
  
  document.getElementById('openbutton1').addEventListener('click', function() {
    document.getElementById('win00').style.display = 'block';
  });
  
  document.getElementById('openEditButton').addEventListener('click', function() {
    document.getElementById('winEdit').style.display = 'block';
  });
  
  document.getElementById('openCommentsButton').addEventListener('click', function() {
    document.getElementById('win6').style.display = 'block';
  });
  
/*  const buttons = [
    { buttonId: 'principal', divId: 'post' },
    { buttonId: 'btn-post1', divId: 'firstWindow' },
    { buttonId: 'btn-post2', divId: 'secondWindow' },
    { buttonId: 'btn-post3', divId: 'thirdWindow' },
    { buttonId: 'btn-post4', divId: 'fourthWindow' },
    { buttonId: 'btn-post5', divId: 'fifthWindow' }
  ];
  
  buttons.forEach(({ buttonId, divId }) => {
    document.getElementById(buttonId).addEventListener('click', function() {
        const content = prompt("Digite o conteúdo da publicação:");
        if (content) {
            document.getElementById(divId).innerHTML = `<p>${content}</p>`;
            document.getElementById('win2').innerHTML += `<div class="post" id="index"><p>${content}</p></div>`;
            
            // Enviar dados para o WordPress
            fetch(`${apiCredentials.url}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`,
                },
                body: JSON.stringify({
                    title: 'Nova Publicação',
                    content: content,
                    status: 'publish'
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Publicação criada:', data);
            })
            .catch(error => {
                console.error('Erro ao criar publicação:', error);
            });
        }
    });
  });
  
  // Upload de Arquivos
  document.getElementById('media').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    fetch(`${apiCredentials.url}/media`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${token}`,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Arquivo carregado:', data);
    })
    .catch(error => {
        console.error('Erro ao carregar arquivo:', error);
    });
  });
  
  // Envio de Comentários
  document.getElementById('submitComment').addEventListener('click', function() {
    const comment = document.getElementById('commentText').value;
  
    fetch(`${apiCredentials.url}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`,
        },
        body: JSON.stringify({
            content: comment,
            post: 1 // ID do post que está comentando
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Comentário enviado:', data);
        // Adicionar comentário na área de comentários
        const commentDiv = document.createElement('div');
        commentDiv.textContent = comment;
        document.getElementById('comments').appendChild(commentDiv);
    })
    .catch(error => {
        console.error('Erro ao enviar comentário:', error);
    });
  }); */

  document.addEventListener('DOMContentLoaded', function() {
    const buttons = [
        { id: 'principal', target: 'post' },
        { id: 'btn-post1', target: 'firstWindow' },
        { id: 'btn-post2', target: 'secondWindow' },
        { id: 'btn-post3', target: 'thirdWindow' },
        { id: 'btn-post4', target: 'fourthWindow' },
        { id: 'btn-post5', target: 'fifthWindow' }
    ];

    // Carregar publicações armazenadas na página index.html
    if (window.location.pathname.endsWith('index.html')) {
        const storageKeys = ['post', 'firstWindow', 'secondWindow', 'thirdWindow', 'fourthWindow', 'fifthWindow'];
        storageKeys.forEach(key => {
            const storedContent = localStorage.getItem(key);
            if (storedContent) {
                document.getElementById(key).innerHTML = storedContent;
            }
        });
    }

    buttons.forEach(button => {
        document.getElementById(button.id).addEventListener('click', function() {
            const content = prompt('Digite o conteúdo da publicação:');
            if (content) {
                const post = document.createElement('div');
                post.className = 'post';
                post.textContent = content;
                document.getElementById(button.target).appendChild(post);
                
                // Adicionando visualização no menu do administrador
                const adminPost = post.cloneNode(true);
                document.getElementById('index').appendChild(adminPost);

                // Adicionando na janela de edições
                const editPost = document.createElement('div');
                editPost.className = 'post';
                editPost.innerHTML = `
                    <div>${content}</div>
                    <button class="edit-post">Editar</button>
                    <button class="delete-post">Eliminar</button>
                `;
                document.getElementById('post-edt').appendChild(editPost);

                editPost.querySelector('.edit-post').addEventListener('click', function() {
                    const newContent = prompt('Editar o conteúdo:', content);
                    if (newContent) {
                        post.textContent = newContent;
                        adminPost.textContent = newContent;
                        editPost.querySelector('div').textContent = newContent;
                        localStorage.setItem(button.target, document.getElementById(button.target).innerHTML);
                    }
                });

                editPost.querySelector('.delete-post').addEventListener('click', function() {
                    post.remove();
                    adminPost.remove();
                    editPost.remove();
                    localStorage.setItem(button.target, document.getElementById(button.target).innerHTML);
                });

                // Armazenar o conteúdo no Local Storage
                localStorage.setItem(button.target, document.getElementById(button.target).innerHTML);
            }
        });
    });

    // Carregar arquivos de mídia
    document.getElementById('media').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const mediaElement = document.createElement('div');
                mediaElement.className = 'media';
                mediaElement.innerHTML = `<img src="${e.target.result}" alt="uploaded media">`;
                document.getElementById('index').appendChild(mediaElement);
                // Armazenar a mídia no Local Storage
                localStorage.setItem('media', mediaElement.innerHTML);
            }
            reader.readAsDataURL(file);
        }
    });

    // Mostrar comentários ao clicar no botão
    document.getElementById('openCommentsButton').addEventListener('click', function() {
        document.getElementById('coment').classList.toggle('active');
    });

    // Mostrar janela de edição de publicações ao clicar no botão
    document.getElementById('win2').addEventListener('click', function() {
        document.getElementById('post-edt').classList.toggle('active');
    });

    // Adicionar lógica para exibir caixa de comentários somente após publicação
    const commentSection = document.getElementById('comment-section');
    buttons.forEach(button => {
        document.getElementById(button.id).addEventListener('click', function() {
            if (commentSection.style.display === 'none') {
                commentSection.style.display = 'block';
            }
        });
    });

    // Gerenciar comentários
    commentSection.addEventListener('submit', function(e) {
        e.preventDefault();
        const commentInput = document.getElementById('comment-input');
        const commentText = commentInput.value;
        if (commentText) {
            const comment = document.createElement('div');
            comment.className = 'comment';
            comment.innerHTML = `
                <div>${commentText}</div>
                <div class="reactions">
                    <button class="like-comment">Curtir</button>
                    <button class="reply-comment">Responder</button>
                </div>
            `;
            commentSection.appendChild(comment);
            document.getElementById('coment').appendChild(comment);
            commentInput.value = '';

            comment.querySelector('.like-comment').addEventListener('click', function() {
                // Adicionar lógica para curtir o comentário
            });

            comment.querySelector('.reply-comment').addEventListener('click', function() {
                const reply = prompt('Responder ao comentário:');
                if (reply) {
                    const replyDiv = document.createElement('div');
                    replyDiv.className = 'reply';
                    replyDiv.textContent = reply;
                    comment.appendChild(replyDiv);
                }
            });
        }
    });
});
  