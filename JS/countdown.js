// Set your launch date here (e.g. new Date("2026-12-31T00:00:00"))
// Default: 8d 23h 55m 41s from page load, matching the design.
const launchDate = new Date(
  Date.now() + ((8 * 24 + 23) * 3600 + 55 * 60 + 41) * 1000,
);

const units = ['Days', 'Hours', 'Minutes', 'Seconds'];
const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;
const pad = (n) => String(n).padStart(2, '0');

// Build the four cards from the template
const container = document.getElementById('countdown');
const tpl = document.getElementById('card-tpl');
const cards = units.map((label) => {
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.querySelector('[data-slot="label"]').textContent = label;
  container.appendChild(node);
  return node.querySelector('.flip-card');
});

const slot = (card, name) => card.querySelector(`[data-slot="${name}"]`);

function setInstant(card, value) {
  ['static-top', 'static-bottom', 'flap-top', 'flap-bottom'].forEach((s) => {
    slot(card, s).textContent = value;
  });
  card.dataset.value = value;
}

function flipTo(card, value) {
  const old = card.dataset.value;
  if (old === undefined || reduceMotion) return setInstant(card, value);
  if (old === value) return;

  slot(card, 'flap-top').textContent = old; // old top folds away
  slot(card, 'static-top').textContent = value; // new top revealed beneath
  slot(card, 'flap-bottom').textContent = value; // new bottom folds down
  card.dataset.value = value;

  // restart the animation
  card.classList.remove('flipping');
  void card.offsetWidth;
  card.classList.add('flipping');

  // once the bottom flap lands, swap the static bottom
  card.querySelector('.flap-bottom').onanimationend = () => {
    slot(card, 'static-bottom').textContent = value;
    card.classList.remove('flipping');
  };
}

function tick() {
  const total = Math.max(0, Math.floor((launchDate - Date.now()) / 1000));
  const values = [
    Math.floor(total / 86400),
    Math.floor((total % 86400) / 3600),
    Math.floor((total % 3600) / 60),
    total % 60,
  ];
  values.forEach((v, i) => flipTo(cards[i], pad(v)));
  if (total === 0) clearInterval(timer);
}

tick();
const timer = setInterval(tick, 1000);
