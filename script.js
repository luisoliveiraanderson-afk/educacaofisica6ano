// Elenco Atual do Corinthians
const elencoCorinthians = [
  { id: 1, nome: "Memphis Depay", pos: "ATA", ovr: 82, chute: 85, precisao: 84 },
  { id: 2, nome: "Yuri Alberto", pos: "ATA", ovr: 78, chute: 80, precisao: 76 },
  { id: 3, nome: "Rodrigo Garro", pos: "MEI", ovr: 80, chute: 82, precisao: 86 },
  { id: 4, nome: "Igor Coronado", pos: "MEI", ovr: 77, chute: 78, precisao: 82 },
  { id: 5, nome: "Ángel Romero", pos: "ATA", ovr: 76, chute: 77, precisao: 78 },
  { id: 6, nome: "Breno Bidon", pos: "VOL", ovr: 74, chute: 71, precisao: 75 },
  { id: 7, nome: "Raniele", pos: "VOL", ovr: 75, chute: 70, precisao: 72 },
  { id: 8, nome: "Matheus Bidu", pos: "LE", ovr: 73, chute: 72, precisao: 70 },
  { id: 9, nome: "Fagner", pos: "LD", ovr: 75, chute: 73, precisao: 74 },
  { id: 10, nome: "André Ramalho", pos: "ZAG", ovr: 76, chute: 68, precisao: 70 },
  { id: 11, nome: "Gustavo Henrique", pos: "ZAG", ovr: 74, chute: 65, precisao: 68 },
  { id: 12, nome: "Felix Torres", pos: "ZAG", ovr: 75, chute: 66, precisao: 69 },
  { id: 13, nome: "Charles", pos: "VOL", ovr: 73, chute: 69, precisao: 71 },
  { id: 14, nome: "Alex Santana", pos: "VOL", ovr: 74, chute: 74, precisao: 72 },
  { id: 15, nome: "Pedro Henrique", pos: "ATA", ovr: 75, chute: 76, precisao: 74 },
  { id: 16, nome: "Hector Hernández", pos: "ATA", ovr: 73, chute: 75, precisao: 73 },
  { id: 17, nome: "Matheuzinho", pos: "LD", ovr: 73, chute: 70, precisao: 71 },
  { id: 18, nome: "Hugo", pos: "LE", ovr: 72, chute: 68, precisao: 69 },
  { id: 19, nome: "Ryan", pos: "VOL", ovr: 71, chute: 67, precisao: 70 },
  { id: 20, nome: "Giovane", pos: "ATA", ovr: 72, chute: 73, precisao: 71 }
];

// Perguntas da BNCC (6º Ano)
const perguntas = [
  { categoria: "Lutas do Brasil", pergunta: "Qual luta tem origem indígena e é praticada em rituais do Xingu?", opcoes: ["Capoeira", "Huca-Huca", "Jiu-Jitsu", "Judô"], correta: 1 },
  { categoria: "Jogos de Tabuleiro", pergunta: "Qual jogo de origem africana utiliza cavas e sementes?", opcoes: ["Xadrez", "Dama", "Mancala", "Ludo"], correta: 2 },
  { categoria: "Esportes", pergunta: "Qual destas modalidades representa um ESPORTE DE PRECISÃO?", opcoes: ["Corrida 100m", "Tiro com Arco", "Salto em Altura", "Natação"], correta: 1 },
  { categoria: "Aventura Urbana", pergunta: "Qual regra é ESSENCIAL nas Práticas Corporais de Aventura Urbanas?", opcoes: ["Equipamentos de segurança e respeito público", "Praticar sem olhar os obstáculos", "Danificar o patrimônio", "Ignorar planejamento de risco"], correta: 0 },
  { categoria: "Danças Criativas", pergunta: "Quais são os 4 fatores de movimento das Danças Criativas de Laban?", opcoes: ["Força, Velocidade, Altura, Largura", "Tempo, Espaço, Fluência, Peso", "Ritmo, Cansaço, Suor, Música", "Salto, Giro, Corrente, Flexão"], correta: 1 }
];

let selecionados = [];
let indiceAtual = 0;
let gols = 0, defesas = 0, fora = 0;
let aguardandoChute = false;

// THREE.JS VARS
let scene, camera, renderer;
let ballMesh, playerMesh, keeperMesh;
let textureLoader = new THREE.TextureLoader();
let isAnimating = false;

