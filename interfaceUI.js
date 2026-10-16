class InterfaceUI {
    constructor() {
        // Coordenadas dos botões para deteção de clique
        this.btnIniciar = { x: 0, y: 0, w: 320, h: 52 };
        this.btnReiniciar = { x: 0, y: 0, w: 420, h: 54 };
    }

    // Rodapé obrigatório em todas as telas (Requisito 3)
    desenharRodape() {
        push();
        fill(0);
        noStroke();
        textSize(16);
        textStyle(BOLD);
        textAlign(LEFT, BOTTOM);
        text("Food Waste Reduction", 25, height - 15);
        textAlign(RIGHT, BOTTOM);
        text("Ulysse Cancela, 33135 - ECGM", width - 25, height - 15);
        pop();
    }

    // ==========================================
    // ECRÃ 1: INÍCIO & CALIBRAÇÃO
    // ==========================================
    desenharEcraInicio(audio) {
        push();
        textAlign(CENTER, CENTER);
        fill(0);
        noStroke();

        // Título com tracinhos decorativos laterais
        textSize(46);
        textStyle(BOLD);
        text("FRIDGE DEFENSE:", width / 2, 70);
        textSize(34);
        text("FOOD WASTE REDUCTION", width / 2, 115);

        // Tracinhos decorativos do título
        stroke(0);
        strokeWeight(3.5);
        line(width / 2 - 270, 65, width / 2 - 240, 75);
        line(width / 2 - 275, 90, width / 2 - 242, 85);
        line(width / 2 - 260, 115, width / 2 - 238, 100);

        line(width / 2 + 270, 65, width / 2 + 240, 75);
        line(width / 2 + 275, 90, width / 2 + 242, 85);
        line(width / 2 + 260, 115, width / 2 + 238, 100);

        // Caixa Central
        let cx = width / 2 - 230;
        let cy = 155;
        let cw = 460;
        let ch = 465;
        fill(255);
        stroke(0);
        strokeWeight(3);
        rect(cx, cy, cw, ch, 12);

        // Subtítulo COMO JOGAR:
        noStroke();
        fill(0);
        textAlign(LEFT, TOP);
        textSize(20);
        text("COMO JOGAR:", cx + 40, cy + 28);
        stroke(0);
        strokeWeight(2.5);
        line(cx + 40, cy + 54, cx + 190, cy + 54);

        // Ícone do Rato
        noFill();
        rect(cx + 55, cy + 75, 34, 52, 16);
        line(cx + 55, cy + 95, cx + 89, cy + 95);
        line(cx + 72, cy + 75, cx + 72, cy + 95);

        // Texto Rato
        noStroke();
        fill(0);
        textSize(14);
        text("• MOVIMENTA O RATO PARA APONTAR\n  E DISPARAR SPRAY CONSERVANTE\n  CONTRA OS MICRÓBIOS.", cx + 115, cy + 76);

        // Ícone do Microfone
        noFill();
        stroke(0);
        strokeWeight(2.5);
        rect(cx + 62, cy + 150, 20, 32, 10);
        arc(cx + 72, cy + 170, 34, 34, 0, PI);
        line(cx + 72, cy + 187, cx + 72, cy + 202);
        line(cx + 58, cy + 202, cx + 86, cy + 202);

        // Texto Microfone
        noStroke();
        fill(0);
        text("• SOPRA PARA ATIVAR A ONDA CRIOGÉNICA\n  (1.5s) OU SOPRA > 2s PARA PROTEGER\n  O ALIMENTO MAIS DANIFICADO.", cx + 115, cy + 154);

        // Secção Calibração do Microfone
        textSize(17);
        text("CALIBRAÇÃO DO MICROFONE (VOLUME)", cx + 40, cy + 240);
        stroke(0);
        strokeWeight(2.5);
        line(cx + 40, cy + 265, cx + 410, cy + 265);

        // Barra de Volume com Riscas Diagonais
        let bx = cx + 40;
        let by = cy + 282;
        let bw = 380;
        let bh = 22;
        this.desenharBarraRiscada(bx, by, bw, bh, audio.volumeAtual, 0.5);

        // Marcadores MÍN (LIMIAR) e MÁX (LIMIAR)
        let xMin = bx + constrain(map(audio.limiarMin, 0, 0.5, 0, bw), 15, bw - 40);
        let xMax = bx + constrain(map(audio.limiarMax, 0, 0.5, 0, bw), 40, bw - 15);
        stroke(0);
        strokeWeight(2.5);
        line(xMin, by + bh + 5, xMin, by + bh + 18);
        line(xMax, by + bh + 5, xMax, by + bh + 18);

        noStroke();
        fill(0);
        textAlign(CENTER, TOP);
        textSize(11);
        text("MÍN.\n(LIMIAR)", xMin, by + bh + 22);
        text("MÁX.\n(LIMIAR)", xMax, by + bh + 22);

        // Botão CALIBRAR & INICIAR
        this.btnIniciar.x = width / 2 - this.btnIniciar.w / 2;
        this.btnIniciar.y = cy + 380;

        let ratoSobreBtn = this.cliqueDentro(mouseX, mouseY, this.btnIniciar);
        fill(ratoSobreBtn ? 235 : 255);
        stroke(0);
        strokeWeight(2.5);
        rect(this.btnIniciar.x, this.btnIniciar.y, this.btnIniciar.w, this.btnIniciar.h, 8);

        noStroke();
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(20);
        let textoBtn = audio.emCalibracao ? "A CALIBRAR RUÍDO..." : "CALIBRAR & INICIAR";
        text(textoBtn, width / 2, this.btnIniciar.y + this.btnIniciar.h / 2);

        pop();
        this.desenharRodape();
    }

    // ==========================================
    // ECRÃ 2: HUD DE JOGO E FRIGORÍFICO
    // ==========================================
    desenharHUD(tempoSegundos, pontos, vidas, audio) {
        push();
        // Barra Superior HUD
        fill(255);
        stroke(0);
        strokeWeight(2.5);
        rect(15, 12, width - 30, 50, 8);

        // Formatar tempo MM:SS
        let mins = nf(floor(tempoSegundos / 60), 2);
        let segs = nf(floor(tempoSegundos % 60), 2);

        // 1. Relógio + Tempo
        stroke(0);
        strokeWeight(2);
        noFill();
        ellipse(48, 39, 28, 28);
        line(48, 21, 48, 25);
        line(43, 21, 53, 21);
        line(48, 39, 48, 30);
        line(48, 39, 55, 39);

        noStroke();
        fill(0);
        textStyle(BOLD);
        textSize(20);
        textAlign(LEFT, CENTER);
        text("Tempo: " + mins + ":" + segs, 72, 38);

        // Separador 1
        stroke(0);
        strokeWeight(2);
        line(235, 22, 235, 52);

        // 2. Estrela + Pontos
        this.desenharEstrela(268, 37, 8, 16);
        noStroke();
        fill(0);
        text("Pontos: " + pontos, 292, 38);

        // Separador 2
        stroke(0);
        strokeWeight(2);
        line(445, 22, 445, 52);

        // 3. Vidas + Corações
        noStroke();
        fill(0);
        text("Vidas:", 465, 38);
        for (let i = 0; i < 3; i++) {
            this.desenharCoracao(550 + i * 36, 33, 18, i < vidas);
        }

        // Separador 3
        stroke(0);
        strokeWeight(2);
        line(665, 22, 665, 52);

        // 4. Microfone + Barra de Volume
        noFill();
        stroke(0);
        strokeWeight(2);
        rect(685, 23, 12, 20, 6);
        arc(691, 35, 20, 20, 0, PI);
        line(691, 45, 691, 53);
        line(683, 53, 699, 53);

        noStroke();
        fill(0);
        textSize(15);
        text("Volume do microfone:", 712, 38);

        // Barra de áudio do HUD com limites da histerese assinalados (Requisito 9)
        let bx = 885;
        let by = 28;
        let bw = 175;
        let bh = 18;
        this.desenharBarraRiscada(bx, by, bw, bh, audio.volumeAtual, 0.5);

        // Linhas dos limites de histerese na barra do HUD
        let xMin = bx + constrain(map(audio.limiarMin, 0, 0.5, 0, bw), 2, bw - 2);
        let xMax = bx + constrain(map(audio.limiarMax, 0, 0.5, 0, bw), 2, bw - 2);
        stroke(200, 0, 0);
        strokeWeight(2);
        line(xMin, by - 3, xMin, by + bh + 3);
        line(xMax, by - 3, xMax, by + bh + 3);

        pop();
        this.desenharRodape();
    }

    desenharFrigorifico() {
        push();
        let fx = width / 2 - 105;
        let fy = height / 2 - 140;
        let fw = 210;
        let fh = 310;

        // Corpo externo do Frigorífico
        fill(255);
        stroke(0);
        strokeWeight(3);
        rect(fx, fy, fw, fh, 10);

        // Moldura interna
        rect(fx + 10, fy + 10, fw - 20, fh - 20, 4);

        // Pés do frigorífico
        rect(fx + 12, fy + fh, 20, 8, 2);
        rect(fx + fw - 32, fy + fh, 20, 8, 2);

        // Dobradiças laterais direitas
        rect(fx + fw, fy + 35, 8, 28, 2);
        rect(fx + fw, fy + fh - 65, 8, 28, 2);

        // Duas prateleiras internas
        fill(245);
        rect(fx + 15, fy + 95, fw - 30, 7, 2);
        rect(fx + 15, fy + 195, fw - 30, 7, 2);

        // Tracinhos de brilho nos cantos internos (como no teu mockup!)
        strokeWeight(2);
        line(fx + 18, fy + 20, fx + 26, fy + 28);
        line(fx + fw - 18, fy + 20, fx + fw - 26, fy + 28);
        line(fx + 18, fy + 112, fx + 26, fy + 120);
        line(fx + fw - 18, fy + 112, fx + fw - 26, fy + 120);
        line(fx + 18, fy + fh - 20, fx + 26, fy + fh - 28);
        line(fx + fw - 18, fy + fh - 20, fx + fw - 26, fy + fh - 28);

        pop();
    }

    desenharMira(x, y) {
        push();
        translate(x, y);
        stroke(0);
        strokeWeight(2.5);
        noFill();
        ellipse(0, 0, 32, 32);
        line(-22, 0, -10, 0);
        line(10, 0, 22, 0);
        line(0, -22, 0, -10);
        line(0, 10, 0, 22);
        fill(0);
        ellipse(0, 0, 3, 3);
        pop();
    }

    // ==========================================
    // ECRÃ 3: RELATÓRIO DE DESPERDÍCIO (GAME OVER)
    // ==========================================
    desenharEcraFim(pontos, tempoSegundos, percSalva, percDesperdicada) {
        push();
        textAlign(CENTER, CENTER);
        fill(0);
        noStroke();

        // Título Game Over
        textSize(42);
        textStyle(BOLD);
        text("RELATÓRIO DE DESPERDÍCIO", width / 2, 75);
        textSize(36);
        text("GAME OVER", width / 2, 125);

        // Tracinhos laterais do título
        stroke(0);
        strokeWeight(3.5);
        line(width / 2 - 330, 65, width / 2 - 300, 75);
        line(width / 2 - 335, 90, width / 2 - 302, 85);
        line(width / 2 - 320, 115, width / 2 - 298, 100);

        line(width / 2 + 330, 65, width / 2 + 300, 75);
        line(width / 2 + 335, 90, width / 2 + 302, 85);
        line(width / 2 + 320, 115, width / 2 + 298, 100);

        // Caixa do Relatório
        let cx = width / 2 - 260;
        let cy = 175;
        let cw = 520;
        let ch = 310;
        fill(255);
        stroke(0);
        strokeWeight(3);
        rect(cx, cy, cw, ch, 10);

        let mins = nf(floor(tempoSegundos / 60), 2);
        let segs = nf(floor(tempoSegundos % 60), 2);

        // 1. Linha Pontuação Final
        this.desenharEstrela(cx + 65, cy + 50, 10, 22);
        this.desenharTextoRelatorio(cx, cy + 50, "PONTUAÇÃO FINAL:", pontos);

        // 2. Linha Tempo Sobrevivido
        stroke(0);
        strokeWeight(2.5);
        noFill();
        ellipse(cx + 65, cy + 120, 38, 38);
        line(cx + 65, cy + 95, cx + 65, cy + 101);
        line(cx + 58, cy + 95, cx + 72, cy + 95);
        line(cx + 65, cy + 120, cx + 65, cy + 108);
        line(cx + 65, cy + 120, cx + 74, cy + 125);
        this.desenharTextoRelatorio(cx, cy + 120, "TEMPO SOBREVIVIDO:", mins + ":" + segs);

        // 3. Linha Comida Salva (Ícone Maçã)
        stroke(0);
        strokeWeight(2.5);
        noFill();
        ellipse(cx + 59, cy + 195, 24, 28);
        ellipse(cx + 71, cy + 195, 24, 28);
        fill(255);
        noStroke();
        rect(cx + 57, cy + 183, 16, 24);
        stroke(0);
        arc(cx + 59, cy + 195, 24, 28, HALF_PI, PI + HALF_PI);
        arc(cx + 71, cy + 195, 24, 28, -HALF_PI, HALF_PI);
        line(cx + 65, cy + 182, cx + 65, cy + 172);
        this.desenharTextoRelatorio(cx, cy + 192, "COMIDA SALVA:", percSalva + "%");

        // 4. Linha Comida Desperdiçada (Ícone Caixote do Lixo)
        stroke(0);
        strokeWeight(2.5);
        noFill();
        rect(cx + 50, cy + 250, 30, 34, 3);
        rect(cx + 46, cy + 244, 38, 6, 2);
        rect(cx + 59, cy + 239, 12, 5, 2);
        line(cx + 58, cy + 257, cx + 58, cy + 276);
        line(cx + 65, cy + 257, cx + 65, cy + 276);
        line(cx + 72, cy + 257, cx + 72, cy + 276);
        this.desenharTextoRelatorio(cx, cy + 265, "COMIDA DESPERDIÇADA:", percDesperdicada + "%");

        // Botão JOGAR NOVAMENTE / REINICIAR
        this.btnReiniciar.x = width / 2 - this.btnReiniciar.w / 2;
        this.btnReiniciar.y = cy + ch + 40;

        let ratoSobre = this.cliqueDentro(mouseX, mouseY, this.btnReiniciar);
        fill(ratoSobre ? 235 : 255);
        stroke(0);
        strokeWeight(3);
        rect(this.btnReiniciar.x, this.btnReiniciar.y, this.btnReiniciar.w, this.btnReiniciar.h, 8);

        noStroke();
        fill(0);
        textSize(20);
        text("JOGAR NOVAMENTE / REINICIAR", width / 2, this.btnReiniciar.y + this.btnReiniciar.h / 2);

        pop();
        this.desenharRodape();
    }

    // ==========================================
    // FUNÇÕES AUXILIARES DE DESENHO
    // ==========================================
    desenharTextoRelatorio(cx, y, titulo, valor) {
        noStroke();
        fill(0);
        textAlign(LEFT, CENTER);
        textSize(18);
        text(titulo, cx + 115, y);
        textSize(28);
        text(valor, cx + 385, y);
    }

    desenharBarraRiscada(x, y, w, h, valor, valorMax) {
        stroke(0);
        strokeWeight(2.5);
        fill(255);
        rect(x, y, w, h, 6);

        let largPreenchida = constrain(map(valor, 0, valorMax, 0, w), 0, w);
        if (largPreenchida > 4) {
            rect(x, y, largPreenchida, h, 6);
            // Desenha riscas diagonais dentro da parte preenchida (igual ao teu mockup)
            strokeWeight(2);
            for (let rx = x + 6; rx < x + largPreenchida - 4; rx += 8) {
                line(rx, y + h - 2, min(rx + 8, x + largPreenchida - 2), y + 2);
            }
        }
    }

    desenharEstrela(x, y, raio1, raio2) {
        push();
        translate(x, y);
        stroke(0);
        strokeWeight(2.5);
        fill(255);
        beginShape();
        for (let a = -HALF_PI; a < TWO_PI - HALF_PI; a += TWO_PI / 5) {
            vertex(cos(a) * raio2, sin(a) * raio2);
            let aMeio = a + TWO_PI / 10;
            vertex(cos(aMeio) * raio1, sin(aMeio) * raio1);
        }
        endShape(CLOSE);
        pop();
    }

    desenharCoracao(x, y, tam, preenchido) {
        push();
        translate(x, y);
        stroke(0);
        strokeWeight(2);
        fill(preenchido ? color(255, 180, 180) : 255);
        beginShape();
        vertex(0, 0);
        bezierVertex(-tam / 2, -tam / 2, -tam, tam / 3, 0, tam);
        bezierVertex(tam, tam / 3, tam / 2, -tam / 2, 0, 0);
        endShape(CLOSE);
        pop();
    }

    cliqueDentro(mx, my, botao) {
        return (mx >= botao.x && mx <= botao.x + botao.w && my >= botao.y && my <= botao.y + botao.h);
    }
}