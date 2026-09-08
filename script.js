const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');
const foodMarkers = document.getElementById('foodMarkers');
const soundToggle = document.getElementById('soundToggle');
const soundText = document.getElementById('soundText');

const markerData = [
  { number: 12, food: 'fries', label: 'French fries' },
  { number: 3, food: 'chicken', label: 'Fried chicken' },
  { number: 6, food: 'burger', label: 'Cheeseburger' },
  { number: 9, food: 'shawarma', label: 'Chicken shawarma' }
];

markerData.forEach(({ number, food, label }) => {
  const marker = document.createElement('span');
  marker.className = `food-marker marker-${number}`;
  marker.innerHTML = `<img src="assets/marker-${food}.png" alt="${label}">`;
  foodMarkers.appendChild(marker);
});

let soundEnabled = false;
let audioContext;
let lastTick = -1;

function playTick() {
  if (!soundEnabled) return;
  audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 920;
  gain.gain.setValueAtTime(0.025, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.025);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.03);
}

function updateClock() {
  const now = new Date();
  const milliseconds = now.getMilliseconds();
  const seconds = now.getSeconds() + milliseconds / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  secondHand.style.transform = `rotate(${seconds * 6}deg)`;
  minuteHand.style.transform = `rotate(${minutes * 6}deg)`;
  hourHand.style.transform = `rotate(${hours * 30}deg)`;

  if (now.getSeconds() !== lastTick) {
    lastTick = now.getSeconds();
    playTick();
  }
  requestAnimationFrame(updateClock);
}

soundToggle.addEventListener('click', async () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  soundText.textContent = soundEnabled ? 'Tick sound on' : 'Tick sound off';
  if (soundEnabled) {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();
    playTick();
  }
});

updateClock();
