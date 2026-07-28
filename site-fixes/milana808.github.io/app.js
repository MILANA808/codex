const planetFacts = {
  "Меркурий": "Меркурий — самая близкая к Солнцу планета. Он напоминает: маленький размер не мешает быть важным.",
  "Венера": "Венера сияет ярче всех планет на нашем небе и учит видеть красоту даже в сложных условиях.",
  "Земля": "Земля — наш общий дом. Беречь людей, воду, воздух и знания — значит беречь будущее.",
  "Марс": "Марс вдохновляет исследовать новое, задавать вопросы и не бояться больших целей.",
  "Юпитер": "Юпитер — самая большая планета. Его масштаб напоминает о силе объединения.",
  "Сатурн": "Сатурн известен кольцами. Он показывает, что у каждого есть свой неповторимый свет.",
  "Уран": "Уран вращается необычно, почти на боку. Быть другим — тоже путь к гармонии.",
  "Нептун": "Нептун далёкий и глубокий. Он зовёт мечтать и помнить, что даже дальние цели достижимы."
};

const kindMessages = [
  "Ты важен. Даже маленький шаг сегодня — это уже движение к свету.",
  "Пусть рядом появится человек, который услышит тебя по-настоящему.",
  "Мир становится добрее каждый раз, когда ты выбираешь заботу вместо равнодушия.",
  "Отдохнуть — не слабость. Это способ сохранить свою внутреннюю звезду.",
  "Твои знания, любовь и честность могут помочь кому-то уже сегодня."
];

const planetInfo = document.querySelector("#planetInfo");
const solarSystem = document.querySelector(".solar-system");
const scaleToggle = document.querySelector("#scaleToggle");
const messageButton = document.querySelector("#messageButton");
const kindMessage = document.querySelector("#kindMessage");
const repoGrid = document.querySelector("#repoGrid");
const repoStatus = document.querySelector("#repoStatus");

function showPlanetFact(name) {
  if (!planetInfo) return;
  planetInfo.textContent = planetFacts[name] || "Эта планета прекрасна и заслуживает внимания.";
}

document.querySelectorAll(".planet").forEach((planet) => {
  planet.addEventListener("click", () => showPlanetFact(planet.dataset.planet));
});

if (scaleToggle && solarSystem) {
  scaleToggle.addEventListener("click", () => {
    const compact = solarSystem.classList.toggle("compact");
    scaleToggle.setAttribute("aria-pressed", String(compact));
    scaleToggle.textContent = compact ? "Медленный масштаб" : "Компактный масштаб";
  });
}

if (messageButton && kindMessage) {
  messageButton.addEventListener("click", () => {
    const current = kindMessages.indexOf(kindMessage.textContent);
    const next = (current + 1) % kindMessages.length;
    kindMessage.textContent = kindMessages[next];
  });
}


function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function repoDescription(repo) {
  return repo.description || "Проект MILANA808 без описания — часть общего AKSI Globe созвездия.";
}

function repoLanguage(repo) {
  return repo.language || "Project";
}

function renderRepos(repos) {
  if (!repoGrid || !repoStatus) return;
  const visibleRepos = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 12);

  repoGrid.innerHTML = "";
  visibleRepos.forEach((repo) => {
    const card = document.createElement("a");
    card.className = "repo-card";
    card.href = repo.html_url;
    card.target = "_blank";
    card.rel = "noreferrer";
    card.innerHTML = `
      <strong>${escapeHTML(repo.name)}</strong>
      <p>${escapeHTML(repoDescription(repo))}</p>
      <span class="repo-meta">
        <span class="repo-pill">${escapeHTML(repoLanguage(repo))}</span>
        <span class="repo-pill">★ ${repo.stargazers_count}</span>
        <span class="repo-pill">↻ ${new Date(repo.updated_at).toLocaleDateString("ru-RU")}</span>
      </span>
    `;
    repoGrid.appendChild(card);
  });
  repoStatus.textContent = visibleRepos.length
    ? `Соединено репозиториев: ${visibleRepos.length}. Откройте карточку, чтобы перейти к проекту.`
    : "Публичные репозитории пока не найдены, но центр уже готов для будущих проектов.";
}

function renderRepoFallback() {
  renderRepos([
    {
      name: "milana808.github.io",
      description: "Главный сайт AKSI Globe для людей, планет, знаний и добрых сообщений.",
      html_url: "https://github.com/MILANA808/milana808.github.io",
      language: "HTML",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
      fork: false
    },
    {
      name: "codex",
      description: "Рабочий центр для кода, автоматизации и объединения проектов MILANA808.",
      html_url: "https://github.com/MILANA808/codex",
      language: "Rust / TypeScript",
      stargazers_count: 0,
      updated_at: new Date().toISOString(),
      fork: false
    }
  ]);
  if (repoStatus) repoStatus.textContent = "GitHub API сейчас недоступен, показан локальный список ключевых репозиториев.";
}

if (repoGrid && repoStatus) {
  fetch("https://api.github.com/users/MILANA808/repos?per_page=100&sort=updated")
    .then((response) => {
      if (!response.ok) throw new Error(`GitHub API вернул ${response.status}`);
      return response.json();
    })
    .then(renderRepos)
    .catch(renderRepoFallback);
}
