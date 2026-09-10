const STORAGE_KEYS = {
  news: 'uc-news',
  courses: 'uc-courses',
  socialQueue: 'uc-social-queue'
};

const defaultCourses = [
  { id: 1, icon: '💻', name: 'Engenharia e Tecnologias', description: 'Programação, redes, sistemas e soluções digitais.' },
  { id: 2, icon: '📊', name: 'Gestão e Negócios', description: 'Estratégia, administração, logística e empreendedorismo.' },
  { id: 3, icon: '🧠', name: 'Ciências Sociais', description: 'Comunicação, relações públicas e desenvolvimento social.' },
  { id: 4, icon: '⚖️', name: 'Direito e Instituições', description: 'Cidadania, justiça, governança e processos legais.' }
];

const defaultNews = [
  {
    id: 1,
    title: 'Abertura de matrículas 2026',
    category: 'Académica',
    summary: 'As matrículas para o ciclo 2026 já estão abertas.',
    content: 'A Universidade Crescente comunica que as matrículas para o ano académico 2026 já se encontram abertas.'
  }
];

function safeRead(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function renderCourseManagerList() {
  const list = document.getElementById('course-manager-list');
  if (!list) return;

  const courses = safeRead(STORAGE_KEYS.courses, defaultCourses);
  list.innerHTML = courses
    .map(
      (course) => `
        <div class="course-manager-item">
          <div>
            <strong>${course.icon || '🎓'} ${course.name}</strong>
            <span>${course.description}</span>
          </div>
          <div class="course-actions">
            <button class="mini-btn edit" data-action="edit" data-id="${course.id}">Editar</button>
            <button class="mini-btn delete" data-action="delete" data-id="${course.id}">Eliminar</button>
          </div>
        </div>
      `
    )
    .join('');
}

function renderSocialQueue() {
  const queue = document.getElementById('social-queue');
  if (!queue) return;

  const items = safeRead(STORAGE_KEYS.socialQueue, []);
  queue.innerHTML = items.length
    ? items.map((item) => `<div>• ${item}</div>`).join('')
    : 'Nenhuma publicação sincronizada ainda.';
}

function syncWithSocialNetworks() {
  const queue = safeRead(STORAGE_KEYS.socialQueue, []);
  const latestNews = safeRead(STORAGE_KEYS.news, defaultNews);
  const title = latestNews[0]?.title || 'Nova atualização';

  const nextQueue = [...queue, `${title} sincronizada com as redes sociais`];
  saveData(STORAGE_KEYS.socialQueue, nextQueue.slice(-5));
  renderSocialQueue();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem(STORAGE_KEYS.news)) {
    saveData(STORAGE_KEYS.news, defaultNews);
  }
  if (!localStorage.getItem(STORAGE_KEYS.courses)) {
    saveData(STORAGE_KEYS.courses, defaultCourses);
  }
  if (!localStorage.getItem(STORAGE_KEYS.socialQueue)) {
    saveData(STORAGE_KEYS.socialQueue, []);
  }

  renderCourseManagerList();
  renderSocialQueue();

  const newsForm = document.getElementById('news-form');
  const courseForm = document.getElementById('course-form');

  newsForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('news-title').value.trim();
    const category = document.getElementById('news-category').value;
    const summary = document.getElementById('news-summary').value.trim();
    const content = document.getElementById('news-content').value.trim();

    if (!title || !summary || !content) {
      alert('Preencha título, resumo e conteúdo.');
      return;
    }

    const items = safeRead(STORAGE_KEYS.news, defaultNews);
    items.unshift({
      id: Date.now(),
      title,
      category,
      summary,
      content
    });

    saveData(STORAGE_KEYS.news, items.slice(0, 10));
    syncWithSocialNetworks();
    newsForm.reset();
  });

  courseForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const icon = document.getElementById('course-icon').value.trim() || '🎓';
    const name = document.getElementById('course-name').value.trim();
    const description = document.getElementById('course-description').value.trim();

    if (!name || !description) {
      alert('Preencha o nome do curso e a descrição.');
      return;
    }

    const items = safeRead(STORAGE_KEYS.courses, defaultCourses);
    items.push({ id: Date.now(), icon, name, description });
    saveData(STORAGE_KEYS.courses, items);
    renderCourseManagerList();
    courseForm.reset();
  });

  document.getElementById('course-manager-list')?.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const items = safeRead(STORAGE_KEYS.courses, defaultCourses);

    if (action === 'delete') {
      const filtered = items.filter((course) => course.id !== id);
      saveData(STORAGE_KEYS.courses, filtered);
      renderCourseManagerList();
      return;
    }

    if (action === 'edit') {
      const course = items.find((item) => item.id === id);
      if (!course) return;
      document.getElementById('course-icon').value = course.icon || '';
      document.getElementById('course-name').value = course.name || '';
      document.getElementById('course-description').value = course.description || '';
      const remaining = items.filter((item) => item.id !== id);
      saveData(STORAGE_KEYS.courses, remaining);
      renderCourseManagerList();
    }
  });
});
