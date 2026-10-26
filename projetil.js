class Projetil {
    constructor(xInicial, yInicial, alvoX, alvoY) {
        this.pos = createVector(xInicial, yInicial);
        this.origem = createVector(xInicial, yInicial);
        this.alvo = createVector(alvoX, alvoY);
        this.raio = 12.5;
        this.velocidade = 12;

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
        
        // Apenas o visual do "tiro" em movimento
        noStroke();
        
        // Desloca para a posição da bala e roda na direção exata do disparo
        translate(this.pos.x, this.pos.y);
        rotate(this.anguloMovimento);

        // Núcleo translúcido em forma de elipse alongada
        fill(170, 230, 255, 140);
        ellipse(0, 0, this.raio * 2, this.raio * 2);

        pop();
    }
}
