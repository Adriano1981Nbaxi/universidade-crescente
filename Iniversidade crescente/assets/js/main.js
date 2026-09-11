const defaultCourses = [
  { icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h16v9H4z"/><path d="M8 18v2m8-2v2M9 7.5V5h6v2.5"/></svg>', name: 'Engenharia e Tecnologias', description: 'Programação, redes, sistemas e soluções digitais.' },
  { icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18V9.5M12 18V6M19 18v-7"/><path d="M3 18h18"/></svg>', name: 'Gestão e Negócios', description: 'Estratégia, administração, logística e empreendedorismo.' },
  { icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5v15"/><path d="M7 8.5h10"/><path d="M7 15.5h10"/><path d="M4.5 7.5 12 4l7.5 3.5"/></svg>', name: 'Ciências Sociais', description: 'Comunicação, relações públicas e desenvolvimento social.' },
  { icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18V8.5L12 5l5 3.5V18"/><path d="M9.5 12h5"/><path d="M12 12v6"/></svg>', name: 'Direito e Instituições', description: 'Cidadania, justiça, governança e processos legais.' }
];

const defaultNews = [
  {
    id: 1,
    title: 'Abertura de matrículas 2026',
    category: 'Académica',
    summary: 'As matrículas para o ciclo 2026 já estão abertas.',
    content: 'A Universidade Crescente comunica que as matrículas...'
  },
  {
    id: 2,
    title: 'Workshop de inovação e empreendedorismo',
    category: 'Eventos',
    summary: 'Estudantes participam em workshop de negócios e tecnologia.',
    content: 'A universidade promove um workshop de inovação...'
  },
  {
    id: 3,
    title: 'Semana de integração estudantil',
    category: 'Estudantil',
    summary: 'A comunidade académica recebe novos estudantes.',
    content: 'Atividades de acolhimento, networking e integração.'
  }
];

function getCourses() {
  const raw = localStorage.getItem('uc-courses');
  if (!raw) {
    localStorage.setItem('uc-courses', JSON.stringify(defaultCourses));
    return defaultCourses;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultCourses;
  } catch {
    return defaultCourses;
  }
}

function getNews() {
  const raw = localStorage.getItem('uc-news');
  if (!raw) {
    localStorage.setItem('uc-news', JSON.stringify(defaultNews));
    return defaultNews;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultNews;
  } catch {
    return defaultNews;
  }
}

function renderCourses() {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;

  const courses = getCourses();
  grid.innerHTML = courses
    .map(
      (course) => `
        <article class="course-card">
          <div class="course-icon">${course.icon || '🎓'}</div>
          <h3>${course.name}</h3>
          <p>${course.description}</p>
        </article>
      `
    )
    .join('');
}

function renderNews() {
  const list = document.getElementById('news-list');
  if (!list) return;

  const news = getNews();
  list.innerHTML = news
    .slice(0, 3)
    .map(
      (item) => `
        <article class="news-card">
          <span>${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
          <a href="#">Ler mais</a>
        </article>
      `
    )
    .join('');
}

function updateAdminButton() {
  const button = document.getElementById('admin-login-btn');
  if (!button) return;

  const isLoggedIn = localStorage.getItem('uc-admin-loggedin') === 'true';
  button.textContent = isLoggedIn ? 'Sair' : 'Login';
  button.setAttribute('data-loggedin', String(isLoggedIn));
}

document.addEventListener('DOMContentLoaded', () => {
  renderCourses();
  renderNews();
  updateAdminButton();

  const adminButton = document.getElementById('admin-login-btn');
  adminButton?.addEventListener('click', (event) => {
    const isLoggedIn = localStorage.getItem('uc-admin-loggedin') === 'true';

    if (isLoggedIn) {
      event.preventDefault();
      localStorage.setItem('uc-admin-loggedin', 'false');
      updateAdminButton();
      return;
    }

    localStorage.setItem('uc-admin-loggedin', 'true');
    updateAdminButton();
  });
});
