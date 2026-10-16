class Projetil {
    constructor(xInicial, yInicial, alvoX, alvoY) {
        this.pos = createVector(xInicial, yInicial);
        this.origem = createVector(xInicial, yInicial);
        this.alvo = createVector(alvoX, alvoY);
        this.raio = 10;
        this.velocidade = 14;

        let direcao = p5.Vector.sub(this.alvo, this.pos);
        direcao.normalize();
        this.vel = direcao.mult(this.velocidade);
        this.tempoCriacao = millis();
    }

    mover() {
        this.pos.add(this.vel);
    }

    saiuDoEcra() {
        return (this.pos.x < 0 || this.pos.x > width || this.pos.y < 60 || this.pos.y > height);
    }

    desenhar() {
        push();
        // Desenha o cone tracejado (como no teu mockup!) nos primeiros instantes do disparo
        if (millis() - this.tempoCriacao < 180) {
            stroke(0, 150);
            strokeWeight(2);
            drawingContext.setLineDash([6, 6]); // Linha tracejada!
            line(this.alvo.x, this.alvo.y, this.pos.x - 10, this.pos.y - 10);
            line(this.alvo.x, this.alvo.y, this.pos.x + 10, this.pos.y + 10);
            line(this.alvo.x, this.alvo.y, this.pos.x, this.pos.y);
            drawingContext.setLineDash([]); // Limpa o tracejado para o resto do jogo
        }

        // Bolha de spray conservante
        stroke(0);
        strokeWeight(2.5);
        fill(220, 245, 255);
        ellipse(this.pos.x, this.pos.y, this.raio * 2);
        pop();
    }
}