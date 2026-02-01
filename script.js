// ------------------ CONFIG ------------------
const CONFIG = {
  name: "RUCHIKA",
  dateText: "14.02.2026",

  // If you want to use a direct link instead of mp3, put it here.
  songLink: "", // example: "https://open.spotify.com/track/...."
  songMp3Path: "./assets/song.mp3", // upload assets/song.mp3 if you want audio
  qrPath: "./assets/qr.png", // optional QR image for the song link/mp3 page

  // Message text for the long letter page
  letterText: [
    "Dear weirdo,",
    "On this silly little day, I made this because I want you to know how much you mean to me.",
    "Thank you for being my person, my calm, and my chaos. Even after all the silly fights, I still choose you as my best friend every single time.",
    "Here’s to more late-night talks, random laughs, and making new memories. I love you, always. 💗"
  ].join("\n\n"),
};
// --------------------------------------------

// Screens
const screens = {
  ask: document.getElementById("screenAsk"),
  yay: document.getElementById("screenYay"),
  mail: document.getElementById("screenMail"),
  cards: document.getElementById("screenCards"),
  sealed: document.getElementById("screenSealed"),
};

function showScreen(key){
  Object.values(screens).forEach(s => s.classList.remove("screen--active"));
  screens[key].classList.add("screen--active");
}


// Buttons
const arenaAsk = document.getElementById("arenaAsk");
const btnNo = document.getElementById("btnNo");
const btnYes = document.getElementById("btnYes");

const arenaYay = document.getElementById("arenaYay");
const btnExit = document.getElementById("btnExit");
const btnNext = document.getElementById("btnNext");

const btnEnvelope = document.getElementById("btnEnvelope");
const btnBackToYay = document.getElementById("btnBackToYay");

const btnPrevCard = document.getElementById("btnPrevCard");
const btnNextCard = document.getElementById("btnNextCard");
const btnCloseAndSeal = document.getElementById("btnCloseAndSeal");
const btnRestart = document.getElementById("btnRestart");

const askTitle = document.getElementById("askTitle");
askTitle.textContent = `${CONFIG.name} will you be my Valentine?`;

// Confetti
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

function resizeCanvas(){
  confettiCanvas.width = window.innerWidth * devicePixelRatio;
  confettiCanvas.height = window.innerHeight * devicePixelRatio;
  confettiCanvas.style.width = window.innerWidth + "px";
  confettiCanvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let confettiPieces = [];
let confettiRunning = false;

function startConfetti(durationMs = 2200){
  confettiPieces = [];
  const count = 180;

  for(let i=0;i<count;i++){
    confettiPieces.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.3,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 6,
      r: 3 + Math.random() * 5,
      a: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.25,
      c: `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`,
    });
  }

  confettiRunning = true;
  const start = performance.now();

  function frame(t){
    if(!confettiRunning) return;

    ctx.clearRect(0,0, window.innerWidth, window.innerHeight);

    for(const p of confettiPieces){
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.va;
      p.vy += 0.03;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r, -p.r, p.r*2, p.r*2);
      ctx.restore();
    }

    confettiPieces = confettiPieces.filter(p => p.y < window.innerHeight + 40);

    if(t - start < durationMs){
      requestAnimationFrame(frame);
    } else {
      confettiRunning = false;
      ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
    }
  }

  requestAnimationFrame(frame);
}

// Dodge logic
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function placeButtonRandom(arenaEl, btnEl){
  const arenaRect = arenaEl.getBoundingClientRect();
  const btnRect = btnEl.getBoundingClientRect();
  const pad = 10;

  const maxX = arenaRect.width - btnRect.width - pad;
  const maxY = arenaRect.height - btnRect.height - pad;

  let x = Math.random() * maxX;
  let y = Math.random() * maxY;

  x = clamp(x, pad, maxX);
  y = clamp(y, pad, maxY);

  btnEl.style.left = `${x}px`;
  btnEl.style.top = `${y}px`;
  btnEl.style.transform = "translate(0,0)";
}

function moveIfNear(arenaEl, btnEl, mouseEvent, threshold = 80){
  const btnRect = btnEl.getBoundingClientRect();

  const mx = mouseEvent.clientX;
  const my = mouseEvent.clientY;

  const bx = btnRect.left + btnRect.width / 2;
  const by = btnRect.top + btnRect.height / 2;

  const dx = mx - bx;
  const dy = my - by;
  const dist = Math.sqrt(dx*dx + dy*dy);

  if(dist < threshold){
    placeButtonRandom(arenaEl, btnEl);
  }
}

