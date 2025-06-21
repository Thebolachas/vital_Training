import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Estilos
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 40,
    textAlign: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    marginVertical: 12,
  },
  signature: {
    marginTop: 40,
    fontSize: 14,
    textAlign: "right",
  },
});

// Componente principal
const CertificatePDF = ({ name, course }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Certificado de Conclusão</Text>
      <Text style={styles.content}>Certificamos que</Text>
      <Text style={{ ...styles.content, fontWeight: "bold" }}>{name}</Text>
      <Text style={styles.content}>concluiu com êxito o curso:</Text>
      <Text style={{ ...styles.content, fontStyle: "italic" }}>{course}</Text>
      <Text style={styles.signature}>TreinaFácil iCTG</Text>
    </Page>
  </Document>
);

export default CertificatePDF;
