class GestorAudio {
    constructor() {
        this.mic = new p5.AudioIn();
        this.mic.start();

        this.volumeAtual = 0;
        
        // Limiares de Histerese (Requisito 6)
        this.limiarMin = 0.05; // Limiar inferior (rearme)
        this.limiarMax = 0.18; // Limiar superior (disparo)
        this.histereseAtiva = false; 

        // Calibração automática (Requisito 10)
        this.emCalibracao = false;
        this.tempoInicioCalibracao = 0;
        this.amostrasRuido = [];

        // Controlo do Ciclo de Congelação Seletiva - Sopro > 2s (Requisito 12)
        this.tempoAcimaLimiarMax = 0;
        this.congelacaoSeletivaPronta = false;

        // Oscilador do p5.sound para criar efeitos sonoros sem depender de ficheiros externos
        this.osc = new p5.Oscillator('sine');
        this.osc.amp(0);
        this.osc.start();
    }

    ativarContextoAudio() {
        if (getAudioContext().state !== 'running') {
            getAudioContext().resume();
        }
    }

    iniciarCalibracao() {
        this.ativarContextoAudio();
        this.emCalibracao = true;
        this.tempoInicioCalibracao = millis();
        this.amostrasRuido = [];
    }

    atualizar() {
        // Suavização da leitura do microfone
        let leituraBruta = this.mic.getLevel();
        this.volumeAtual = lerp(this.volumeAtual, leituraBruta, 0.3);

        // Processo de calibração durante 2.5 segundos
        if (this.emCalibracao) {
            this.amostrasRuido.push(leituraBruta);
            if (millis() - this.tempoInicioCalibracao > 2500) {
                this.finalizarCalibracao();
            }
        }
    }

    finalizarCalibracao() {
        this.emCalibracao = false;
        let soma = 0;
        for (let v of this.amostrasRuido) soma += v;
        let mediaRuido = this.amostrasRuido.length > 0 ? soma / this.amostrasRuido.length : 0.02;

        // Define os limiares de histerese com base no ruído ambiente medido
        this.limiarMin = constrain(mediaRuido + 0.03, 0.03, 0.25);
        this.limiarMax = constrain(this.limiarMin + 0.14, 0.12, 0.45);
    }

    // Verifica Histerese e Sopro Prolongado (Requisitos 6 e 12)
    verificarAcionamentoMicrofone() {
        let resultado = {
            ondaCriogenica: false,
            cicloSeletivo: false
        };

        // Lógica de Histerese:
        // Só ativa quando passa o Limiar Máximo, e só pode voltar a ativar depois de descer abaixo do Limiar Mínimo
        if (this.volumeAtual >= this.limiarMax) {
            if (!this.histereseAtiva) {
                this.histereseAtiva = true;
                resultado.ondaCriogenica = true; // Dispara Onda Criogénica de 1.5s
                this.tempoAcimaLimiarMax = millis();
                this.congelacaoSeletivaPronta = true;
            } else {
                // Requisito 12: Se mantiver o sopro acima do limiar máximo por mais de 2 segundos (2000 ms)
                if (this.congelacaoSeletivaPronta && (millis() - this.tempoAcimaLimiarMax >= 2000)) {
                    resultado.cicloSeletivo = true;
                    this.congelacaoSeletivaPronta = false; // Evita ativar repetidamente no mesmo sopro
                }
            }
        } else if (this.volumeAtual < this.limiarMin) {
            // Rearma o sistema quando o som desce abaixo do limiar mínimo
            this.histereseAtiva = false;
            this.congelacaoSeletivaPronta = false;
        }

        return resultado;
    }

    // Efeitos Sonoros Sintetizados via p5.sound (Requisito 8)
    tocarSom(tipo) {
        this.ativarContextoAudio();
        if (tipo === 'DISPARO') {
            this.osc.setType('triangle');
            this.osc.freq(600);
            this.osc.amp(0.15, 0.02);
            setTimeout(() => { this.osc.freq(300); this.osc.amp(0, 0.1); }, 60);
        } else if (tipo === 'ELIMINACAO') {
            this.osc.setType('sine');
            this.osc.freq(880);
            this.osc.amp(0.2, 0.01);
            setTimeout(() => { this.osc.freq(1200); this.osc.amp(0, 0.15); }, 80);
        } else if (tipo === 'CONGELAR') {
            this.osc.setType('sine');
            this.osc.freq(520);
            this.osc.amp(0.25, 0.05);
            setTimeout(() => { this.osc.freq(1040); this.osc.amp(0, 0.4); }, 200);
        } else if (tipo === 'DANO') {
            this.osc.setType('sawtooth');
            this.osc.freq(150);
            this.osc.amp(0.25, 0.02);
            setTimeout(() => { this.osc.freq(90); this.osc.amp(0, 0.25); }, 150);
        }
    }
}