// NO button moves on hover and proximity
btnNo.addEventListener("mouseenter", () => placeButtonRandom(arenaAsk, btnNo));
arenaAsk.addEventListener("mousemove", (e) => moveIfNear(arenaAsk, btnNo, e, 90));
btnNo.addEventListener("touchstart", (e) => {
  e.preventDefault();
  placeButtonRandom(arenaAsk, btnNo);
}, {passive:false});

// YES click (Yes stays visible, just disables itself)
btnYes.addEventListener("click", () => {
  btnYes.disabled = true;
  btnYes.style.opacity = "0.92";
  showScreen("yay");
  startConfetti(2600);
});

// EXIT button dodges like NO
btnExit.addEventListener("mouseenter", () => placeButtonRandom(arenaYay, btnExit));
arenaYay.addEventListener("mousemove", (e) => moveIfNear(arenaYay, btnExit, e, 90));
btnExit.addEventListener("touchstart", (e) => {
  e.preventDefault();
  placeButtonRandom(arenaYay, btnExit);
}, {passive:false});

// NEXT from celebration to mail
btnNext.addEventListener("click", () => showScreen("mail"));
btnBackToYay.addEventListener("click", () => showScreen("yay"));

// Envelope open
btnEnvelope.addEventListener("click", () => {
  showScreen("cards");
  renderCard();
});

// Postcard content
const cardHeaderTitle = document.getElementById("cardHeaderTitle");
const cardDate = document.getElementById("cardDate");
const cardTitle = document.getElementById("cardTitle");
const cardContent = document.getElementById("cardContent");
const cardFooterLine = document.getElementById("cardFooterLine");

cardDate.textContent = CONFIG.dateText;

const cards = [
  {
    header: "Card 1",
    title: "Happy Galentine’s Babe",
    footer: "to my forever galentine",
    showDoodles: true,
    doodleLeft: "./assets/cake.png",
    doodleRight: "./assets/flowers.png",
    html: `
      <p><strong>${CONFIG.name}</strong>, happy Galentine’s day 💗</p>
      <p>Bestie status: permanent.</p>
      <p>Today we celebrate you, me, and our unstoppable chaos.</p>
    `
  },
  {
    header: "Card 2",
    title: "Dear weirdo",
    footer: "my favorite human",
    showDoodles: false,
    html: CONFIG.letterText.split("\n\n").map(p => `<p>${escapeHtml(p)}</p>`).join("")
  },
  {
    header: "Card 3",
    title: "Hugs and kisses for you",
    footer: "mwah mwah mwah",
    showDoodles: false,
    html: `
      <p>Sending you dramatic forehead kisses and emotional support hugs.</p>
      <p>Also one tiny bite of your snacks (lying).</p>
      <p>💋💋💋</p>
    `
  },
  {
    header: "Card 4",
    title: "Coupons for you",
    footer: "use them freely",
    showDoodles: true,
    doodleLeft: "./assets/cake.png",
    doodleRight: "./assets/flowers.png",
    html: `
      <p><strong>Use them freely.</strong> I never run out when it comes to you.</p>
      <div class="ticketGrid">
        <div class="ticket">
          <div class="perforation"></div>
          <div class="miniLabel">coupon</div>
          <div class="status">unlimited</div>
          <div class="ticketText">video calls</div>
        </div>
        <div class="ticket">
          <div class="perforation"></div>
          <div class="miniLabel">coupon</div>
          <div class="status">unlimited</div>
          <div class="ticketText">hugs</div>
        </div>
        <div class="ticket">
          <div class="perforation"></div>
          <div class="miniLabel">coupon</div>
          <div class="status">valid</div>
          <div class="ticketText">your wish</div>
        </div>
        <div class="ticket">
          <div class="perforation"></div>
          <div class="miniLabel">coupon</div>
          <div class="status">unlimited</div>
          <div class="ticketText">movie night</div>
        </div>
      </div>
    `
  },
  {
    header: "Card 5",
    title: "Our Song",
    footer: "tap, listen, smile",
    showDoodles: false,
    html: `
      <p>This is our song. Press play 🎧</p>

      <div class="songBox">
        <div class="songRow">
          <audio id="songPlayer" controls preload="metadata">
            <source src="${CONFIG.songMp3Path}" type="audio/mpeg" />
            Your browser does not support audio.
          </audio>
        </div>

        <div class="recordWrap">
          <div class="record recordHidden" id="recordDisc" aria-hidden="true">
            <div class="label">
              U ARE MY FAV
              <span class="tap">tap</span>
            </div>
          </div>
        </div>

        <div class="songRow">
          <img class="qr" src="${CONFIG.qrPath}" alt="QR code" onerror="this.style.display='none';" />
        </div>
      </div>
    `

  },
  {
    header: "Card 6",
    title: "YIPPEEE!!!!!!",
    footer: "panda energy",
    showDoodles: false,
    html: `
      <p class="center"><strong>YIPPEEE!!!!!!</strong></p>
      <p class="center">Because we deserve happiness, snacks, and zero stress.</p>
      <div class="songRow">
        <img class="qr" style="width:220px" src="./assets/panda.mp4" alt="Happy panda gif" onerror="this.style.display='none';" />
      </div>
      <p class="center" style="font-size:44px;">🐼✨</p>
    `
  },
  {
    header: "Card 7",
    title: "See you soon!!",
    footer: "champagne and cake",
    showDoodles: false,
    html: `
      <p>See you soon, bestie.</p>
      <p>We’ll do cake, gossip, and a tiny bit of champagne energy 🍾</p>
      <div class="songRow">
        <img class="qr" style="width:160px" src="./assets/champagne.png" alt="" onerror="this.style.display='none';" />
        <img class="qr" style="width:160px" src="./assets/cake.png" alt="" onerror="this.style.display='none';" />
      </div>
      <p class="center">💗</p>
    `
  },
  {
    header: "Final",
    title: "Close it, seal it",
    footer: "delivered with love",
    showDoodles: false,
    html: `
      <p>Okay, no more tears. Close the envelope and act cool.</p>
      <p class="center">💌💮</p>
      <p class="tiny center">Press the button below to seal it.</p>
    `
  },
];

