{
    "@context"; "https://schema.org",
    "@type"; "FireStation",
    "name"; "Bombeiros Voluntários de Proença-a-Nova",
    "alternateName"; "BVPN",
    "description"; "Associação Humanitária dos Bombeiros Voluntários de Proença-a-Nova, fundada em 1948. Ao serviço da comunidade 24 horas por dia, 365 dias por ano.",
    "foundingDate"; "1948-11-25",
    "telephone"; "+351274671444",
    "email"; "geral@bvproencaanova.pt",
    "taxID"; "500987564",
    "url"; "https://bvproencanova.pt",
    "address"; {
      "@type"; "PostalAddress",
      "streetAddress"; "Largo dos Bombeiros, nº 13",
      "postalCode"; "6150-411",
      "addressLocality"; "Proença-a-Nova",
      "addressCountry"; "PT"
    };
    "geo"; {
      "@type"; "GeoCoordinates",
      "latitude"; 39.750228,
      "longitude"; -7.922805
    };
    "openingHours"; "Mo-Su 00:00-24:00",
    "sameAs"; [
      "https://www.facebook.com/bvpn0507/",
      "https://www.instagram.com/bombeiros_proenca_a_nova/"
    ]
  }
  


  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));



function navTo(section) {
  closeMenu();
  if(document.getElementById('games-page').classList.contains('active')) {
    closeGames();
   requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
  } else {
    const el = document.getElementById(section);
    if(el) el.scrollIntoView({behavior:'smooth'});
  }
  return false;
}
function openGames(){
  showScreen('lobby');
  document.getElementById('games-page').classList.add('active');
  window.scrollTo(0,0);
  document.querySelectorAll('body>*:not(nav):not(#games-page):not(script)').forEach(el=>el.style.display='none');
}
function closeGames(){
  if(typeof stopFire==='function') stopFire();
  if(typeof hideEnd==='function') hideEnd();
  document.getElementById('games-page').classList.remove('active');
  document.querySelectorAll('body>*:not(nav):not(#games-page):not(script)').forEach(el=>el.style.display='');
  window.scrollTo(0,0);
}
function exitToLobby(){
  if(typeof hideEnd==='function') hideEnd();
  if(typeof stopFire==='function') stopFire();
  showScreen('lobby');
}
// ─── GLOBALS ───────────────────────────────────────────────────────────────
let currentGame = null;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

function startGame(game) {
  currentGame = game;
  hideEnd();
  if (game === 'memory') initMemory();
  else if (game === 'puzzle') initPuzzle();
  else if (game === 'fire') initFire();
  showScreen('screen-' + game);
}

function exitToLobby() {
  hideEnd();
  stopFire();
  showScreen('lobby');
}

function restartGame() {
  hideEnd();
  startGame(currentGame);
}

function showEnd(icon, title, sub) {
  document.getElementById('endIcon').textContent = icon;
  document.getElementById('endTitle').textContent = title;
  document.getElementById('endSub').textContent = sub;
  document.getElementById('endOverlay').style.display = 'flex';
}

function hideEnd() {
  document.getElementById('endOverlay').style.display = 'none';
}

// ─── MEMORY GAME ───────────────────────────────────────────────────────────
const MEM_EMOJIS = ['🚒','🔥','🪣','⛑️','🧯','🚨','🌊','🪖'];
let memCards = [], memFlipped = [], memMatched = 0, memTries = 0, memTimer = null, memSecs = 0, memLocked = false;

