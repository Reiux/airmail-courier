function applyPostalConfig() {
  const config = window.POSTAL_CONFIG || {};

  if (config.heroSubtitle) {
    const el = document.getElementById('heroSubtitle');
    if (el) el.textContent = config.heroSubtitle;
  }
  if (config.modalTitle) {
    const el = document.getElementById('pinModalTitle');
    if (el) el.textContent = config.modalTitle;
  }
  if (config.modalDesc) {
    const el = document.getElementById('pinModalDesc');
    if (el) el.textContent = config.modalDesc;
  }
  if (config.rating) {
    const el = document.getElementById('ratingStars');
    if (el) el.textContent = config.rating;
  }
}

let audioCtx = null;
let musicBoxInterval = null;
let isMusicPlaying = false;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playWhooshSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch(e) {}
}

function playPopSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(750 + Math.random() * 300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch(e) {}
}

function playWaxCrackSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch(e) {}
}

function playPaperRustle() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.22;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1600;
    filter.Q.value = 1.2;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.22);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch(e) {}
}

function playHarpChime() {
  try {
    const ctx = getAudioContext();
    const chord = [523.25, 659.25, 783.99, 987.77, 1174.66];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 1.2);
    });
  } catch(e) {}
}

const musicBoxNotes = [
  523.25, 659.25, 783.99, 659.25, 880.00, 783.99, 659.25, 587.33,
  523.25, 440.00, 523.25, 659.25, 587.33, 523.25, 493.88, 523.25
];
let musicBoxIndex = 0;

function playMusicNote() {
  if (!isMusicPlaying) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(musicBoxNotes[musicBoxIndex], ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.65);
    musicBoxIndex = (musicBoxIndex + 1) % musicBoxNotes.length;
  } catch(e) {}
}

function startMusicBox() {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  const btnText = document.getElementById('audioBtnText');
  const btn = document.getElementById('audioBtn');
  if (btnText) btnText.textContent = 'Pause Music';
  if (btn) {
    btn.classList.remove('bg-[#FAF0DE]', 'text-[#C2873E]', 'border-[#E7D0AB]');
    btn.classList.add('bg-[#E8F0EC]', 'text-[#4D6B5A]', 'border-[#C5D8CD]');
  }
  playMusicNote();
  musicBoxInterval = setInterval(playMusicNote, 420);
}

function stopMusicBox() {
  if (!isMusicPlaying) return;
  if (musicBoxInterval) clearInterval(musicBoxInterval);
  isMusicPlaying = false;
  const btnText = document.getElementById('audioBtnText');
  const btn = document.getElementById('audioBtn');
  if (btnText) btnText.textContent = 'Play Music';
  if (btn) {
    btn.classList.remove('bg-[#E8F0EC]', 'text-[#4D6B5A]', 'border-[#C5D8CD]');
    btn.classList.add('bg-[#FAF0DE]', 'text-[#C2873E]', 'border-[#E7D0AB]');
  }
}

function toggleMusicBox() {
  if (isMusicPlaying) {
    stopMusicBox();
  } else {
    startMusicBox();
  }
}

function initAutoPlayMusic() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'running') {
      startMusicBox();
    } else {
      const unlockAudio = () => {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            startMusicBox();
          });
        } else {
          startMusicBox();
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('scroll', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
      window.addEventListener('scroll', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
    }
  } catch(e) {}
}

let evasionCount = 0;
const MAX_EVASIONS = 5;
let isSealLocked = false;

const runawayBtn = document.getElementById('runawayBtn');
const dialogBubble = document.getElementById('dialogBubble');
const dialogText = document.getElementById('dialogText');
const sealHomeSlot = document.getElementById('sealHomeSlot');

const fallbackBanter = [
  "Eeep! Huwag muna po Ma'am! Baka may syntax error pa sa loob! 🏃💨",
  "Wait lang po Ma'am Roan! Nagko-compile pa po yung feelings and pasasalamat! ⏳",
  "Bawal pa pong buksan! Hindi pa po tapos mag-run yung test cases! 🧪",
  "Habol po Ma'am! Konti na lang po, pang-1.00 na grade na po 'tong bilis niyo! 🏃‍♀️💨",
  "Hala ang bilis ng mouse cursor ni Ma'am Roan! Hingal na po ako! 💦",
  "Okay surrender na po ako Ma'am Roan! 🏳️ Pwede niyo na pong i-break yung seal!"
];

function getDodgeLines() {
  const config = window.POSTAL_CONFIG || {};
  return (config.dodgeLines && config.dodgeLines.length >= 6) ? config.dodgeLines : fallbackBanter;
}

