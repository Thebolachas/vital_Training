import React from 'react';

// Este arquivo será sua única fonte de verdade para todos os módulos.
// Ele contém os dados para as experiências 2D e 3D.

export const modulosData = {
  '1': {
    title: "Módulo 1: Introdução, Desembalar e Identificar",
    color: "blue", // Usado pelo modo 2D
    teoria2D: {
      teoria: () => (
        <div className="bg-white p-8 rounded-xl shadow-lg text-gray-800">
          <h2 className="text-2xl font-bold mb-4">📦 Conteúdo da Embalagem e Instalação Inicial</h2>
          <p className="mb-4">O iCTG é fornecido com todos os itens essenciais para seu uso imediato. Abaixo estão os componentes:</p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>1 Transdutor Fetal (FHR)</li>
            <li>1 Transdutor de Contração Uterina (TOCO)</li>
            <li>1 App para tablet</li>
            <li>1 Carregador AC bivolt com acessórios</li>
            <li>2 Cintas de fixação e 1 Gel</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">⚙️ Especificações Técnicas</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Carregamento: 1h → 6~10h de uso contínuo</li>
            <li>Conexão: Bluetooth 4.1 LE</li>
          </ul>
        </div>
      ),
      imagens: [
        { titulo: "Visão Geral na Embalagem", imagem: "/ICTG_imagens/0_inicio.png", descricao: "Apresentação geral do iCTG em sua embalagem, com os transdutores e o compartimento de acessórios." },
        { titulo: "Transdutor de Batimento Fetal (FHR)", imagem: "/ICTG_imagens/1_transdutor_batimento.png", descricao: "Este é o transdutor para o batimento cardíaco fetal. O som do batimento é ouvido pelo alto-falante integrado." },
        { titulo: "Botão de Ligar (FHR)", imagem: "/ICTG_imagens/2_ligar.png", descricao: "O transdutor FHR (rosa) possui um botão lateral para ligar e desligar o aparelho." },
        { titulo: "Botão de Volume (FHR)", imagem: "/ICTG_imagens/3_volume.png", descricao: "Ao lado do botão de ligar, há um botão para ajuste manual do volume do alto-falante." },
        { titulo: "Ajuste de Volume no App", imagem: "/ICTG_imagens/4_volumenoapp.png", descricao: "O ajuste de volume do transdutor FHR também pode ser realizado diretamente no aplicativo." },
        { titulo: "Transdutor de Contrações (TOCO)", imagem: "/ICTG_imagens/5_transdutorcontracoes.png", descricao: "Este é o transdutor para as contrações uterinas (TOCO)." },
        { titulo: "Botão de Ligar (TOCO)", imagem: "/ICTG_imagens/6_ligar2.png", descricao: "O transdutor TOCO (azul) também possui um botão para ser ligado e desligado." },
        { titulo: "Botão de Pré-ajuste (TOCO)", imagem: "/ICTG_imagens/7_volume2.png", descricao: "Este botão serve para definir o valor de referência (preset) para as contrações." },
        { titulo: "Configuração de Pré-ajuste no App", imagem: "/ICTG_imagens/8_configuracao_no_app.png", descricao: "O valor de referência das contrações também pode ser configurado pelo aplicativo." },
        { titulo: "Adaptador AC", imagem: "/ICTG_imagens/10_adptadorac.png", descricao: "O adaptador AC (fonte) é utilizado para carregar os transdutores." },
        { titulo: "Cabo de Ramificação", imagem: "/ICTG_imagens/11_caboderamificacao.png", descricao: "Cabo utilizado para carregar ambos os transdutores simultaneamente com uma única fonte." },
        { titulo: "Adaptador de Conversão", imagem: "/ICTG_imagens/12_adaptadordeconversao.png", descricao: "Adaptador de conversão incluído no kit de acessórios." },
        { titulo: "Cintas e Gel", imagem: "/ICTG_imagens/13_cinta_e_ gel.png", descricao: "O kit acompanha duas cintas elásticas para fixação dos transdutores e um frasco de gel de contato." }
      ],
      quiz: [
        { pergunta: 'Qual é a principal função do iCTG?', opcoes: ['Realizar ultrassonografias 3D', 'Avaliar batimentos cardíacos fetais e contrações uterinas', 'Emitir laudos laboratoriais'], correta: 1, feedback: "Correto! O iCTG (Cardiotocografia) é projetado especificamente para monitorar simultaneamente a frequência cardíaca do feto (cardio) e as contrações do útero (toco)." },
        { pergunta: 'Como o iCTG se conecta ao sistema de análise?', opcoes: ['Via USB com notebook dedicado', 'Via Wi-Fi conectado à TV', 'Via Bluetooth com app em tablet ou smartphone'], correta: 2, feedback: "Exato! A portabilidade do iCTG é garantida pela sua conexão sem fio via Bluetooth, permitindo que os dados sejam visualizados em tempo real em um tablet ou smartphone." },
      ]
    },
    simulacao3D: {
      tasks: [
        { id: 'abrir_caixa', target: 'box', prompt: "Bem-vindo! Sua primeira tarefa é abrir a caixa. Clique nela.", completedText: "Abra A caixa!" },
        { id: 'identificar_fhr', target: 'fhr', prompt: "Excelente! Agora, identifique o Transdutor Fetal (FHR).", completedText: "identifique o Transdutor FHR", teoria: " Ele capta os batimentos cardíacos fetais usando ultrassom Doppler." },
        { id: 'identificar_toco', target: 'toco', prompt: "Ótimo. Agora encontre o Transdutor de Contrações (TOCO).", completedText: "identifique o Transdutor TOCO !", teoria: " Ele mede a duração e frequência das contrações uterinas." },
        { id: 'quiz_1', target: 'fhr', prompt: "Quiz Rápido: Clique no aparelho que precisa de gel para funcionar.", completedText: " O FHR usa gel para melhor condução do som.", isQuiz: true },
        { id: 'final', prompt: "Missão 1 completa! Você está pronto para o próximo desafio.", completedText: "Parabéns!", isFinal: true }
      ],
      components: [
        { id: 'fhr', nome: "Transdutor Fetal (FHR)", cor: '#FFC0CB', posicao: [-0.8, 0.05, 0] }, // Rosa Pastel
        { id: 'toco', nome: "Transdutor de Contrações (TOCO)", cor: '#ADD8E6', posicao: [0.8, 0.05, 0] }  // Azul Pastel
      ]
    }
  },
  '2': {
      title: "Módulo 2: Carregamento e Operação",
      color: "pink",
      teoria2D: {
        teoria: () => (
            <div className="bg-white p-8 rounded-xl shadow-lg text-gray-800 space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-2 text-blue-700">1. Carregando os Dispositivos</h3>
                    <p>Antes de usar, carregue o monitor fetal portátil CTG. Conecte o adaptador de energia, o cabo de ramificação e o adaptador de conversão. Em seguida, conecte à porta de carregamento dos transdutores. A luz laranja indica o início do carregamento e levará cerca de uma hora para ser concluído. A luz ficará verde quando o dispositivo estiver totalmente carregado. Lembre-se de carregar também o tablet ou smartphone.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-blue-700">2. Registro de Paciente</h3>
                    <p>Ligue o tablet e inicie o aplicativo Petit CTG. Primeiro, registre as informações do paciente. No menu, selecione a tela 'Lista de Pacientes' e use o botão 'Adicionar' (+) no canto superior direito. Preencha as informações e toque no botão 'Salvar'. Após salvar, selecione o paciente na lista para garantir que suas informações sejam exibidas na tela principal.</p>
                </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-blue-700">3. Conectando os Transdutores</h3>
                    <p>Pressione e segure o botão de energia de cada transdutor por cerca de three segundos para ligá-los. Verifique a conexão Bluetooth no aplicativo: um ícone de coração com um 'check' indica que a conexão foi bem-sucedida. Se não houver um 'check', aguarde ou reinicie os transdutores.</p>
                </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-blue-700">4. Verificação dos Ícones de Status</h3>
                    <p>Antes de iniciar a medição, verifique os ícones na tela. As baterias dos transdutores e do tablet devem estar verdes. Se estiverem vermelhas, o nível de bateria está baixo. A conexão com a internet também deve estar verde para garantir o envio dos dados após a medição.</p>
                </div>
            </div>
        ),
        imagens: [
          { titulo: "Conectando para Carregar", imagem: "/ICTG_imagens/14_conecte_os_cabos_.png", descricao: "Use o adaptador AC, cabo de ramificação e conversor para carregar os dois transdutores." },
          { titulo: "Luz Laranja - Carregando", imagem: "/ICTG_imagens/16_luz_laranja_imagem.png", descricao: "Quando o carregamento começa, a luz laranja acende. O processo leva cerca de 1 hora." },
          { titulo: "Luz Verde - Carga Completa", imagem: "/ICTG_imagens/17_luz_verde_carregado.png", descricao: "A luz verde indica que os transdutores estão totalmente carregados e prontos para uso." },
          { titulo: "Carregue o Tablet", imagem: "/ICTG_imagens/18_carregar-tablet.png", descricao: "Lembre-se também de carregar completamente o tablet ou smartphone que será usado." },
          { titulo: "Acesse o Aplicativo", imagem: "/ICTG_imagens/20_acessar_app.png", descricao: "Ligue o tablet e inicie o aplicativo 'Petite CTG' para começar." },
          { titulo: "Acesse a Lista de Pacientes", imagem: "/ICTG_imagens/21-selecionar_lista.png", descricao: "No menu lateral, acesse a lista de pacientes para gerenciar os registros." },
          { titulo: "Adicionar Novo Paciente", imagem: "/ICTG_imagens/23_add_paciente.png", descricao: "Toque no ícone de '+' no canto superior direito para adicionar um novo paciente." },
          { titulo: "Preencha os Dados", imagem: "/ICTG_imagens/24_preencher_dados_paciente.png", descricao: "Insira as informações necessárias do paciente nos campos correspondentes." },
          { titulo: "Salve o Registro", imagem: "/ICTG_imagens/25_salvar-dados.png", descricao: "Após preencher os dados, toque no ícone de 'salvar' para confirmar o registro." },
          { titulo: "Selecione o Paciente", imagem: "/ICTG_imagens/26_mudar-paciente.png", descricao: "Na lista, selecione o paciente para iniciar o monitoramento." },
          { titulo: "Ligue os Transdutores", imagem: "/ICTG_imagens/27_ligar_transdutores.png", descricao: "Pressione e segure o botão de ligar em cada transdutor por cerca de 3 segundos." },
          { titulo: "Verifique a Conexão Bluetooth", imagem: "/ICTG_imagens/29_conexão_correta.png", descricao: "No app, ícones de coração com 'check' confirmam que a conexão Bluetooth foi bem-sucedida." },
          { titulo: "Sinal de Falha na Conexão", imagem: "/ICTG_imagens/30_conexão_falha.png", descricao: "Se um 'X' vermelho aparecer, a conexão falhou. Tente reiniciar o transdutor." },
          { titulo: "Verifique Status das Baterias", imagem: "/ICTG_imagens/31_xonexão_toda_correta_exemplo.png", descricao: "Certifique-se de que os ícones de bateria (transdutores e tablet) estão verdes (carregados)." },
          { titulo: "Bateria Fraca", imagem: "/ICTG_imagens/32_conexao_falha-exemplo.png", descricao: "Um ícone de bateria vermelho indica nível baixo, necessitando de recarga em breve." },
          { titulo: "Verifique a Conexão de Rede", imagem: "/ICTG_imagens/33_conexao_rede_ok.png", descricao: "O ícone de rede deve estar verde para garantir o envio dos dados após o exame." }
        ],
        quiz: [
            { pergunta: 'Qual cor indica que um transdutor está carregando?', opcoes: ['Verde', 'Vermelho', 'Laranja', 'Azul'], correta: 2, feedback: "Isso mesmo! A luz laranja é o indicador padrão de que a bateria está em processo de recarga. Ela se tornará verde quando a carga estiver completa." },
            { pergunta: 'O que se deve fazer para registrar um novo paciente?', opcoes: ['Ir ao menu de configurações', 'Usar o botão de adicionar na lista de pacientes', 'Reiniciar o aplicativo'], correta: 1, feedback: "Correto! O fluxo padrão no aplicativo é ir para a 'Lista de Pacientes' e usar o botão de adição (+) para criar um novo registro." },
            { pergunta: 'Um ícone de coração com um "check" no aplicativo significa o quê?', opcoes: ['Bateria fraca', 'Conexão de internet estabelecida', 'Conexão Bluetooth bem-sucedida'], correta: 2, feedback: "Perfeito! O ícone de coração representa o transdutor, e o 'check' é a confirmação visual de que a comunicação via Bluetooth está ativa e funcionando." },
        ]
      },
      simulacao3D: null
  },
  '3': {
      title: "Módulo 3: Posicionamento e Medição",
      color: "purple",
      teoria2D: {
        teoria: () => (
            <div className="bg-white p-8 rounded-xl shadow-lg text-gray-800 space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-2 text-green-700">1. Preparação e Aplicação do Gel</h3>
                    <p>Prepare a cinta de fixação. Aplique o gel de contato apenas no monitor de frequência cardíaca (FHR - rosa). Para o monitor de contrações uterinas (TOCO - azul), não é necessário aplicar gel.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-green-700">2. Posicionamento e Fixação</h3>
                    <p>Posicione o monitor FHR no abdômen, movendo-o até encontrar o ponto onde o som do batimento cardíaco fetal é mais nítido. Passe o gancho do transdutor pelo furo da cinta e puxe as duas pontas com força igual para fixar, sem apertar excessivamente. O transdutor TOCO deve ser posicionado na parte inferior do abdômen.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-green-700">3. Ajustes e Início da Medição</h3>
                    <p>Ajuste o volume no aplicativo tocando no botão FHR. Para o TOCO, clique na seção de contração uterina para definir o valor de referência (o padrão é 15). Se o gráfico da frequência cardíaca estiver interrompido, reposicione o monitor FHR. Quando a onda estiver estável, toque no botão de medição, defina o tempo (normalmente 40 minutos) e inicie.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-green-700">4. Durante e Após a Medição</h3>
                    <p>Durante a medição, o fundo da tela ficará amarelo. Ao final do tempo, um som será emitido e uma mensagem de confirmação aparecerá. Para parar no meio, use o botão 'Stop'. Após o término, remova os transdutores, limpe o gel do abdômen e dos monitores, desligue os aparelhos e coloque-os para carregar.</p>
                </div>
            </div>
        ),
        imagens: [
          { titulo: "Aplicação do Gel", imagem: "/ICTG_imagens/34_passar_gel_nesse.png", descricao: "Aplique o gel de contato apenas no transdutor de frequência cardíaca (FHR)." },
          { titulo: "Não aplicar Gel no TOCO", imagem: "/ICTG_imagens/35_nao_passar_gel_nesse.png", descricao: "O transdutor de contrações (TOCO) não necessita de gel para funcionar." },
          { titulo: "Localizando o Batimento Cardíaco", imagem: "/ICTG_imagens/36_localizar_regiao.png", descricao: "Mova o transdutor FHR no abdômen até encontrar o local com o som mais nítido." },
          { titulo: "Fixando o Transdutor FHR", imagem: "/ICTG_imagens/38_colocar-cinta.png", descricao: "Passe o gancho do transdutor pelo orifício da cinta para prepará-lo para a fixação." },
          { titulo: "Ajustando a Cinta", imagem: "/ICTG_imagens/39-fechar_cinta.png", descricao: "Puxe as duas pontas da cinta com força igual para fixar o transdutor sem apertar demais." },
          { titulo: "Posicionando o Transdutor TOCO", imagem: "/ICTG_imagens/40_colocar_outro.png", descricao: "O transdutor de contrações (TOCO) deve ser posicionado na parte inferior do abdômen." },
          { titulo: "Ajuste de Volume (App)", imagem: "/ICTG_imagens/41_ajustar_vol_tocar_no_botao_FHR.png", descricao: "Toque no botão FHR no aplicativo para ajustar o volume do som dos batimentos." },
          { titulo: "Ajuste de Contração (App)", imagem: "/ICTG_imagens/42_locar_contracao-uterina.png", descricao: "Toque na seção de contração uterina (UC) para definir o valor de referência. O padrão é 15." },
          { titulo: "Sinal Interrompido", imagem: "/ICTG_imagens/43_grafico_errado_corte.png", descricao: "Um gráfico interrompido indica mau posicionamento. Reajuste o monitor FHR." },
          { titulo: "Sinal Estabilizado", imagem: "/ICTG_imagens/44_estabilazar_correto.png", descricao: "Quando o gráfico estiver estável e o som nítido, o aparelho está pronto para a medição." },
          { titulo: "Iniciando a Medição", imagem: "/ICTG_imagens/45_definir_tempo_iniciar_medicao.png", descricao: "Toque no botão de medição, selecione o tempo desejado (normalmente 40 min) e inicie." },
          { titulo: "Confirmação de Início", imagem: "/ICTG_imagens/46_ok_na_medicao.png", descricao: "Confirme o tempo de medição para começar a salvar e enviar os dados." },
          { titulo: "Fim da Medição", imagem: "/ICTG_imagens/47_termino_aviso.png", descricao: "Ao final do tempo, uma mensagem de confirmação será exibida. Toque em 'OK'." },
          { titulo: "Parar a Medição Manualmente", imagem: "/ICTG_imagens/48_quiser_terminar-antes.png", descricao: "Se precisar parar antes, toque no botão 'Stop' e confirme sua escolha." },
          { titulo: "Limpeza Pós-Uso", imagem: "/ICTG_imagens/49_retirar_limpar.png", descricao: "Após remover os transdutores, limpe o gel do abdômen e do monitor FHR." },
          { titulo: "Desligar e Guardar", imagem: "/ICTG_imagens/50_dsligar.png", descricao: "Desligue os dois transdutores e coloque-os para carregar para o próximo uso." },
          { titulo: "Carregar ao Final", imagem: "/ICTG_imagens/52_carregar_ao_final.png", descricao: "Antes de guardar certifique-se de carregar os dois transdutores." }
        ],
        quiz: [
            { pergunta: 'Em qual transdutor o gel de contato deve ser aplicado?', opcoes: ['No de contrações (TOCO)', 'Nos dois transdutores', 'No de batimento cardíaco (FHR)'], correta: 2, feedback: "Exatamente! O gel é necessário apenas no transdutor FHR para garantir uma boa condutividade e a captação clara do som dos batimentos cardíacos fetais." },
            { pergunta: 'O que deve ser feito se o gráfico da frequência cardíaca estiver interrompido?', opcoes: ['Aumentar o volume', 'Reiniciar o aplicativo', 'Reposicionar o monitor FHR'], correta: 2, feedback: "Correto. Uma interrupção no gráfico quase sempre indica que o transdutor perdeu o contato ideal. Reposicioná-lo é o primeiro passo para obter um sinal estável." },
            { pergunta: 'Qual é o procedimento final após desligar os transdutores?', opcoes: ['Guardá-los imediatamente', 'Colocá-los para carregar', 'Lavar com água e sabão'], correta: 1, feedback: "Isso mesmo. Para garantir que o equipamento esteja sempre pronto para o próximo uso, a boa prática é colocá-lo para carregar logo após a limpeza e o desligamento." }
        ]
      },
      simulacao3D: null
  },
  '4': {
    title: "Módulo 4: Análise e Gestão de Dados",
    color: "orange",
    teoria2D: {
      teoria: () => (
        <div className="bg-white p-8 rounded-xl shadow-lg text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Gestão de Dados no Tablet</h2>
          <p className="mb-4">Após a conclusão dos exames, o aplicativo iCTG permite gerenciar os dados salvos diretamente no tablet. Isso inclui visualizar exames antigos, reenviar dados que falharam na transmissão para a nuvem e excluir registros permanentemente.</p>
          <h3 className="text-xl font-semibold mb-2">Visualizando Medições Anteriores</h3>
          <p className="mb-4">Para acessar um exame antigo, selecione o paciente, toque no ícone da lista de dados e escolha a medição desejada pela data e hora. O gráfico correspondente será exibido na tela.</p>
          <h3 className="text-xl font-semibold mb-2">Reenviando Dados para a Nuvem</h3>
          <p className="mb-4">Se houver uma falha de conexão com a internet, os dados podem não ser enviados para o servidor. Nesse caso, o registro ficará com a marca "Unsend" (Não enviado). Para reenviar, selecione o registro e utilize a opção de reenvio para garantir que o especialista remoto tenha acesso ao exame.</p>
           <h3 className="text-xl font-semibold mb-2">Excluindo Dados</h3>
          <p className="mb-4 text-red-700 font-bold">Atenção: A exclusão de dados é uma ação permanente e os registros não podem ser recuperados após a confirmação. Use esta função com cuidado. Para excluir, selecione os dados e confirme a ação na caixa de diálogo.</p>
        </div>
      ),
      imagens: [
        { titulo: "Acessar Lista de Dados", imagem: "/ICTG_imagens/53_acessar_dados.png", descricao: "Toque no ícone da lista de dados para ver todos os exames salvos para o paciente selecionado." },
        { titulo: "Selecionar Exame", imagem: "/ICTG_imagens/54_scroll_e_selecao.png", descricao: "Faça um scroll na lista para encontrar o exame desejado e toque para selecioná-lo." },
        { titulo: "Visualizar Gráfico Antigo", imagem: "/ICTG_imagens/55_grafico_antigo.png", descricao: "O gráfico do exame selecionado será exibido, permitindo a análise retrospectiva." },
        { titulo: "Falha no Envio", imagem: "/ICTG_imagens/56_reenviar_dados.png", descricao: "Se um exame não for enviado para a nuvem, ele será marcado como 'Unsend'." },
        { titulo: "Confirmar Reenvio", imagem: "/ICTG_imagens/57_confirmar_reenvio.png", descricao: "Selecione o exame e confirme a opção de reenviar os dados para o servidor." },
        { titulo: "Excluir Dados", imagem: "/ICTG_imagens/58_deletar_dados.png", descricao: "É possível excluir registros permanentemente do tablet, mas essa ação não pode ser desfeita." }
      ],
      quiz: [
        { pergunta: 'O que você deve fazer se um exame estiver marcado como "Unsend"?', opcoes: ['Deletar o exame e refazê-lo', 'Selecionar o exame e usar a função de reenviar', 'Reiniciar o tablet'], correta: 1, feedback: "Correto! A marca 'Unsend' indica uma falha de transmissão. A função de reenviar foi criada exatamente para resolver essa situação sem perda de dados." },
        { pergunta: 'É possível recuperar um exame que foi deletado do tablet?', opcoes: ['Sim, através do backup da nuvem', 'Sim, contatando o suporte técnico', 'Não, a exclusão é permanente'], correta: 2, feedback: 'Exato. O manual adverte que dados deletados não podem ser recuperados, sendo uma ação irreversível.' },
      ]
    },
    simulacao3D: null
  },
  '5': {
     title: "Módulo 5: Acesso Remoto para Especialistas",
     color: "purple",
     teoria2D: {
        teoria: () => (
          <div className="bg-white p-8 rounded-xl shadow-lg text-gray-800">
            <h2 className="text-2xl font-bold mb-4">Monitoramento Remoto com iCTG Viewer</h2>
            <p className="mb-4">Uma das maiores vantagens do iCTG é a capacidade de monitoramento remoto. Especialistas podem analisar os dados em tempo real de qualquer lugar, usando diferentes métodos de acesso.</p>
            <h3 className="text-xl font-semibold mb-2">Formas de Acesso</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
                <li><strong>Viewer App Dedicado (iOS):</strong> Oferece a experiência mais completa. O usuário pode navegar entre pacientes e acessar históricos completos. Ao receber uma notificação de início de monitoramento, o app abre diretamente no exame em tempo real.</li>
                <li><strong>iCTG Viewer Web Service:</strong> Acessível por qualquer navegador (PC, tablet, smartphone) através de um URL, login e senha. É ideal para quem não possui o aplicativo instalado e permite a impressão e geração de PDFs (A3/A4) dos gráficos.</li>
                <li><strong>Notificação por E-mail:</strong> Um link no e-mail de notificação leva diretamente ao exame em tempo real. No entanto, esta via não permite consultar o histórico ou outros pacientes.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Interface do Viewer Web</h3>
            <p className="mb-4">A interface web permite selecionar o paciente por ID, escolher a data e hora do exame, alterar a velocidade do gráfico (1, 2 ou 3 cm/min) e ativar o "Auto Refresh" para atualizações automáticas a cada 10 segundos durante a monitorização em tempo real.</p>
          </div>
        ),
        imagens: [
            { titulo: "Visão Geral do Acesso Remoto", imagem: "/ICTG_imagens/59_visao_geral_remoto.png", descricao: "Os dados são enviados à nuvem Melody i, de onde podem ser acessados por um app dedicado ou por qualquer navegador web." },
            { titulo: "Acesso via Navegador Web", imagem: "/ICTG_imagens/60_acesso_web.png", descricao: "Para acessar pelo navegador, basta inserir o URL fornecido, conta e senha." },
            { titulo: "Interface do Viewer Web", imagem: "/ICTG_imagens/61_interface_web.png", descricao: "A tela principal do serviço web exibe o gráfico e permite selecionar o paciente, a data do exame e imprimir." },
            { titulo: "Seleção de Paciente no Web", imagem: "/ICTG_imagens/62_selecao_paciente_web.png", descricao: "É possível alternar entre diferentes pacientes usando a lista suspensa de IDs." },
            { titulo: "Seleção de Data do Exame", imagem: "/ICTG_imagens/63_selecao_data_web.png", descricao: "Para um mesmo paciente, pode-se navegar entre os diferentes registros de exames realizados." },
            { titulo: "Configurações de Gráfico Web", imagem: "/ICTG_imagens/64_config_web.png", descricao: "As configurações permitem alterar a cor e espessura das linhas do gráfico, como FHR1, FHR2 e contração uterina." }
        ],
        quiz: [
            { pergunta: 'Qual método de acesso remoto oferece a funcionalidade mais completa, incluindo histórico de pacientes?', opcoes: ['Link de E-mail', 'Viewer App dedicado', 'Acesso pelo site da Melody'], correta: 1, feedback: "Correto! O Viewer App dedicado é a ferramenta mais completa, permitindo navegação completa entre pacientes e seus históricos, algo que o link de e-mail não faz." },
            { pergunta: 'O iCTG Viewer Web Service permite gerar PDFs em quais formatos?', opcoes: ['Apenas A4', 'Apenas Carta e Ofício', 'A4 e A3'], correta: 2, feedback: 'Exato. A interface web é otimizada para documentação, oferecendo a exportação do gráfico nos formatos A4 e A3.' },
            { pergunta: 'Para que serve a função "Auto Refresh" no Viewer Web Service?', opcoes: ['Para limpar o cache do navegador', 'Para atualizar o gráfico automaticamente a cada 10 segundos em tempo real', 'Para recarregar a lista de pacientes'], correta: 1, feedback: 'Isso mesmo! O "Auto Refresh" garante que o especialista acompanhe o exame em tempo real com atualizações constantes, sem a necessidade de recarregar a página manualmente.' },
        ]
     },
     simulacao3D: null
  },
  'médico': {
    title: "Módulo Especial: Análise Avançada de Cardiotoco",
    color: "teal",
    teoria2D: {
      teoria: () => (
        <div className="bg-white p-8 rounded-xl shadow-lg text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Análise de Padrões e Condutas</h2>
          <p className="mb-4">Este módulo aborda cenários complexos de cardiotocografia, focando na interpretação de padrões não tranquilizadores e nas condutas clínicas apropriadas.</p>
        </div>
      ),
      imagens: [],
      quiz: [
        { pergunta: 'Diante de uma desaceleração tardia (DIP II) persistente, qual a conduta mais apropriada?', opcoes: ['Aumentar a infusão de ocitocina', 'Mudar decúbito da paciente e ofertar O2', 'Aguardar resolução espontânea por 30 minutos'], correta: 1, feedback: "Correto. A mudança de decúbito e a oferta de oxigênio são medidas primárias para melhorar a oxigenação fetal." },
        { pergunta: 'Um padrão de traçado sinusoidal está frequentemente associado a quê?', opcoes: ['Bem-estar fetal assegurado', 'Anemia fetal severa', 'Sono fetal profundo'], correta: 1, feedback: "Exato. O padrão sinusoidal é um sinal ominoso, frequentemente indicativo de anemia fetal grave." },
        { pergunta: 'Qual critério NÃO faz parte da categoria I de um traçado (padrão tranquilizador)?', opcoes: ['FCF basal entre 110-160 bpm', 'Variabilidade moderada', 'Presença de desacelarações variáveis ou tardias'], correta: 2, feedback: "Correto. A presença de desacelerações variáveis ou tardias move o traçado para a categoria II ou III." }
      ]
    },
    simulacao3D: null
  }
};