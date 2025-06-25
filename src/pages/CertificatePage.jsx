import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useUser } from '../Context/UserContext';
import { Link } from 'react-router-dom';

// Componente que define a estrutura do PDF
const CertificatePDF = ({ userName, userRole }) => (
  <Document>
    <Page style={styles.page} size="A4" orientation="landscape">
      <View style={styles.container}>
        {/* Adicione o logo da sua instituição ou do iCTG aqui */}
        {/* <Image src="/path/to/your/logo.png" style={styles.logo} /> */}
        <Text style={styles.title}>Certificado de Conclusão</Text>
        <Text style={styles.text}>Certificamos que</Text>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.text}>({userRole})</Text>
        <Text style={styles.text}>
          concluiu com sucesso o treinamento de capacitação para o uso do
        </Text>
        <Text style={styles.product}>Monitor Fetal Melody iCTG</Text>
        <Text style={styles.date}>Emitido em: {new Date().toLocaleDateString('pt-BR')}</Text>
      </View>
    </Page>
  </Document>
);

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    margin: 10,
    padding: 30,
    border: '10px solid #4A90E2',
    textAlign: 'center',
    width: '90%',
    height: '90%'
  },
  title: {
    fontSize: 42,
    marginBottom: 40,
    fontFamily: 'Helvetica-Bold',
    color: '#333'
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 32,
    marginVertical: 20,
    fontFamily: 'Helvetica-BoldOblique',
    color: '#007aff'
  },
  product: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 40,
    fontFamily: 'Helvetica-Bold',
  },
  date: {
    fontSize: 12,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center'
  }
});

// A página que será renderizada no navegador
export default function CertificatePage() {
  const { user } = useUser();

  if (!user) {
    return (
        <div className="text-center p-10">
            <h2>Você precisa estar logado para ver o certificado.</h2>
            <Link to="/login" className="text-blue-600">Fazer Login</Link>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Parabéns, {user.name}!</h1>
        <p className="text-lg text-gray-600 mb-8">Você concluiu o treinamento. Clique no botão abaixo para baixar seu certificado em formato PDF.</p>
        
        <PDFDownloadLink 
          document={<CertificatePDF userName={user.name} userRole={user.role} />} 
          fileName={`Certificado_${user.name.replace(/\s/g, '_')}.pdf`}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
        >
          {({ blob, url, loading, error }) => 
            loading ? 'Gerando certificado...' : 'Baixar Certificado'
          }
        </PDFDownloadLink>
        
        <Link to="/home" className="block mt-8 text-blue-600 hover:underline">Voltar à seleção de módulos</Link>
      </div>
    </div>
  );
}