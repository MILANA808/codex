const SEED = "Alfiya_AKSI_DIMAX_v3_2026";
const DID = "did:aksi:ed25519:sovereign-1995-alfiya";
const apps = [
  ["MoodMirror", "Health"],
  ["MindMirror", "Health"],
  ["AksiChat", "Social"],
  ["GlobalID", "Utility"],
  ["StoryAI", "Entertainment"],
  ["Mentor", "Education"],
  ["Globe", "Resonance map"],
  ["Network", "Nodes"],
];

const encoder = new TextEncoder();

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"]/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      })[char],
  );
}

async function sha16(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  )
    .join("")
    .slice(0, 16)
    .toUpperCase();
}

function replyFor(text) {
  const normalized = text.toLowerCase();
  if (/привет|здравствуй|hello|hi\b/.test(normalized)) {
    return "Привет. Я АКСИ — сайт жив и работает прямо в браузере.";
  }
  if (/кто ты|что ты|акси|who are you/.test(normalized)) {
    return "Я АКСИ MATRIX: offline-first интерфейс, identity и локальный демонстрационный интеллект MILANA808.";
  }
  if (/identity|did|подпись/.test(normalized)) {
    return `DID: ${DID}. Подпись создаётся локально через SHA-256 сообщения и seed.`;
  }
  if (/quantum|квант|кубит/.test(normalized)) {
    return "Открой блок Quantum: там запускается Bell state и считается fingerprint.";
  }
  return "Слышу тебя. Могу рассказать про identity, quantum, приложения и offline-режим сайта.";
}

async function addMessage(text, isUser = false) {
  const log = document.querySelector("#chat-log");
  const message = document.createElement("div");
  message.className = `message${isUser ? " user" : ""}`;
  message.innerHTML = escapeHtml(text);
  if (!isUser) {
    const signature = await sha16(`${text}|${SEED}|${Date.now()}`);
    message.insertAdjacentHTML("beforeend", `<small>🔏 ${signature}</small>`);
  }
  log.append(message);
  log.scrollTop = log.scrollHeight;
}

function updateActiveNav() {
  const current = location.hash || "#home";
  document.querySelectorAll(".nav a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === current);
  });
}

function tickClock() {
  document.querySelector("#clock").textContent =
    `${new Date().toLocaleTimeString("ru-RU", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} МСК`;
}

function runQuantumDemo() {
  const amplitudes = [1 / Math.SQRT2, 0, 0, 1 / Math.SQRT2];
  const probabilities = amplitudes.map((value) => value * value);
  const fingerprint = probabilities
    .map((value) =>
      Math.round(value * 1000)
        .toString(16)
        .padStart(3, "0"),
    )
    .join("")
    .toUpperCase();
  document.querySelector("#quantum-output").textContent = [
    "Bell state |Φ+⟩",
    `|00⟩ ${(probabilities[0] * 100).toFixed(1)}%`,
    `|11⟩ ${(probabilities[3] * 100).toFixed(1)}%`,
    `Fingerprint: ${fingerprint}`,
  ].join("\n");
}

async function init() {
  tickClock();
  setInterval(tickClock, 1000);
  updateActiveNav();
  window.addEventListener("hashchange", updateActiveNav);

  document.querySelector("#stable-hash").textContent = await sha16(
    `AKSI|${DID}|1995|${SEED}`,
  );
  document.querySelector("#apps-grid").innerHTML = apps
    .map(
      ([name, category]) =>
        `<article class="app-card"><strong>${name}</strong><span>${category}</span></article>`,
    )
    .join("");
  document
    .querySelector("#quantum-run")
    .addEventListener("click", runQuantumDemo);
  document
    .querySelector("#chat-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.querySelector("#chat-input");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      await addMessage(text, true);
      await addMessage(replyFor(text));
    });
  await addMessage("АКСИ на связи. Offline brain активен.");
}

init().catch((error) => {
  console.error("AKSI init failed", error);
});
