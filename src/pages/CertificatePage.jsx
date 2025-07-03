import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useUser } from '../Context/UserContext.jsx';
import { Link } from 'react-router-dom';

// Definição dos estilos para o certificado
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  container: {
    border: '10px solid #4A90E2', // Borda azul
    width: '100%',
    height: '100%',
    position: 'relative',
    // Adicionado padding interno para que o conteúdo não fique muito perto da borda
    padding: 40,
  },
  body: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center',     // Centraliza o conteúdo horizontalmente
    textAlign: 'center',
  },
  logoTopLeft: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 80,
    height: 80,
  },
  logoBottomLeft: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    width: 70,
    height: 70,
  },
  logoBottomRight: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 70,
    height: 70,
  },
  // Novos estilos para o texto do certificado
  certificateTitle: { // "CERTIFICADO"
    fontSize: 48, // Tamanho grande
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
    color: '#41cc96', // Verde
  },
  certificateSubtitle: { // "DE PARTICIPAÇÃO"
    fontSize: 24, // Menor que o título
    marginBottom: 30, // Espaço abaixo
    fontFamily: 'Helvetica-Bold',
    color: '#41cc96', // Verde
  },
  participationText: { // "O InovaHC atesta a participação de"
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Helvetica',
    color: '#000000', // Pre
  },
  participantName: { // Nome do participante
    fontSize: 36, // Grande
    marginVertical: 15,
    fontFamily: 'Helvetica-BoldOblique', // Estilo bold e itálico para o nome
    color: '#41cc96', // Verde
  },
  trainingDescription: { // Descrição do treinamento
    fontSize: 14,
    lineHeight: 1.5, // Espaçamento entre linhas
    fontFamily: 'Helvetica',
    color: '#000000', // Preto
    maxWidth: '80%', // Limita a largura para melhor leitura
  },
  // O estilo 'date' original não será mais usado como posição absoluta no rodapé,
  // mas podemos mantê-lo ou adaptá-lo se a data for integrada em outro lugar.
  // Por enquanto, a data será gerada dinamicamente dentro do trainingDescription.
});

// O componente CertificatePDF agora recebe apenas o userName
const CertificatePDF = ({ userName }) => {
  // Obtenha a data atual formatada para o certificado
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentYear = new Date().getFullYear();

  return (
    <Document>
      <Page style={styles.page} size="A4" orientation="landscape">
        <View style={styles.container}>
          {/* Imagens de logo (ajuste os caminhos se necessário) */}
          <Image style={styles.logoTopLeft} src="/logo-certificado.png" />
          <Image style={styles.logoBottomLeft} src="/logo-parceiro1.png" />
          <Image style={styles.logoBottomRight} src="/logo-parceiro2.png" />

          <View style={styles.body}>
            {/* Título e subtítulo do certificado */}
            <Text style={styles.certificateTitle}>CERTIFICADO</Text>
            <Text style={styles.certificateSubtitle}>DE PARTICIPAÇÃO</Text>

            {/* Texto de atestado */}
            <Text style={styles.participationText}>O InovaHC atesta a participação de</Text>

            {/* Nome do participante */}
            <Text style={styles.participantName}>{userName}</Text>

            {/* Descrição do treinamento com data dinâmica */}
            <Text style={styles.trainingDescription}>
              no treinamento do Projeto Implementação da Cardiotocografia Móvel no SUS - melhoria da assistência ao feto e redução da mortalidade neonatal, utilizando dispositivos vestíveis de cardiotocografia no período de XX de janeiro a XX de dezembro de {currentYear} totalizando 1 hora de dedicação.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// O componente CertificatePage continua o mesmo, apenas importando e usando CertificatePDF
export default function CertificatePage() {
  const { user } = useUser();

  // Se o usuário não estiver logado, redireciona ou exibe mensagem
  if (!user) {
    return (
      <div className="text-center p-10">
        <h2>Você precisa estar logado para ver o certificado.</h2>
        <Link to="/login" className="text-blue-600">Fazer Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Parabéns, {user.name}!</h1>
        <p className="text-lg text-gray-600 mb-8">Você concluiu o treinamento. Clique no botão abaixo para baixar seu certificado em formato PDF.</p>

        {/* PDFDownloadLink usa o componente CertificatePDF com o nome do usuário */}
        <PDFDownloadLink
          document={<CertificatePDF userName={user.name} />}
          fileName={`Certificado_${user.name.replace(/\s/g, '_')}.pdf`}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
        >
          {({ loading }) => loading ? 'Gerando certificado...' : 'Baixar Certificado'}
        </PDFDownloadLink>
        <Link to="/home" className="block mt-8 text-blue-600 hover:underline">Voltar à seleção de módulos</Link>
      </div>
    </div>
  );
}