// GERADORES DINÂMICOS DE TEXTURAS (PROCEDURAIS HD)
function gerarTexturaGramado() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1e7b41'; ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = '#186836';
  for (let i = 0; i < 512; i += 32) ctx.fillRect(0, i, 512, 16);
  return new THREE.CanvasTexture(canvas);
}

function gerarTexturaUniformeTimão() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(118, 0, 20, 256); // Listra vertical
  return new THREE.CanvasTexture(canvas);
}

function gerarTexturaBolaFutebol() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#000000';
  for (let i = 20; i < 256; i += 60) {
    for (let j = 20; j < 256; j += 60) {
      ctx.beginPath(); ctx.arc(i, j, 12, 0, Math.PI * 2); ctx.fill();
    }
  }
  return new THREE.CanvasTexture(canvas);
}

function init3D() {
  const container = document.getElementById('canvas-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020408);
  scene.fog = new THREE.FogExp2(0x050a14, 0.025);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Iluminação de Refletores da Neo Química Arena
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const spot1 = new THREE.SpotLight(0xffffff, 1.2);
  spot1.position.set(-15, 20, -5); spot1.castShadow = true;
  const spot2 = new THREE.SpotLight(0xffffff, 1.2);
  spot2.position.set(15, 20, -5); spot2.castShadow = true;
  scene.add(spot1, spot2);

  // Gramado Realista com Textura
  const pitchTex = gerarTexturaGramado();
  pitchTex.wrapS = THREE.RepeatWrapping; pitchTex.wrapT = THREE.RepeatWrapping;
  pitchTex.repeat.set(2, 4);
  const pitchGeo = new THREE.PlaneGeometry(35, 50);
  const pitchMat = new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.5 });
  const pitch = new THREE.Mesh(pitchGeo, pitchMat);
  pitch.rotation.x = -Math.PI / 2; pitch.receiveShadow = true;
  scene.add(pitch);

  // Trave 3D
  const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1 });
  const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4), postMat);
  leftPost.position.set(-3.6, 1.2, -10);
  const rightPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4), postMat);
  rightPost.position.set(3.6, 1.2, -10);
  const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 7.36), postMat);
  crossbar.rotation.z = Math.PI / 2; crossbar.position.set(0, 2.4, -10);
  scene.add(leftPost, rightPost, crossbar);

  // Bola 3D com Textura de Gomos
  const ballTex = gerarTexturaBolaFutebol();
  const ballGeo = new THREE.SphereGeometry(0.22, 32, 32);
  const ballMat = new THREE.MeshStandardMaterial({ map: ballTex, roughness: 0.2 });
  ballMesh = new THREE.Mesh(ballGeo, ballMat);
  ballMesh.position.set(0, 0.22, 2); ballMesh.castShadow = true;
  scene.add(ballMesh);

  // Jogadores 3D com Textura no Uniforme
  playerMesh = createTexturedHumanoid(gerarTexturaUniformeTimão(), 0xffffff);
  scene.add(playerMesh);

  keeperMesh = createTexturedHumanoid(null, 0x111111, 0xffcc00);
  keeperMesh.position.set(0, 0, -9.8);
  scene.add(keeperMesh);

  renderer.domElement.addEventListener('click', aoClicar3D);
  animateLoop();
}

function createTexturedHumanoid(shirtTex, shortsColorHex, shirtColorHex = 0xffffff) {
  const group = new THREE.Group();
  let matShirt = shirtTex ? 
    new THREE.MeshStandardMaterial({ map: shirtTex, roughness: 0.4 }) : 
    new THREE.MeshStandardMaterial({ color: shirtColorHex, roughness: 0.4 });

  const matShorts = new THREE.MeshStandardMaterial({ color: shortsColorHex });
  const matSkin = new THREE.MeshStandardMaterial({ color: 0xd2b48c });

  // Tronco
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.3), matShirt);
  body.position.y = 1.15; body.castShadow = true;
  group.add(body);

  // Cabeça
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), matSkin);
  head.position.y = 1.65;
  group.add(head);

  // Pernas
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), matShorts);
  legL.position.set(-0.14, 0.45, 0); legL.castShadow = true;
  const legR = legL.clone(); legR.position.x = 0.14;
  group.add(legL, legR);

  return group;
}

function animateLoop() {
  requestAnimationFrame(animateLoop);
  renderer.render(scene, camera);
}

