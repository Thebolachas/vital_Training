import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useUser } from '../Context/UserContext.jsx';
import { Link } from 'react-router-dom';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  container: {
    border: '10px solid #4A90E2',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  body: {
    padding: '60px 80px', 
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  title: { fontSize: 40, marginBottom: 20, fontFamily: 'Helvetica-Bold' },
  text: { fontSize: 16, marginBottom: 10, fontFamily: 'Helvetica' },
  name: { fontSize: 32, marginVertical: 15, fontFamily: 'Helvetica-BoldOblique', color: '#007aff' },
  product: { fontSize: 22, marginTop: 10, marginBottom: 20, fontFamily: 'Helvetica-Bold' },
  date: { fontSize: 10, position: 'absolute', bottom: 10, left: 0, right: 0, color: '#555' }
});

// --- ALTERAÇÃO 1: O componente agora só precisa do 'userName' ---
const CertificatePDF = ({ userName }) => (
  <Document>
    <Page style={styles.page} size="A4" orientation="landscape">
      <View style={styles.container}>
        
        <Image style={styles.logoTopLeft} src="/logo-certificado.png" />
        <Image style={styles.logoBottomLeft} src="/logo-parceiro1.png" />
        <Image style={styles.logoBottomRight} src="/logo-parceiro2.png" />
        
        <View style={styles.body}>
          <Text style={styles.title}>Certificado de Conclusão</Text>
          <Text style={styles.text}>Certificamos que</Text>
          <Text style={styles.name}>{userName}</Text>
          {/* --- ALTERAÇÃO 2: Linha que exibia o perfil foi REMOVIDA --- */}
          <Text style={styles.text}>concluiu com sucesso o treinamento de capacitação para o uso do</Text>
          <Text style={styles.product}>Monitor Fetal Melody iCTG</Text>
        </View>
        
        <Text style={styles.date}>Emitido em: {new Date().toLocaleDateString('pt-BR')}</Text>
      </View>
    </Page>
  </Document>
);

export default function CertificatePage() {
    const { user } = useUser();
    if (!user) { return ( <div className="text-center p-10"> <h2>Você precisa estar logado para ver o certificado.</h2> <Link to="/login" className="text-blue-600">Fazer Login</Link> </div> ) }
    return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Parabéns, {user.name}!</h1>
        <p className="text-lg text-gray-600 mb-8">Você concluiu o treinamento. Clique no botão abaixo para baixar seu certificado em formato PDF.</p>
        
        {/* --- ALTERAÇÃO 3: Não passamos mais o 'userRole' para o PDF --- */}
        <PDFDownloadLink document={<CertificatePDF userName={user.name} />} fileName={`Certificado_${user.name.replace(/\s/g, '_')}.pdf`} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block">
          {({ loading }) => loading ? 'Gerando certificado...' : 'Baixar Certificado'}
        </PDFDownloadLink>
        <Link to="/home" className="block mt-8 text-blue-600 hover:underline">Voltar à seleção de módulos</Link>
      </div>
    </div>
  );
}