# Fridge Defense: Food Waste Reduction

Repositório Git para o exercício prático interativo desenvolvido em **p5.js** no âmbito da unidade curricular de **Sistemas Multimédia** da **ESTG - IPVC**.

* **Estudante:** Ulysse Cancela[cite: 11]
* **Número de Aluno:** 33135[cite: 11]
* **Curso:** Engenharia da Computação Gráfica e Multimédia (ECGM)[cite: 11]
* **Tema Atribuído:** Food Waste Reduction[cite: 11]

---

## 1. Objetivo do Exercício
O "Fridge Defense: Food Waste Reduction" é um jogo interativo que visa consciencializar para a preservação correta dos alimentos e o combate ao desperdício provocado pela deterioração precoce (ação de bactérias e fungos)[cite: 11]. O utilizador assume o papel de protetor de um frigorífico central, disparando um spray conservante e utilizando comandos de voz para defender os alimentos armazenados contra vagas progressivas de micróbios invasores[cite: 11].

---

## 2. Funcionalidades e Mecânicas
* **Gestão de Estados da Aplicação:** Contém três ecrãs distintos (`INICIO` com calibração automática de ruído, `JOGO` em tempo real com HUD, e `FIM` / *Game Over* com relatório de resultados)[cite: 11].
* **Interação Híbrida (Rato + Microfone):** 
  * **Rato:** Movimento de mira e clique esquerdo para disparar um spray conservante direcional[cite: 11].
  * **Microfone:** Controlo de áudio com calibração de ruído basal e lógica de **histerese** (limiares mínimo e máximo) para disparar a *Onda Criogénica de Emergência* (congela todos os inimigos no ecrã durante 1.5s)[cite: 11].
* **Aleatoriedade e Colisões:** Surgimento procedural de micróbios nas bordas laterais com vetores de direção orientados para os alimentos, e deteção de colisões círculo-círculo (`dist()`)[cite: 11, 12].
* **Funcionalidade Original (Ciclo de Congelação Seletiva):** Manter um sopro contínuo acima do limiar máximo por mais de 2 segundos ativa uma barreira térmica criogénica em torno do alimento mais danificado, recuperando parte da sua frescura[cite: 12].
* **Feedback Áudio:** Integração de efeitos sonoros reais (`.mp3`) para os disparos, eliminação de inimigos e congelamento, combinados com síntese sonora de impacto[cite: 12].

---

## 3. Arquitetura do Projeto (Estrutura de Ficheiros)
O código encontra-se modularizado em várias classes e ficheiros para garantir uma boa prática de engenharia de software[cite: 12]:
* `index.html` — Carrega as bibliotecas do p5.js e a ordem correta dos scripts.
* `main.js` — Ficheiro principal que gere o ciclo de jogo (`setup`, `draw`, transições de estados e colisões)[cite: 12].
* `gestorAudio.js` — Gere a captação do microfone, calibração, limiares de histerese e reprodução de áudio[cite: 11, 12].
* `alimento.js` — Classe que modela os alimentos do frigorífico (Pão, Maçã, Leite), barras de frescura e barreiras térmicas[cite: 12].
* `microbio.js` — Classe dos agentes deteriorantes, comportamentos vetoriais e estados de congelamento[cite: 12].
* `projetil.js` — Classe responsável pelo movimento e renderização do jato de spray conservante[cite: 12].
* `interfaceUI.js` — Responsável pelo desenho dos ecrãs, menus, botões, HUD e rodapé obrigatório[cite: 12].
* `efeitossonoros/` — Pasta com os recursos de áudio externos (`.mp3`)[cite: 12].

---

##  4. Como Executar o Projeto Localmente
1. Certifica-te de que tens o **XAMPP** instalado (ou um servidor local equivalente como o *Live Server* do VS Code).
2. Coloca a pasta do repositório dentro do diretório do servidor local (ex: `C:\xampp\htdocs\SM\p5js-food-waste-defense`)[cite: 11].
3. Inicia o serviço Apache no painel do XAMPP.
4. Acede através do browser ao endereço: 
   `http://localhost/SM/p5js-food-waste-defense/index.html`
Procurar sons mp3 online para diferentes efeitos sonoros e substituir os sons gerados pelo gemini com a biblioteca do p5 por estes mesmos.