let cardIndex = 0;

function escapeHtml(str){
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCard(){
  const c = cards[cardIndex];
  cardHeaderTitle.textContent = c.header;
  cardTitle.textContent = c.title;
  cardFooterLine.textContent = c.footer;
  cardContent.innerHTML = c.html;

  // Doodles toggle per card
  const doodlesEl = document.getElementById("doodles");
  const leftImg = document.getElementById("doodleLeft");
  const rightImg = document.getElementById("doodleRight");
  const bodyEl = document.querySelector(".postcardBody");

  if(c.showDoodles){
    doodlesEl.classList.remove("hidden");
    bodyEl.classList.add("hasDoodles");
    if(c.doodleLeft) leftImg.src = c.doodleLeft;
    if(c.doodleRight) rightImg.src = c.doodleRight;
  } else {
    doodlesEl.classList.add("hidden");
    bodyEl.classList.remove("hasDoodles");
  }

  // Song: show record label only when play starts
  const player = document.getElementById("songPlayer");
  const disc = document.getElementById("recordDisc");
  if(player && disc){
    const showPlaying = () => {
      disc.classList.remove("recordHidden");
      disc.classList.add("spin");
    };
    const stopPlaying = () => {
      disc.classList.remove("spin");
    };
    player.addEventListener("play", showPlaying, { once:false });
    player.addEventListener("pause", stopPlaying, { once:false });
    player.addEventListener("ended", stopPlaying, { once:false });
  }
}

btnPrevCard.addEventListener("click", () => {
  cardIndex = Math.max(0, cardIndex - 1);
  renderCard();
});

btnNextCard.addEventListener("click", () => {
  cardIndex = Math.min(cards.length - 1, cardIndex + 1);
  renderCard();
});

btnCloseAndSeal.addEventListener("click", () => {
  showScreen("sealed");
  startConfetti(1800);
});

btnRestart.addEventListener("click", () => {
  cardIndex = 0;
  renderCard();
  resetPositions();
  btnYes.disabled = false;
  btnYes.style.opacity = "1";
  showScreen("ask");
});

// Initial positions
function resetPositions(){
  btnNo.style.left = "62%";
  btnNo.style.top = "50%";
  btnNo.style.transform = "translate(-50%, -50%)";

  btnExit.style.left = "62%";
  btnExit.style.top = "50%";
  btnExit.style.transform = "translate(-50%, -50%)";
}

renderCard();
resetPositions();