// INICIAR TRANSIÇÃO E APRESENTAÇÃO DA ESCALAÇÃO
function iniciarEntradaEmCampo() {
  document.getElementById('squad-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');

  if (!renderer) init3D();

  // Exibir Transmissão da Escalação Passando na Tela
  const lineupOverlay = document.getElementById('lineup-banner');
  const streamContainer = document.getElementById('lineup-stream');
  streamContainer.innerHTML = '';

  selecionados.forEach((p, idx) => {
    const item = document.createElement('div');
    item.className = 'stream-item';
    item.style.animationDelay = `${idx * 0.25}s`;
    item.innerHTML = `
      <span class="name">${idx + 1}. ${p.nome} (${p.pos})</span>
      <span class="ovr">OVR ${p.ovr}</span>
    `;
    streamContainer.appendChild(item);
  });

  lineupOverlay.classList.remove('hidden');

  // Ajuste de Câmera 3D
  camera.position.set(0, 1.8, 8);

  setTimeout(() => {
    lineupOverlay.classList.add('hidden');
    carregarRodada();
  }, 3500);
}

function carregarRodada() {
  const jogadorAtual = selecionados[indiceAtual];
  const p = perguntas[indiceAtual];

  document.getElementById('current-player-card').innerHTML = `
    <span class="p-num">${indiceAtual + 1}º</span>
    <span class="p-name">${jogadorAtual.nome}</span>
    <span class="p-ovr">OVR ${jogadorAtual.ovr}</span>
  `;

  resetPosicoes3D();

  // Animação 3D do Jogador Caminhando até a Bola
  animarAjeitarBola(() => {
    document.getElementById('quiz-tag').innerText = p.categoria;
    document.getElementById('quiz-question').innerText = `${indiceAtual + 1}. ${p.pergunta}`;
    
    const optsContainer = document.getElementById('quiz-options');
    optsContainer.innerHTML = '';
    p.opcoes.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn';
      btn.innerText = `${String.fromCharCode(65 + idx)}) ${opt}`;
      btn.onclick = () => responder(idx);
      optsContainer.appendChild(btn);
    });

    document.getElementById('quiz-overlay').classList.remove('hidden');
  });

  atualizarPlacar();
}

function animarAjeitarBola(callback) {
  playerMesh.position.set(-2, 0, 5);
  let step = 0;
  function walk() {
    step += 0.02;
    playerMesh.position.z = THREE.MathUtils.lerp(5, 2.5, step);
    playerMesh.position.x = THREE.MathUtils.lerp(-2, 0.5, step);

    if (step < 1) {
      requestAnimationFrame(walk);
    } else {
      callback();
    }
  }
  walk();
}

function responder(opcaoEscolhida) {
  const p = perguntas[indiceAtual];
  document.getElementById('quiz-overlay').classList.add('hidden');

  if (opcaoEscolhida === p.correta) {
    aguardandoChute = true;
    document.getElementById('kick-instruction').classList.remove('hidden');
  } else {
    fora++;
    executarChute3D(6, 6, true);
  }
}

function aoClicar3D(e) {
  if (!aguardandoChute || isAnimating) return;

  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  const targetX = x * 4.5;
  const targetY = (y + 0.3) * 2.5;

  aguardandoChute = false;
  document.getElementById('kick-instruction').classList.add('hidden');
  executarChute3D(targetX, Math.max(0.2, targetY), false);
}

function executarChute3D(targetX, targetY, errouTeoria) {
  isAnimating = true;

  let dentroGol = targetX >= -3.5 && targetX <= 3.5 && targetY >= 0.2 && targetY <= 2.3;
  let keeperTargetX = (Math.random() - 0.5) * 6;
  let keeperTargetY = Math.random() * 2;

  if (errouTeoria) { targetX = 7; targetY = 6; }

  let step = 0;
  function anim() {
    step += 0.04;

    ballMesh.position.x = THREE.MathUtils.lerp(0, targetX, step);
    ballMesh.position.y = THREE.MathUtils.lerp(0.22, targetY, step);
    ballMesh.position.z = THREE.MathUtils.lerp(2, -10, step);
    ballMesh.rotation.x += 0.25;

    keeperMesh.position.x = THREE.MathUtils.lerp(0, keeperTargetX, step);
    keeperMesh.position.y = THREE.MathUtils.lerp(0, keeperTargetY, step);

    if (step < 1) {
      requestAnimationFrame(anim);
    } else {
      isAnimating = false;
      checarResultado3D(targetX, targetY, dentroGol, keeperTargetX, keeperTargetY, errouTeoria);
    }
  }
  anim();
}

