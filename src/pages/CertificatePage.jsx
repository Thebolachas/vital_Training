import React from 'react';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';
import { useUser } from '../Context/UserContext.jsx';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';

const styles = StyleSheet.create({
  page: { backgroundColor: '#FFFFFF', padding: 0 },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    padding: 40,
    backgroundColor: '#FFFFFF'
  },
  body: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 60
  },
  logoTopLeft: {
    position: 'absolute',
    top: 30,
    left: 30,
    width: '10%',  // Ajuste para garantir a responsividade
    height: 'auto',
    objectFit: 'contain'
  },
  logoTopRight: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: '8%',  // Ajuste para garantir a responsividade
    height: 'auto',
    objectFit: 'contain'
  },
  decorativeBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '15%',  // Ajuste para garantir a responsividade
    height: 'auto',
    objectFit: 'contain',
    opacity: 0.8
  },
  certificateTitle: {
    fontSize: 48,
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
    color: '#41cc96'
  },
  certificateSubtitle: {
    fontSize: 24,
    marginBottom: 30,
    fontFamily: 'Helvetica-Bold',
    color: '#41cc96'
  },
  participationText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Helvetica',
    color: '#000000'
  },
  participantName: {
    fontSize: 30,
    marginVertical: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#00B388'
  },
  trainingDescription: {
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: 'Helvetica',
    color: '#000000',
    width: '80%', // Ajuste para responsividade
    margin: '0 auto' // Centraliza o texto
  }
});

const CertificatePDF = ({ userName }) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <Document>
      <Page style={styles.page} size="A4" orientation="landscape">
        <View style={styles.container}>
          <Image style={styles.logoTopLeft} src="print/logo-vital.png" />
          <Image style={styles.logoTopRight} src="print/Captura de tela 2025-07-07 204935.png" />
          <Image style={styles.decorativeBottomRight} src="logo-certificado.png" />

          <View style={styles.body}>
            <Text style={styles.certificateTitle}>CERTIFICADO</Text>
            <Text style={styles.certificateSubtitle}>DE PARTICIPAÇÃO</Text>
            <Text style={styles.participationText}>O InovaHC atesta a participação de</Text>
            <Text style={styles.participantName}>{userName}</Text>
            <Text style={styles.trainingDescription}>
              <Text>no treinamento do </Text>
              <Text style={{ fontWeight: 'bold' }}>
                Projeto Implementação da Cardiotocografia Móvel no SUS
              </Text>
              <Text>
                , melhoria da assistência ao feto e redução da mortalidade neonatal, utilizando dispositivos vestíveis de cardiotocografia no período de {currentDate}, totalizando 1 hora de dedicação.
              </Text>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default function CertificatePage() {
  const { user } = useUser();
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

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
      {showConfetti && <Confetti />}
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Parabéns, {user.name}!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Você concluiu o treinamento. Clique no botão abaixo para baixar seu certificado em formato PDF.
        </p>

        <PDFDownloadLink
          document={<CertificatePDF userName={user.name} />}
          fileName={`Certificado_${user.name.replace(/\s/g, '_')}.pdf`}
        >
          {({ loading, error, blob, url }) => {
            if (error) setErrorMessage('Erro ao gerar o certificado. Tente novamente.');

            return (
              <>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
                  disabled={loading}
                  onClick={() => { 
                    if (!loading && !error) setShowConfetti(true); // Confete somente após o PDF estar pronto
                  }}
                  aria-label={`Baixar certificado de ${user.name}`} 
                >
                  {loading ? 'Gerando certificado...' : 'Baixar Certificado'}
                </button>
                {error && (
                  <p className="text-red-500 mt-4">{errorMessage}</p>
                )}
              </>
            );
          }}
        </PDFDownloadLink>

        <Link to="/home" className="block mt-8 text-blue-600 hover:underline">
          Voltar à seleção de módulos
        </Link>
      </div>
    </div>
  );
}
