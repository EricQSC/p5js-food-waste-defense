class Microbio {
    constructor(x, y, alimentoAlvo, multiplicadorVelocidade) {
        this.pos = createVector(x, y);
        this.alvo = alimentoAlvo;
        this.raio = 24;
        
        // Sorteia um dos 3 visuais do teu mockup: 0 = Vírus, 1 = Bacilo, 2 = Bolor/Fungo
        this.tipoVisual = floor(random(3));
        
        // Vetor de direção orientado para o alimento central (Requisito 4)
        let direcao = createVector(this.alvo.x - this.pos.x, this.alvo.y - this.pos.y);
        direcao.normalize();
        this.velocidadeBase = random(1.0, 1.8) * multiplicadorVelocidade;
        this.vel = direcao.mult(this.velocidadeBase);
        this.angulo = this.vel.heading();

        this.congeladoAte = 0;
        this.sementeAnim = random(100);
    }

    congelar(duracaoMs) {
        this.congeladoAte = millis() + duracaoMs;
    }

    estaCongelado() {
        return millis() < this.congeladoAte;
    }

    mover() {
        if (this.estaCongelado()) return; // Não se mexe enquanto congelado pela Onda Criogénica

        // Atualiza direção caso o alimento alvo esteja definido
        let direcao = createVector(this.alvo.x - this.pos.x, this.alvo.y - this.pos.y);
        direcao.normalize();
        this.vel = direcao.mult(this.velocidadeBase);
        this.angulo = this.vel.heading();

        this.pos.add(this.vel);
    }

    desenhar() {
        push();
        translate(this.pos.x, this.pos.y);

        // Tracinhos de movimento atrás do micróbio (como tens no teu desenho!)
        if (!this.estaCongelado()) {
            push();
            rotate(this.angulo + PI); // Aponta para trás
            stroke(0);
            strokeWeight(2);
            line(32, -8, 52, -8);
            line(28, 6, 45, 6);
            pop();
        }

        // Cor de preenchimento (azul gelo se estiver congelado, branco se normal)
        let corFundo = this.estaCongelado() ? color(190, 235, 255) : color(255);
        stroke(this.estaCongelado() ? color(0, 120, 200) : 0);
        strokeWeight(2.5);
        fill(corFundo);

        let pulso = sin((frameCount + this.sementeAnim) * 0.15) * 2;

        if (this.tipoVisual === 0) {
            // TIPO 0: Vírus redondo com antenas
            for (let a = 0; a < TWO_PI; a += PI / 4) {
                let x1 = cos(a) * 18;
                let y1 = sin(a) * 18;
                let x2 = cos(a) * (27 + pulso);
                let y2 = sin(a) * (27 + pulso);
                line(x1, y1, x2, y2);
                ellipse(x2, y2, 5, 5);
            }
            ellipse(0, 0, 38, 38);
            this.desenharCaraZangada();
        } 
        else if (this.tipoVisual === 1) {
            // TIPO 1: Bactéria comprida com cílios
            push();
            rotate(this.angulo + HALF_PI);
            for (let y = -18; y <= 18; y += 9) {
                line(-14, y, -22, y);
                line(14, y, 22, y);
            }
            rect(-14, -26, 28, 52, 14);
            this.desenharCaraZangada();
            pop();
        } 
        else {
            // TIPO 2: Bolor / Fungo irregular com esporos à volta
            beginShape();
            for (let a = 0; a < TWO_PI; a += PI / 6) {
                let r = 20 + sin(a * 4 + frameCount * 0.1) * 5;
                curveVertex(cos(a) * r, sin(a) * r);
            }
            endShape(CLOSE);
            // Pontinhos de esporos à volta
            for (let a = 0; a < TWO_PI; a += PI / 3) {
                ellipse(cos(a + 0.5) * 30, sin(a + 0.5) * 30, 3, 3);
            }
            this.desenharCaraZangada();
        }

        pop();
    }

    desenharCaraZangada() {
        // Sobrancelhas e boca zangada iguais ao teu protótipo
        stroke(0);
        strokeWeight(2);
        line(-8, -6, -2, -2);
        line(8, -6, 2, -2);
        fill(0);
        ellipse(-5, -1, 2.5, 2.5);
        ellipse(5, -1, 2.5, 2.5);
        noFill();
        arc(0, 7, 10, 8, PI, TWO_PI);
    }
}