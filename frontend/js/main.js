const links = document.querySelectorAll('[data-target]');
const sections = document.querySelectorAll('main section');
const token = localStorage.getItem('token');
const API_URL = window.location.origin;

links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.getAttribute('data-target');

        sections.forEach(sec => {
            if (sec.id === target) {
                sec.classList.add('conteudo-ativo');
            } else {
                sec.classList.remove('conteudo-ativo');
            }
        });

        ativarLinkNavegacao(target);
    });
});
function mostrarFeedback(tipo, mensagem) {
    const feedbackArea = document.getElementById('feedbackArea');
    if (!feedbackArea) return;

    feedbackArea.className = `alert alert-${tipo}`;
    feedbackArea.textContent = mensagem;
    feedbackArea.classList.remove('d-none');

    setTimeout(() => {
        feedbackArea.classList.add('d-none');
        feedbackArea.textContent = '';
    }, 3000);
}

function mostrarLoading() {
    const el = document.getElementById('loadingGlobal');
    const documento = document.querySelector('main');

    if (el) el.classList.remove('d-none');
    if (documento) documento.classList.add('d-none');
}

function esconderLoading() {
    const el = document.getElementById('loadingGlobal');
    const documento = document.querySelector('main');

    setTimeout(() => {
        if (el) el.classList.add('d-none');
        if (documento) documento.classList.remove('d-none');
    }, 400); 
}

const logout = document.querySelector('#logout-btn');

if (!token) {
    logout.style.display = 'none';
}

const logoutBtn = document.querySelector('#logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
}