function initMemory() {
  clearInterval(memTimer);
  memFlipped = []; memMatched = 0; memTries = 0; memSecs = 0; memLocked = false;
  document.getElementById('mem-tries').textContent = 0;
  document.getElementById('mem-pairs').textContent = 0;
  document.getElementById('mem-time').textContent = '0s';

  const pairs = [...MEM_EMOJIS, ...MEM_EMOJIS].sort(() => Math.random() - 0.5);
  const grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  memCards = [];

  pairs.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    // cover = what you see when card is face down; reveal = the emoji (rotated 180 so it shows when flipped)
    card.innerHTML = `<div class="mem-inner">
      <div class="mem-face mem-cover"><span class="mem-cover-icon">🔥</span><span class="mem-cover-text">BV</span></div>
      <div class="mem-face mem-reveal">${emoji}</div>
    </div>`;
    card.dataset.emoji = emoji;

    // Show emojis briefly at start (flipped state)
    card.classList.add('flipped');
    card.addEventListener('click', () => flipMemCard(card));
    grid.appendChild(card);
    memCards.push(card);
  });

  // Hide after 2.5s - remove flipped to show covers
  setTimeout(() => {
    memCards.forEach(c => { if (!c.classList.contains('matched')) c.classList.remove('flipped'); });
    memTimer = setInterval(() => {
      memSecs++;
      document.getElementById('mem-time').textContent = memSecs + 's';
    }, 1000);
  }, 2500);
}

function flipMemCard(card) {
  if (memLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  memFlipped.push(card);
  if (memFlipped.length === 2) {
    memLocked = true;
    memTries++;
    document.getElementById('mem-tries').textContent = memTries;
    const [a, b] = memFlipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      a.classList.add('matched'); b.classList.add('matched');
      memMatched++;
      document.getElementById('mem-pairs').textContent = memMatched;
      memFlipped = []; memLocked = false;
      if (memMatched === 8) {
        clearInterval(memTimer);
        setTimeout(() => showEnd('🏆','PARABÉNS!', `Encontraste todos os pares em ${memTries} tentativas e ${memSecs} segundos!`), 400);
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped'); b.classList.remove('flipped');
        memFlipped = []; memLocked = false;
      }, 900);
    }
  }
}

// ─── PUZZLE GAME ───────────────────────────────────────────────────────────
const PUZ_SIZE = 3, PUZ_PX = 160;
let puzTiles = [], puzMoves = 0, puzEmptyIdx = 8;

