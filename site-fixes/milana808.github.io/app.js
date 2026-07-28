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
