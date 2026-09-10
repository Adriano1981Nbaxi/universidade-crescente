const defaultCourses = [
  { icon: '💻', name: 'Engenharia e Tecnologias', description: 'Programação, redes, sistemas e soluções digitais.' },
  { icon: '📊', name: 'Gestão e Negócios', description: 'Estratégia, administração, logística e empreendedorismo.' },
  { icon: '🧠', name: 'Ciências Sociais', description: 'Comunicação, relações públicas e desenvolvimento social.' },
  { icon: '⚖️', name: 'Direito e Instituições', description: 'Cidadania, justiça, governança e processos legais.' }
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

document.addEventListener('DOMContentLoaded', () => {
  renderCourses();
  renderNews();
});
