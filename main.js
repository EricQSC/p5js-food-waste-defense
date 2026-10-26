let estadoJogo = 'INICIO'; // 'INICIO', 'JOGO', 'FIM'

let audio;
let ui;
let alimentos = [];
let microbios = [];
let projeteis = [];

let pontos = 0;
let vidas = 3;
let tempoInicioJogo = 0;
let tempoSobrevivido = 0;
let ultimoSpawn = 0;
let efeitoGeloAte = 0;

let sons = {};

function preload() {
    soundFormats('mp3', 'wav');
    sons.spray = loadSound('efeitossonoros/aerosolspray.mp3');
    sons.eliminar = loadSound('efeitossonoros/splatwav.mp3');
    sons.congelar = loadSound('efeitossonoros/icedmagic.mp3');
}

function setup() {
    createCanvas(1100, 680);
    smooth();
    audio = new GestorAudio(sons);
    ui = new InterfaceUI();
    prepararNovoJogo();
}

function prepararNovoJogo() {
    pontos = 0;
    vidas = 3;
    microbios = [];
    projeteis = [];

    // Cria os 3 alimentos dentro das prateleiras do frigorífico central
    let centroX = width / 2;
    let centroY = height / 2;
    alimentos = [
        new Alimento(centroX, centroY - 75, 'PAO'),
        new Alimento(centroX, centroY + 25, 'MACA'),
        new Alimento(centroX, centroY + 125, 'LEITE')
    ];

    tempoInicioJogo = millis();
    ultimoSpawn = millis();
}

function draw() {
    background(252);
    audio.atualizar();

    if (estadoJogo === 'INICIO') {
        cursor(ARROW);
        ui.desenharEcraInicio(audio);

        // Quando a calibração automática termina, arranca o jogo!
        if (!audio.emCalibracao && audio.amostrasRuido.length > 0) {
            audio.amostrasRuido = [];
            prepararNovoJogo();
            estadoJogo = 'JOGO';
        }
    } 
    else if (estadoJogo === 'JOGO') {
        noCursor();
        executarLogicaJogo();
    } 
    else if (estadoJogo === 'FIM') {
        cursor(ARROW);
        let estatisticas = calcularEstatisticasFinais();
        ui.desenharEcraFim(pontos, tempoSobrevivido, estatisticas.salva, estatisticas.desperdicada);
    }
}