function drawPuzzleImage(canvas, size) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width = size, h = canvas.height = size;
  // Draw a fire truck scene
  ctx.fillStyle = '#1a1714'; ctx.fillRect(0,0,w,h);
  // Sky
  const sky = ctx.createLinearGradient(0,0,0,h*0.55);
  sky.addColorStop(0,'#0a1628'); sky.addColorStop(1,'#1a2a4a');
  ctx.fillStyle = sky; ctx.fillRect(0,0,w,h*0.55);
  // Ground
  ctx.fillStyle = '#2a2218'; ctx.fillRect(0,h*0.55,w,h*0.45);
  ctx.fillStyle = '#1a1510'; ctx.fillRect(0,h*0.72,w,h*0.28);
  // Road markings
  ctx.fillStyle = '#C8972A'; ctx.fillRect(0,h*0.74,w,3);
  // Fire truck body
  const tx=w*0.08, ty=h*0.38, tw=w*0.6, th=h*0.28;
  ctx.fillStyle='#C0281C'; ctx.fillRect(tx,ty,tw,th);
  ctx.fillStyle='#8B1A10'; ctx.fillRect(tx,ty+th*0.6,tw,th*0.4);
  // Cab
  ctx.fillStyle='#C0281C'; ctx.fillRect(tx+tw*0.65,ty-th*0.25,tw*0.35,th*1.25);
  ctx.fillStyle='#4ab3f4'; ctx.fillRect(tx+tw*0.68,ty-th*0.15,tw*0.28,th*0.4);
  // Windows on truck
  ctx.fillStyle='#4ab3f4'; ctx.fillRect(tx+tw*0.05,ty+th*0.1,tw*0.18,th*0.3);
  ctx.fillStyle='#4ab3f4'; ctx.fillRect(tx+tw*0.28,ty+th*0.1,tw*0.18,th*0.3);
  // Ladder
  ctx.strokeStyle='#E8B84B'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(tx+tw*0.1,ty); ctx.lineTo(tx+tw*0.85,ty-th*0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx+tw*0.25,ty); ctx.lineTo(tx+tw*0.95,ty-th*0.6); ctx.stroke();
  for(let i=0;i<5;i++){
    const t=i/4;
    ctx.beginPath();
    ctx.moveTo(tx+tw*(0.1+0.75*t), ty-th*0.6*t);
    ctx.lineTo(tx+tw*(0.25+0.7*t), ty-th*0.6*t);
    ctx.stroke();
  }
  // Wheels
  [[tx+tw*0.12,ty+th],[tx+tw*0.38,ty+th],[tx+tw*0.62,ty+th],[tx+tw*0.82,ty+th]].forEach(([cx,cy])=>{
    ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(cx,cy,tw*0.07,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#444'; ctx.beginPath(); ctx.arc(cx,cy,tw*0.04,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#C8972A'; ctx.beginPath(); ctx.arc(cx,cy,tw*0.02,0,Math.PI*2); ctx.fill();
  });
  // Lights
  ctx.fillStyle='#ff0'; ctx.beginPath(); ctx.arc(tx+tw*0.68,ty-th*0.32,8,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#f00'; ctx.beginPath(); ctx.arc(tx+tw*0.85,ty-th*0.32,8,0,Math.PI*2); ctx.fill();
  // Text on truck
  ctx.fillStyle='white'; ctx.font=`bold ${w*0.04}px Arial`;
  ctx.textAlign='center'; ctx.fillText('BOMBEIROS',tx+tw*0.4,ty+th*0.52);
  ctx.font=`${w*0.025}px Arial`; ctx.fillText('PROENÇA-A-NOVA',tx+tw*0.4,ty+th*0.72);
  // Hose
  ctx.strokeStyle='#888'; ctx.lineWidth=6;
  ctx.beginPath(); ctx.moveTo(tx+tw*0.98,ty+th*0.5);
  ctx.bezierCurveTo(w*0.85,h*0.65,w*0.78,h*0.6,w*0.72,h*0.68); ctx.stroke();
  // Stars
  ctx.fillStyle='rgba(255,255,255,0.6)';
  [[0.1,0.05],[0.3,0.08],[0.5,0.03],[0.7,0.09],[0.9,0.06],[0.2,0.15],[0.6,0.12],[0.85,0.18]].forEach(([x,y])=>{
    ctx.beginPath(); ctx.arc(w*x,h*y,1.5,0,Math.PI*2); ctx.fill();
  });
  // Emblem
  ctx.fillStyle='rgba(200,151,42,0.9)';
  ctx.font=`bold ${w*0.06}px Arial`; ctx.textAlign='center';
  ctx.fillText('🔥',w*0.88,h*0.45);
}

function initPuzzle() {
  puzMoves = 0; puzEmptyIdx = PUZ_SIZE*PUZ_SIZE-1;
  document.getElementById('puz-moves').textContent = 0;
  document.getElementById('puz-correct').textContent = 0;
  document.getElementById('puzProgress').style.width = '0%';

  // Draw full image on preview canvas
  const prev = document.getElementById('puzzlePreviewCanvas');
  drawPuzzleImage(prev, 180);

  // Build tiles
  const board = document.getElementById('puzzleBoard');
  const totalPx = PUZ_PX * PUZ_SIZE + 3 * (PUZ_SIZE-1) + 6;
  board.style.gridTemplateColumns = `repeat(${PUZ_SIZE}, ${PUZ_PX}px)`;
  board.style.width = totalPx + 'px';

  // Create offscreen canvas for tiles
  const offscreen = document.createElement('canvas');
  drawPuzzleImage(offscreen, PUZ_PX * PUZ_SIZE);

  puzTiles = Array.from({length: PUZ_SIZE*PUZ_SIZE}, (_,i) => i);
  shufflePuzzle();

  renderPuzzle(offscreen);
}

function shufflePuzzle() {
  // Do random valid moves from solved state
  puzTiles = Array.from({length: PUZ_SIZE*PUZ_SIZE}, (_,i) => i);
  puzEmptyIdx = PUZ_SIZE*PUZ_SIZE-1;
  for(let i=0;i<200;i++){
    const neighbors = getNeighbors(puzEmptyIdx);
    const n = neighbors[Math.floor(Math.random()*neighbors.length)];
    [puzTiles[puzEmptyIdx], puzTiles[n]] = [puzTiles[n], puzTiles[puzEmptyIdx]];
    puzEmptyIdx = n;
  }
  puzMoves = 0;
  document.getElementById('puz-moves').textContent = 0;
  document.getElementById('puz-correct').textContent = 0;
  document.getElementById('puzProgress').style.width = '0%';

  const offscreen = document.createElement('canvas');
  drawPuzzleImage(offscreen, PUZ_PX * PUZ_SIZE);
  renderPuzzle(offscreen);
}

function getNeighbors(idx) {
  const row = Math.floor(idx/PUZ_SIZE), col = idx%PUZ_SIZE, n=[];
  if(row>0) n.push(idx-PUZ_SIZE);
  if(row<PUZ_SIZE-1) n.push(idx+PUZ_SIZE);
  if(col>0) n.push(idx-1);
  if(col<PUZ_SIZE-1) n.push(idx+1);
  return n;
}

function renderPuzzle(offscreen) {
  const board = document.getElementById('puzzleBoard');
  board.innerHTML = '';
  puzTiles.forEach((tile, pos) => {
    const div = document.createElement('div');
    div.className = 'puzzle-piece' + (tile === PUZ_SIZE*PUZ_SIZE-1 ? ' empty' : '');
    div.style.width = PUZ_PX + 'px';
    div.style.height = PUZ_PX + 'px';
    if(tile !== PUZ_SIZE*PUZ_SIZE-1) {
      const c = document.createElement('canvas');
      c.width = PUZ_PX; c.height = PUZ_PX;
      const ctx2 = c.getContext('2d');
      const srcX = (tile % PUZ_SIZE) * PUZ_PX;
      const srcY = Math.floor(tile / PUZ_SIZE) * PUZ_PX;
      ctx2.drawImage(offscreen, srcX, srcY, PUZ_PX, PUZ_PX, 0, 0, PUZ_PX, PUZ_PX);
      div.appendChild(c);
      if(tile === pos) div.classList.add('correct');
    }
    div.addEventListener('click', () => movePuzzlePiece(pos));
    board.appendChild(div);
  });
}

function movePuzzlePiece(pos) {
  if(!getNeighbors(puzEmptyIdx).includes(pos)) return;
  [puzTiles[puzEmptyIdx], puzTiles[pos]] = [puzTiles[pos], puzTiles[puzEmptyIdx]];
  puzEmptyIdx = pos;
  puzMoves++;
  document.getElementById('puz-moves').textContent = puzMoves;

  const correct = puzTiles.filter((t,i) => t===i).length;
  document.getElementById('puz-correct').textContent = correct;
  document.getElementById('puzProgress').style.width = (correct/(PUZ_SIZE*PUZ_SIZE)*100)+'%';

  const offscreen = document.createElement('canvas');
  drawPuzzleImage(offscreen, PUZ_PX * PUZ_SIZE);
  renderPuzzle(offscreen);

  if(puzTiles.every((t,i) => t===i)) {
    setTimeout(() => showEnd('🧩','PUZZLE COMPLETO!',`Montaste o puzzle em ${puzMoves} movimentos! Excelente!`), 300);
  }
}

// ─── FIRE GAME ─────────────────────────────────────────────────────────────
let fireCtx, fireCanvas, fireAnim, fireTimer, fireRunning=false;
let fireScore=0, fireTime=60, fireLevel=1, water=100;
let fires=[], particles=[], hoseX=350, hoseY=420, mouseX=350, mouseY=300;
let waterRecharging=false;

const BUILDING = {x:100,y:80,w:500,h:280,floors:3,windows:[]};

function buildWindows() {
  BUILDING.windows = [];
  for(let f=0;f<BUILDING.floors;f++) {
    for(let c=0;c<4;c++) {
      BUILDING.windows.push({
        x: BUILDING.x + 60 + c*110,
        y: BUILDING.y + 30 + f*85,
        w:70, h:55,
        fire:null
      });
    }
  }
}

function spawnFire(win) {
  if(win.fire) return;
  win.fire = {intensity:50, maxIntensity:50, x:win.x+win.w/2, y:win.y+win.h/2};
}

function initFire() {
  stopFire();
  fireCanvas = document.getElementById('fireCanvas');
  fireCtx = fireCanvas.getContext('2d');
  fireScore=0; fireTime=90; fireLevel=1; water=110; fires=[]; particles=[];
  document.getElementById('fire-score').textContent=0;
  document.getElementById('fire-time').textContent='90s';
  document.getElementById('fire-level').textContent=1;
  document.getElementById('waterFill').style.width='100%';
  buildWindows();

  // Start with 2 fires
  spawnFire(BUILDING.windows[5]);

  fireCanvas.addEventListener('mousemove', onFireMouseMove);
  fireCanvas.addEventListener('click', onFireClick);
  fireCanvas.addEventListener('touchmove', onFireTouch, {passive:false});
  fireCanvas.addEventListener('touchstart', onFireTouch, {passive:false});

  fireRunning = true;
  fireTimer = setInterval(fireTimerTick, 1000);
  fireAnim = requestAnimationFrame(fireLoop);
}

function stopFire() {
  fireRunning = false;
  if(fireAnim) cancelAnimationFrame(fireAnim);
  if(fireTimer) clearInterval(fireTimer);
  if(fireCanvas) {
    fireCanvas.removeEventListener('mousemove', onFireMouseMove);
    fireCanvas.removeEventListener('click', onFireClick);
  }
}

function onFireMouseMove(e) {
  const r = fireCanvas.getBoundingClientRect();
  const scaleX = fireCanvas.width / r.width;
  const scaleY = fireCanvas.height / r.height;
  mouseX = (e.clientX - r.left) * scaleX;
  mouseY = (e.clientY - r.top) * scaleY;
}

function onFireTouch(e) {
  e.preventDefault();
  const r = fireCanvas.getBoundingClientRect();
  const scaleX = fireCanvas.width / r.width;
  const scaleY = fireCanvas.height / r.height;
  const t = e.touches[0];
  mouseX = (t.clientX - r.left) * scaleX;
  mouseY = (t.clientY - r.top) * scaleY;
  if(e.type==='touchstart') onFireClick({clientX:t.clientX, clientY:t.clientY, fromTouch:true});
}

function onFireClick(e) {
  if(water <= 0) return;
  const r = fireCanvas.getBoundingClientRect();
  const scaleX = fireCanvas.width / r.width;
  const scaleY = fireCanvas.height / r.height;
  let cx, cy;
  if(e.fromTouch) { cx=mouseX; cy=mouseY; }
  else { cx=(e.clientX-r.left)*scaleX; cy=(e.clientY-r.top)*scaleY; }

  BUILDING.windows.forEach(win => {
    if(!win.fire) return;
    const dx=cx-win.fire.x, dy=cy-win.fire.y;
    if(Math.sqrt(dx*dx+dy*dy) < 55) {
      win.fire.intensity -= (45 + fireLevel*3);
      water = Math.max(0, water-7);
      document.getElementById('waterFill').style.width=water+'%';
      // Particles
      for(let i=0;i<8;i++) particles.push({x:win.fire.x,y:win.fire.y,vx:(Math.random()-0.5)*4,vy:-Math.random()*4,life:1,color:'#4ab3f4'});
      if(win.fire.intensity <= 0) {
        win.fire = null;
        fireScore += 10 * fireLevel;
        document.getElementById('fire-score').textContent = fireScore;
        // Spawn new fire elsewhere
        setTimeout(()=>{
          if(!fireRunning) return;
          const empty = BUILDING.windows.filter(w=>!w.fire);
          if(empty.length) spawnFire(empty[Math.floor(Math.random()*empty.length)]);
        }, 3500 - fireLevel*150);
      }
    }
  });
}

function fireTimerTick() {
  if(!fireRunning) return;
  fireTime--;
  document.getElementById('fire-time').textContent = fireTime+'s';

  // Recharge water
  water = Math.min(100, water + 25);
  document.getElementById('waterFill').style.width = water+'%';

  // Increase fire intensity
  BUILDING.windows.forEach(w => { if(w.fire) w.fire.intensity = Math.min(w.fire.maxIntensity, w.fire.intensity+1); });

  // Level up every 15s
  if(fireTime % 20 === 0 && fireTime > 0) {
    fireLevel++;
    document.getElementById('fire-level').textContent = fireLevel;
    // Add more fires
    const empty = BUILDING.windows.filter(w=>!w.fire);
    if(empty.length) spawnFire(empty[Math.floor(Math.random()*empty.length)]);
  }

  // Randomly spread fire
  if(Math.random() < 0.12) {
    const empty = BUILDING.windows.filter(w=>!w.fire);
    if(empty.length > 2) spawnFire(empty[Math.floor(Math.random()*empty.length)]);
  }

  if(fireTime <= 0) {
    stopFire();
    const allOut = BUILDING.windows.every(w=>!w.fire);
    if(allOut) showEnd('🏆','INCÊNDIO EXTINTO!',`Apagaste todas as chamas! Pontuação: ${fireScore} pts`);
    else {
      const remaining = BUILDING.windows.filter(w=>w.fire).length;
      if(remaining >= BUILDING.windows.length * 0.7) showEnd('😔','EDIFÍCIO DESTRUÍDO',`O fogo foi demasiado forte. Pontuação: ${fireScore} pts. Tenta novamente!`);
      else showEnd('⭐','BOM TRABALHO!',`Controlaste o incêndio! ${BUILDING.windows.filter(w=>!w.fire).length} janelas salvas. Pontuação: ${fireScore} pts`);
    }
  }
}

function fireLoop() {
  if(!fireRunning) return;
  drawFire();
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.vy+=0.1; p.life-=0.05; });
  fireAnim = requestAnimationFrame(fireLoop);
}

