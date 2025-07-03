// components/CertificatePDF.jsx
import React from "react";
import { Page, Text, Document, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxP.ttf" },
    { src: "https://fonts.gstatic.com/s/roboto/v29/KFOlCnqEu92Fr1MmWUlfBBc9.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    backgroundColor: "#fff",
    padding: 50,
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1D4ED8",
  },
  content: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginVertical: 12,
  },
  signature: {
    fontSize: 14,
    marginTop: 40,
    textAlign: "right",
    color: "#555",
  },
});

const CertificatePDF = ({ name, course }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Certificado de Conclusão</Text>
      <Text style={styles.content}>Certificamos que</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.content}>concluiu com êxito o curso:</Text>
      <Text style={{ ...styles.content, fontStyle: "italic" }}>{course}</Text>
      <Text style={styles.signature}>TreinaFácil iCTG - 2025</Text>
    </Page>
  </Document>
);

export default CertificatePDF;


// pages/CertificateGenerator.jsx
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useUser } from "../context/UserContext";
import { useProgress } from "../context/ProgressContext";
import { modulosData } from "../context/dadosModulos";

export default function CertificateGenerator() {
  const { user } = useUser();
  const { progress } = useProgress();
  const certRef = useRef(null);

  const lastModuleKey = modulosData.perfilMapping[user?.role]?.lastModule;
  const name = user?.name || "";
  const course = "Curso de Treinamento iCTG";

  const isEligible = lastModuleKey && progress[lastModuleKey]?.score === progress[lastModuleKey]?.totalQuestions;

  const generatePDF = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", [canvas.width, canvas.height]);
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`Certificado-${name}.pdf`);
  };

  if (!isEligible) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-600">
        <p>Você ainda não concluiu todos os módulos necessários com sucesso para gerar o certificado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white w-[850px] h-[600px] shadow-2xl p-10 border relative" ref={certRef}>
        <img src="/logo-hc.png" alt="Logo HC" className="absolute top-10 left-10 w-24" />
        <h2 className="text-xl text-center font-semibold text-gray-700">Hospital das Clínicas da Faculdade de Medicina da USP</h2>
        <h1 className="text-4xl font-extrabold mt-8 text-blue-900 text-center">Certificado de Conclusão</h1>
        <p className="text-lg text-center mt-10">Certificamos que</p>
        <p className="text-3xl font-bold text-center text-blue-800 my-4">{name}</p>
        <p className="text-lg text-center">concluiu com êxito o curso:</p>
        <p className="text-lg text-center italic mb-10">{course}</p>
        <p className="text-center text-sm text-gray-600 mt-10">São Paulo, 2025</p>
        <p className="absolute bottom-10 right-10 text-sm text-gray-500">TreinaFácil iCTG</p>
      </div>

      <button
        onClick={generatePDF}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
      >
        Baixar PDF
      </button>
    </div>
  );
}
