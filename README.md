# p5js-food-waste-defense

16/10/2026

Começei por fazer um prompt dizento o que queria para o Gemini Argon e fornecendo o primeiro relatorio que fiz com todas as funcionalidades que eu queria, forneci também imagens geradas pelo ChatGPT do desenho que anteriormente tinha feito em papel, pedi tambem para ele distribuir o codigo por diferentes classes como: alimento.js, microbio.js, interfaceUI.js entre outras. Neste prompt inicial eu esqueci de mencionar que poderia fazer download do p5.js e por isso ele foi buscar à weeb, também me esqueci de mencionar que deveria mencionar que tenho de usar algum ficheiro de audio (mp3, wav, etc...) externo e ele procedeu a apenas criar os proprios sons usando a biblioteca p5.sound. O Gemini então começou por gerar tudo o restante e ao testar a ver o que acontecia a tela inicial ficou com exatamente o aspecto que pedi mas depois de proceder para o jogo e reparei que apenas carregava o fundo, não carregava a mira, os alimentos e os microbios.

Procedi então a abrir a consola e acusou de erro pois o gemini usao uma função que não existe no p5 para desenhar "pão" troqueia e passou a funcionar.

20/10/2026
Manhã
Comecei por corrigir um pequeno erro que na tela de fim de jogo o texto de "jogar novamnte" ficava alinhado fora da caixa.

Melhorias na tela final como remover a "comida salva" e a "comida desperdiçada" que na imagem gerada pelo chatGPT apareceram essas estatisticas mas não são relevantes para o jogo, e melhoria da astetica do titulo.

Tarde

Havia um problema que os microbios que nasciam da parte inferior mais no centro da tela e miravam nos alimentos mais altos atravessavam visualmente os alimentos que ficam mais em baixo, então para resolver esse erro fiz os microbios apenas nascerem dos lados.

26/10/2026

Comecei por eliminar um tracejado que tinha quando clicava entre a mira e o centro do jogo, e tambem troquei um pouco o aspecto do projetil.

Procurar sons mp3 online para diferentes efeitos sonoros e substituir os sons gerados pelo gemini com a biblioteca do p5 por estes mesmos.