function dodgeButton(e) {
  if (isSealLocked) return;

  evasionCount++;
  playWhooshSound();

  const lines = getDodgeLines();

  if (evasionCount <= MAX_EVASIONS) {
    
    
    
    if (runawayBtn.parentElement !== document.body) {
      document.body.appendChild(runawayBtn);
    }

    const btnWidth = runawayBtn.offsetWidth || 76;
    const btnHeight = runawayBtn.offsetHeight || 76;

    
    const isMobile = window.innerWidth < 640;
    const marginX = isMobile ? 24 : Math.max(70, Math.floor(window.innerWidth * 0.08));
    const marginTop = 95;
    const marginBottom = isMobile ? 110 : 100;

    const maxLeft = Math.max(marginX, window.innerWidth - btnWidth - marginX);
    const maxTop = Math.max(marginTop, window.innerHeight - btnHeight - marginBottom);

    const newLeft = Math.floor(marginX + Math.random() * (maxLeft - marginX));
    const newTop = Math.floor(marginTop + Math.random() * (maxTop - marginTop));

    runawayBtn.style.position = 'fixed';
    runawayBtn.style.left = `${newLeft}px`;
    runawayBtn.style.top = `${newTop}px`;
    runawayBtn.style.zIndex = '9999';

    
    const banter = lines[evasionCount - 1] || fallbackBanter[evasionCount - 1];
    dialogText.textContent = isMobile ? `${banter} (${evasionCount}/5)` : banter;
    dialogBubble.classList.add('scale-105');
    setTimeout(() => dialogBubble.classList.remove('scale-105'), 200);

  } else {
    lockButton();
  }
}

function lockButton() {
  isSealLocked = true;
  
  
  if (sealHomeSlot && runawayBtn.parentElement !== sealHomeSlot) {
    sealHomeSlot.appendChild(runawayBtn);
  }

  runawayBtn.style.position = 'relative';
  runawayBtn.style.left = 'auto';
  runawayBtn.style.top = 'auto';
  runawayBtn.style.zIndex = '50';
  runawayBtn.classList.add('locked');

  
  runawayBtn.innerHTML = `
    <i class="fa-solid fa-lock-open text-2xl text-white mb-0.5 pointer-events-none"></i>
    <span class="text-[9px] font-mono font-bold tracking-wider text-white uppercase pointer-events-none">OPEN</span>
  `;

  const lines = getDodgeLines();
  dialogText.textContent = lines[5] || fallbackBanter[5];
}

let touchHoldTimer = null;

runawayBtn.addEventListener('mouseenter', dodgeButton);

runawayBtn.addEventListener('touchstart', (e) => {
  if (isSealLocked) return;
  e.preventDefault();

  if (navigator.vibrate) {
    try { navigator.vibrate(25); } catch(err) {}
  }

  touchHoldTimer = setTimeout(() => {
    if (!isSealLocked) {
      if (navigator.vibrate) {
        try { navigator.vibrate([30, 50, 30]); } catch(err) {}
      }
      lockButton();
    }
  }, 900);

  dodgeButton(e);
}, { passive: false });

runawayBtn.addEventListener('touchend', () => {
  if (touchHoldTimer) {
    clearTimeout(touchHoldTimer);
    touchHoldTimer = null;
  }
});

runawayBtn.addEventListener('click', () => {
  if (!isSealLocked) {
    lockButton();
  }
  openPinModal();
});

const pinModal = document.getElementById('pinModal');
const pinInput = document.getElementById('pinInput');
const pinError = document.getElementById('pinError');
const togglePinVis = document.getElementById('togglePinVis');
const cancelPinBtn = document.getElementById('cancelPinBtn');
const submitPinBtn = document.getElementById('submitPinBtn');

function openPinModal() {
  pinModal.classList.remove('hidden');
  pinInput.value = '';
  pinError.classList.add('hidden');
  setTimeout(() => pinInput.focus(), 100);
}

function closePinModal() {
  pinModal.classList.add('hidden');
  pinInput.value = '';
  pinError.classList.add('hidden');
}

cancelPinBtn.addEventListener('click', closePinModal);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !pinModal.classList.contains('hidden')) {
    closePinModal();
  }
});

togglePinVis.addEventListener('click', () => {
  const isPass = pinInput.getAttribute('type') === 'password';
  pinInput.setAttribute('type', isPass ? 'text' : 'password');
  togglePinVis.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
});

async function getEncryptedCipher() {
  
  if (window.ENCRYPTED_MESSAGE_PAYLOAD && window.ENCRYPTED_MESSAGE_PAYLOAD.cipher) {
    return window.ENCRYPTED_MESSAGE_PAYLOAD.cipher;
  }
  
  try {
    const res = await fetch('data/message.json');
    if (res.ok) {
      const data = await res.json();
      return data.cipher;
    }
  } catch(e) {}
  return null;
}

function decryptCipher(cipherB64, pin) {
  try {
    const rawStr = atob(cipherB64);
    const keyChars = pin.split('').map(c => c.charCodeAt(0));
    const decryptedBytes = new Uint8Array(rawStr.length);
    for (let i = 0; i < rawStr.length; i++) {
      decryptedBytes[i] = rawStr.charCodeAt(i) ^ keyChars[i % keyChars.length];
    }
    const decodedStr = new TextDecoder('utf-8').decode(decryptedBytes);
    return JSON.parse(decodedStr);
  } catch(e) {
    return null;
  }
}