function drawFire() {
  const ctx = fireCtx, W=700, H=420;
  ctx.clearRect(0,0,W,H);

  // Night sky
  const sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#6AAFD6'); sky.addColorStop(1,'#A8D5EA');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Stars
  ctx.fillStyle='rgba(255,255,255,0.5)';
  [[50,20],[150,40],[280,15],[420,30],[560,10],[650,45],[80,70],[320,60],[500,50]].forEach(([x,y])=>{
    ctx.beginPath(); ctx.arc(x,y,1,0,Math.PI*2); ctx.fill();
  });

  // Ground
  const grd = ctx.createLinearGradient(0,360,0,H);
  grd.addColorStop(0,'#5a8a4a'); grd.addColorStop(1,'#4a7a3a');
  ctx.fillStyle=grd; ctx.fillRect(0,360,W,H-360);

  // Road
  ctx.fillStyle='#999'; ctx.fillRect(0,380,W,40);
  ctx.fillStyle='#C8972A';
  for(let x=0;x<W;x+=80) { ctx.fillRect(x,398,50,4); }

  // Building base
  const B = BUILDING;
  ctx.fillStyle='#e8ddd0'; ctx.fillRect(B.x,B.y,B.w,B.h+80);
  ctx.fillStyle='#c0b5a8'; ctx.fillRect(B.x,B.y,B.w,20);
  // Roof
  ctx.fillStyle='#b0a598'; ctx.fillRect(B.x-10,B.y-10,B.w+20,20);
  // Floor lines
  for(let f=1;f<B.floors;f++) {
    ctx.fillStyle='#b8afa0'; ctx.fillRect(B.x,B.y+f*85,B.w,4);
  }
  // Door
  ctx.fillStyle='#7B5234'; ctx.fillRect(B.x+B.w/2-25,B.y+B.h+20,50,60);
  ctx.fillStyle='#C8972A'; ctx.fillRect(B.x+B.w/2-2,B.y+B.h+45,4,4);

  // Windows
  BUILDING.windows.forEach(win => {
    const t = Date.now()/1000;
    if(win.fire) {
      const inten = win.fire.intensity/100;
      // Glowing window
      const glow = ctx.createRadialGradient(win.x+win.w/2,win.y+win.h/2,0,win.x+win.w/2,win.y+win.h/2,win.w);
      glow.addColorStop(0,`rgba(255,200,50,${inten})`);
      glow.addColorStop(0.5,`rgba(255,80,0,${inten*0.8})`);
      glow.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=glow; ctx.fillRect(win.x-20,win.y-20,win.w+40,win.h+40);
      ctx.fillStyle=`rgba(255,150,0,${inten*0.9})`; ctx.fillRect(win.x,win.y,win.w,win.h);
      // Animated flames
      for(let i=0;i<4;i++) {
        const fx = win.x+10+i*(win.w/4);
        const fy = win.y+win.h*0.4;
        const fh = (20+Math.sin(t*3+i)*8)*inten;
        ctx.fillStyle=`rgba(255,${100+Math.sin(t*4+i)*50},0,${inten})`;
        ctx.beginPath();
        ctx.moveTo(fx,fy+fh);
        ctx.quadraticCurveTo(fx-8,fy+fh*0.3,fx,fy);
        ctx.quadraticCurveTo(fx+8,fy+fh*0.3,fx+16,fy+fh);
        ctx.fill();
      }
      // Fire emoji indicator
      ctx.font='18px serif'; ctx.textAlign='center';
      ctx.fillText('🔥',win.x+win.w/2,win.y-8);
    } else {
      // Normal window
      ctx.fillStyle='rgba(100,150,220,0.4)'; ctx.fillRect(win.x,win.y,win.w,win.h);
      ctx.strokeStyle='rgba(0,0,0,0.1)'; ctx.lineWidth=1; ctx.strokeRect(win.x,win.y,win.w,win.h);
    }
  });

  // Fire truck (bottom)
  const tx=30, ty=355, tw=200, th=30;
  ctx.fillStyle='#C0281C'; ctx.fillRect(tx,ty,tw,th);
  ctx.fillStyle='#8B1A10'; ctx.fillRect(tx+tw*0.55,ty-12,tw*0.45,th+12);
  ctx.fillStyle='#4ab3f4'; ctx.fillRect(tx+tw*0.6,ty-8,tw*0.35,12);
  ctx.fillStyle='#111';
  ctx.beginPath(); ctx.arc(tx+30,ty+th,14,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(tx+tw-30,ty+th,14,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='white'; ctx.font='bold 9px Arial'; ctx.textAlign='center';
  ctx.fillText('BOMBEIROS',tx+tw*0.35,ty+th*0.65);
  // Hose line to mouse
  const hoseStartX = tx+tw*0.7, hoseStartY = ty;
  ctx.strokeStyle='rgba(100,180,255,0.7)'; ctx.lineWidth=4;
  ctx.setLineDash([8,4]);
  ctx.beginPath(); ctx.moveTo(hoseStartX,hoseStartY);
  ctx.quadraticCurveTo(hoseStartX,mouseY,mouseX,mouseY); ctx.stroke();
  ctx.setLineDash([]);
  // Water spray at cursor
  for(let i=0;i<3;i++) {
    ctx.fillStyle=`rgba(100,180,255,${0.3-i*0.08})`;
    ctx.beginPath(); ctx.arc(mouseX+(Math.random()-0.5)*20,mouseY+(Math.random()-0.5)*20,(3-i)*4,0,Math.PI*2); ctx.fill();
  }

  // Particles
  particles.forEach(p => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha=1;

  // HUD overlay
  if(fireTime <= 10) {
    ctx.fillStyle=`rgba(192,40,28,${0.1+Math.sin(Date.now()/200)*0.05})`;
    ctx.fillRect(0,0,W,H);
  }
}

// ─── INIT ──────────────────────────────────────────────────────────────────
if (document.getElementById('lobby')) {
  showScreen('lobby');
}

function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  const ham = document.querySelector('.hamburger');
  nav.classList.toggle('show');
  ham.textContent = nav.classList.contains('show') ? '✕' : '☰';
}

function closeMenu() {
  const nav = document.querySelector('.nav-links');
  const ham = document.querySelector('.hamburger');
  if (nav) { nav.classList.remove('show'); }
  if (ham) { ham.textContent = '☰'; }
}

// Fecha o menu ao clicar num link
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('show');
      document.querySelector('.hamburger').textContent = '☰';
    });
  });

  // Fecha o menu ao clicar fora
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    if (nav && nav.classList.contains('show') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('show');
      hamburger.textContent = '☰';
    }
  });
});