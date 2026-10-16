class Alimento {
    constructor(x, y, tipo) {
        this.x = x;
        this.y = y;
        this.tipo = tipo; // 'PAO', 'MACA', 'LEITE'
        this.raio = 32;
        this.frescuraMax = 100;
        this.frescura = 100;
        this.contaminado = false;

        // Barreira Térmica (Requisito 12 - Ciclo de Congelação Seletiva)
        this.protegidoAte = 0;
    }

    estaProtegido() {
        return millis() < this.protegidoAte;
    }

    ativarBarreiraTermica() {
        this.protegidoAte = millis() + 4000; // Protege durante 4 segundos
        if (!this.contaminado) {
            // Recupera parte da sua vida útil (Requisito 12)
            this.frescura = min(this.frescuraMax, this.frescura + 35);
        }
    }

    sofrerDano(quantidade) {
        if (this.contaminado || this.estaProtegido()) return false;

        this.frescura -= quantidade;
        if (this.frescura <= 0) {
            this.frescura = 0;
            this.contaminado = true;
            return true; // Indica que o alimento acabou de estragar (perde 1 vida)
        }
        return false;
    }

    desenhar() {
        push();
        translate(this.x, this.y);

        // 1. Barra de frescura por cima do alimento (igual ao mockup)
        let largBarra = 64;
        let altBarra = 8;
        stroke(0);
        strokeWeight(2);
        fill(255);
        rect(-largBarra / 2, -48, largBarra, altBarra, 3);

        // Preenchimento da barra
        noStroke();
        if (this.contaminado) {
            fill(120);
        } else if (this.estaProtegido()) {
            fill(0, 180, 255); // Azul criogénico quando protegido
        } else {
            fill(0);
        }
        let largPreenchida = map(this.frescura, 0, this.frescuraMax, 0, largBarra - 2);
        rect(-largBarra / 2 + 1, -47, largPreenchida, altBarra - 2, 2);

        // 2. Efeito de Barreira Térmica (Requisito 12)
        if (this.estaProtegido()) {
            stroke(0, 170, 255);
            strokeWeight(3);
            fill(180, 235, 255, 90);
            ellipse(0, 0, this.raio * 2.4, this.raio * 2.4);
        }

        // 3. Desenho Vetorial do Alimento (Fiel ao teu Mockup)
        stroke(this.contaminado ? 130 : 0);
        strokeWeight(2.5);
        fill(this.contaminado ? color(210, 225, 195) : 255); // Esverdeado se estragado

        if (this.tipo === 'PAO') {
            // Desenho do Pão / Cacete
            beginShape();
            vertex(-42, 18);
            bezierVertex(-48, -10, 48, -15, 42, 18);
            endShape(CLOSE);
            // Cortes do pão
            line(-20, -2, -12, 8);
            line(-2, -4, 6, 6);
            line(16, -2, 24, 8);
        } 
        else if (this.tipo === 'MACA') {
            // Corpo da Maçã
            ellipse(-8, 6, 32, 36);
            ellipse(8, 6, 32, 36);
            noStroke();
            rect(-10, -8, 20, 28);
            stroke(this.contaminado ? 130 : 0);
            arc(-8, 6, 32, 36, HALF_PI, PI + HALF_PI);
            arc(8, 6, 32, 36, -HALF_PI, HALF_PI);
            // Caule e folha
            line(0, -10, 2, -22);
            fill(255);
            ellipse(8, -18, 12, 6);
        } 
        else if (this.tipo === 'LEITE') {
            // Pacote de Leite
            rect(-20, -5, 32, 38);
            quad(-20, -5, 12, -5, 6, -18, -14, -18); // Topo inclinado
            rect(-14, -23, 20, 5); // Tampa
            // Lado 3D
            quad(12, -5, 22, -10, 22, 28, 12, 33);
            line(12, -5, 6, -18);
            line(22, -10, 6, -18);
            // Rótulo com vaquinha simplificada
            rect(-14, 4, 20, 20);
            ellipse(-4, 15, 10, 8);
            point(-6, 14);
            point(-2, 14);
        }

        // Se estiver contaminado, desenha uma cruz por cima
        if (this.contaminado) {
            stroke(200, 0, 0);
            strokeWeight(3);
            line(-20, -15, 20, 20);
            line(20, -15, -20, 20);
        }

        pop();
    }
}