function executarLogicaJogo() {
    tempoSobrevivido = (millis() - tempoInicioJogo) / 1000;

    // 1. Verificar Microfone: Onda Criogénica (Requisito 6) e Ciclo Seletivo (Requisito 12)
    let acaoMic = audio.verificarAcionamentoMicrofone();
    
    if (acaoMic.ondaCriogenica) {
        audio.tocarSom('CONGELAR');
        efeitoGeloAte = millis() + 1500;
        for (let m of microbios) {
            m.congelar(1500); // Congela todos durante 1.5 segundos
        }
    }

    if (acaoMic.cicloSeletivo) {
        audio.tocarSom('CONGELAR');
        // Encontra o alimento não contaminado mais danificado (Requisito 12)
        let maisDanificado = null;
        let menorFrescura = 999;
        for (let a of alimentos) {
            if (!a.contaminado && a.frescura < menorFrescura) {
                menorFrescura = a.frescura;
                maisDanificado = a;
            }
        }
        if (maisDanificado) {
            maisDanificado.ativarBarreiraTermica();
        }
    }

    // Efeito azul suave no ecrã quando a Onda Criogénica está ativa
    if (millis() < efeitoGeloAte) {
        push();
        noStroke();
        fill(180, 230, 255, 65);
        rect(0, 0, width, height);
        pop();
    }

    // 2. Desenhar Frigorífico e Alimentos
    ui.desenharFrigorifico();
    for (let a of alimentos) {
        a.desenhar();
    }

    // 3. Gerar Micróbios Proceduralmente das Extremidades (Requisito 4)
    // Dificuldade progressiva: intervalo diminui e velocidade aumenta com o tempo
    let intervaloSpawn = max(650, 2200 - tempoSobrevivido * 15);
    let multVelocidade = 1 + (tempoSobrevivido * 0.012);

    if (millis() - ultimoSpawn > intervaloSpawn) {
        gerarMicrobioNasBordas(multVelocidade);
        ultimoSpawn = millis();
    }

    // 4. Atualizar e Desenhar Projéteis + Colisões Projétil-Micróbio (Requisito 7)
    for (let i = projeteis.length - 1; i >= 0; i--) {
        projeteis[i].mover();
        projeteis[i].desenhar();

        let bateu = false;
        for (let j = microbios.length - 1; j >= 0; j--) {
            let d = dist(projeteis[i].pos.x, projeteis[i].pos.y, microbios[j].pos.x, microbios[j].pos.y);
            if (d < projeteis[i].raio + microbios[j].raio) {
                audio.tocarSom('ELIMINACAO');
                microbios.splice(j, 1);
                pontos += 25;
                bateu = true;
                break;
            }
        }

        if (bateu || projeteis[i].saiuDoEcra()) {
            projeteis.splice(i, 1);
        }
    }

    // 5. Atualizar e Desenhar Micróbios + Colisões Micróbio-Alimento (Requisito 7)
    for (let i = microbios.length - 1; i >= 0; i--) {
        microbios[i].mover();
        microbios[i].desenhar();

        let alvo = microbios[i].alvo;
        let dAlimento = dist(microbios[i].pos.x, microbios[i].pos.y, alvo.x, alvo.y);

        if (dAlimento < microbios[i].raio + alvo.raio) {
            audio.tocarSom('DANO');
            let estragouAgora = alvo.sofrerDano(34); // 3 ataques estragam 1 alimento
            microbios.splice(i, 1);

            if (estragouAgora) {
                vidas--;
                if (vidas <= 0) {
                    estadoJogo = 'FIM';
                }
            }
        }
    }

    // 6. Desenhar HUD e Mira
    ui.desenharHUD(tempoSobrevivido, pontos, vidas, audio);
    ui.desenharMira(mouseX, mouseY);
}

function gerarMicrobioNasBordas(multVelocidade) {
    // Escolhe um alimento que ainda esteja fresco como alvo prioritário
    let vivos = alimentos.filter(a => !a.contaminado);
    if (vivos.length === 0) return;
    let alvoEscolhido = random(vivos);

    // Sorteia apenas entre Esquerda (0) ou Direita (1)
    let lado = floor(random(2));
    let x, y;
    
    if (lado === 0) { 
        x = -30; // Nasce fora do ecrã à esquerda
    } else { 
        x = width + 30; // Nasce fora do ecrã à direita
    }
    
    // Altura aleatória entre o fim do HUD (90) e acima do rodapé (height - 50)
    y = random(90, height - 50);

    microbios.push(new Microbio(x, y, alvoEscolhido, multVelocidade));
}

function calcularEstatisticasFinais() {
    let somaFrescura = 0;
    for (let a of alimentos) somaFrescura += a.frescura;
    let percSalva = round((somaFrescura / (alimentos.length * 100)) * 100);
    return {
        salva: percSalva,
        desperdicada: 100 - percSalva
    };
}

function mousePressed() {
    audio.ativarContextoAudio();

    if (estadoJogo === 'INICIO') {
        if (ui.cliqueDentro(mouseX, mouseY, ui.btnIniciar) && !audio.emCalibracao) {
            audio.iniciarCalibracao();
        }
    } 
    else if (estadoJogo === 'JOGO') {
        // Dispara spray conservante a partir do centro do frigorífico para a mira
        audio.tocarSom('DISPARO');
        projeteis.push(new Projetil(width / 2, height / 2 + 15, mouseX, mouseY));
    } 
    else if (estadoJogo === 'FIM') {
        if (ui.cliqueDentro(mouseX, mouseY, ui.btnReiniciar)) {
            prepararNovoJogo();
            estadoJogo = 'JOGO';
        }
    }
}