function checarResultado3D(tx, ty, dentro, kx, ky, errouTeoria) {
  let foiGol = false;
  let msg = "";
  const batedor = selecionados[indiceAtual].nome;

  if (errouTeoria) {
    msg = `❌ Errou a teoria! ${batedor} isolou a bola no setor norte da Neo Química Arena!`;
  } else if (!dentro) {
    fora++;
    msg = `💨 PRA FORA! A bola de ${batedor} saiu tirando tinta da trave!`;
  } else {
    let distGK = Math.hypot(tx - kx, ty - ky);
    if (distGK < 1.4) {
      defesas++;
      msg = `🧤 DEFESA DO GOLEIRO! Espalmou o chute de ${batedor}!`;
    } else {
      gols++;
      foiGol = true;
      msg = `⚽ GOOOOOOL DO TIMÃO! Na gaveta sem chances de defesa!`;
    }
  }

  document.getElementById('result-title').innerText = foiGol ? "⚽ GOOOOOOL!" : "❌ NÃO FOI GOL!";
  document.getElementById('result-title').style.color = foiGol ? "var(--green)" : "var(--red)";
  document.getElementById('result-msg').innerText = msg;
  document.getElementById('result-overlay').classList.remove('hidden');
  atualizarPlacar();
}

function resetPosicoes3D() {
  ballMesh.position.set(0, 0.22, 2);
  playerMesh.position.set(0.5, 0, 2.5);
  keeperMesh.position.set(0, 0, -9.8);
}

function proximaRodada() {
  document.getElementById('result-overlay').classList.add('hidden');
  indiceAtual++;

  if (indiceAtual < 5) {
    carregarRodada();
  } else {
    finalizarJogo();
  }
}

function atualizarPlacar() {
  document.getElementById('score-gols').innerText = gols;
  document.getElementById('score-defesas').innerText = defesas;
}

function finalizarJogo() {
  const stats = document.getElementById('final-stats');
  let avaliacao = gols >= 4 ? "🥇 CAMPEÃO DA LIBERTADORES! O Timão faz a festa na Arena!" : "🥈 VICE-CAMPEÃO! Valeu a raça até a última cobrança!";

  stats.innerHTML = `
    <p><b>Gols Marcados:</b> ${gols}</p>
    <p><b>Pênaltis Perdidos/Defendidos:</b> ${defesas + fora}</p>
    <br><p style="color: var(--gold); font-weight:800; font-size: 1.1rem;">${avaliacao}</p>
  `;
  document.getElementById('final-overlay').classList.remove('hidden');
}

function renderizarElenco() {
  const listEl = document.getElementById('players-list');
  listEl.innerHTML = '';

  elencoCorinthians.forEach(p => {
    const isSelected = selecionados.some(item => item.id === p.id);
    const card = document.createElement('div');
    card.className = `player-card ${isSelected ? 'selected' : ''}`;
    card.onclick = () => selecionarJogador(p);

    card.innerHTML = `
      <div class="card-top">
        <span class="card-ovr">${p.ovr}</span>
        <span class="card-pos">${p.pos}</span>
      </div>
      <div class="card-name">${p.nome}</div>
      <div class="card-stats">
        <span>CHU: ${p.chute}</span>
        <span>PRE: ${p.precisao}</span>
      </div>
    `;
    listEl.appendChild(card);
  });

  atualizarPainelSlots();
}

function selecionarJogador(jogador) {
  const index = selecionados.findIndex(p => p.id === jogador.id);
  if (index >= 0) {
    selecionados.splice(index, 1);
  } else if (selecionados.length < 5) {
    selecionados.push(jogador);
  }
  renderizarElenco();
}

function atualizarPainelSlots() {
  const slotsContainer = document.getElementById('selected-slots');
  slotsContainer.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    if (selecionados[i]) {
      slot.innerHTML = `<span>${i+1}º Batedor:</span> <b>${selecionados[i].nome}</b>`;
    } else {
      slot.innerHTML = `<span>${i+1}º Batedor:</span> <b class="empty">Vazio</b>`;
    }
    slotsContainer.appendChild(slot);
  }

  document.getElementById('count-selected').innerText = selecionados.length;
  document.getElementById('btn-start-game').disabled = selecionados.length !== 5;
}

function reiniciarTudo() {
  selecionados = [];
  indiceAtual = 0; gols = 0; defesas = 0; fora = 0;
  document.getElementById('final-overlay').classList.add('hidden');
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('squad-screen').classList.remove('hidden');
  renderizarElenco();
}

window.onload = renderizarElenco;