async function verifyAndDecrypt() {
  const enteredPin = pinInput.value.trim();
  if (!enteredPin) {
    pinError.textContent = "Pakilagay po ang PIN passcode.";
    pinError.classList.remove('hidden');
    return;
  }

  const cipher = await getEncryptedCipher();
  if (!cipher) {
    pinError.textContent = "Error: Hindi ma-load ang encrypted message payload.";
    pinError.classList.remove('hidden');
    return;
  }

  const payload = decryptCipher(cipher, enteredPin);

  if (payload && payload.greeting && payload.paragraphs) {
    closePinModal();
    executeUnboxingSequence(payload);
  } else {
    pinError.textContent = "Maling PIN po Ma'am Roan. Subukan po ulit!";
    pinError.classList.remove('hidden');
    pinInput.classList.add('border-[#A33333]');
    setTimeout(() => pinInput.classList.remove('border-[#A33333]'), 1000);
  }
}

submitPinBtn.addEventListener('click', verifyAndDecrypt);
pinInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    verifyAndDecrypt();
  }
});

function executeUnboxingSequence(data) {
  
  playWaxCrackSound();
  setTimeout(playPaperRustle, 250);
  setTimeout(playHarpChime, 600);

  
  if (window.confetti) {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#A33333', '#C2873E', '#4D6B5A', '#E8D5BE', '#FAF0DE']
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C2873E', '#4D6B5A', '#FAF6ED']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#A33333', '#3E5B70', '#FAF6ED']
      });
    }, 350);
  }

  
  const envelope = document.getElementById('ghibliEnvelope');
  envelope.classList.add('is-open');

  
  document.getElementById('decryptedGreeting').textContent = data.greeting;
  
  const paragraphsContainer = document.getElementById('decryptedParagraphs');
  paragraphsContainer.innerHTML = '';
  data.paragraphs.forEach(pText => {
    const p = document.createElement('p');
    p.innerHTML = pText;
    paragraphsContainer.appendChild(p);
  });

  if (data.quote) {
    document.getElementById('decryptedQuote').textContent = `"${data.quote}"`;
  }
  if (data.dedication) {
    const el = document.getElementById('decryptedQuoteDedication');
    if (el) el.textContent = data.dedication;
  }

  if (data.signoff) {
    document.getElementById('decryptedSignoffLabel').textContent = data.signoff.label || 'With deepest gratitude,';
    document.getElementById('decryptedSignoffName').textContent = data.signoff.name || 'Prinz Charles M. Paderes';
    document.getElementById('decryptedSignoffRole').textContent = data.signoff.role || 'Student, ITWS02';
  }

  
  const letterCard = document.getElementById('letterCard');
  letterCard.classList.remove('hidden');
  letterCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

  
  const config = window.POSTAL_CONFIG || {};
  dialogText.textContent = data.successMessage || config.successMessage || "Parcel successfully opened! Maraming salamat po Ma'am Roan! 🌸";
}

document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

document.getElementById('refoldBtn').addEventListener('click', () => {
  playPaperRustle();
  const envelope = document.getElementById('ghibliEnvelope');
  envelope.classList.remove('is-open');
  const letterCard = document.getElementById('letterCard');
  letterCard.classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const config = window.POSTAL_CONFIG || {};
  dialogText.textContent = config.refoldMessage || "Closed! Pwede nyo po uli sya buksan anytime!";
});

const sprite1 = document.getElementById('sootSprite1');
const sprite2 = document.getElementById('sootSprite2');

function triggerSpriteAnimation(sprite) {
  playPopSound();
  sprite.classList.add('wobble');
  setTimeout(() => sprite.classList.remove('wobble'), 400);
}

if (sprite1) sprite1.addEventListener('click', () => triggerSpriteAnimation(sprite1));
if (sprite2) sprite2.addEventListener('click', () => triggerSpriteAnimation(sprite2));

document.getElementById('audioBtn').addEventListener('click', toggleMusicBox);

function createGentleLeaves() {
  const leafCount = 6;
  const leafSymbols = ['🍃', '🍂', '🌿'];
  for (let i = 0; i < leafCount; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'falling-leaf';
    leaf.textContent = leafSymbols[Math.floor(Math.random() * leafSymbols.length)];
    leaf.style.left = `${Math.random() * 95}vw`;
    leaf.style.animationDuration = `${8 + Math.random() * 10}s`;
    leaf.style.animationDelay = `${Math.random() * 8}s`;
    leaf.style.fontSize = `${14 + Math.random() * 10}px`;
    document.body.appendChild(leaf);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  applyPostalConfig();
  createGentleLeaves();
  initAutoPlayMusic();
});
