import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CertificatePDF from "./CertificatePDF";

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [ready, setReady] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (name.trim() && course.trim()) {
      setReady(true);
    } else {
      alert("Preencha todos os campos");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Gerador de Certificados</h1>
      <form onSubmit={handleGenerate} className="space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Nome do participante"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Nome do curso"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Gerar Certificado
        </button>
      </form>

      {ready && (
        <div className="mt-6">
          <PDFDownloadLink
            document={<CertificatePDF name={name} course={course} />}
            fileName={`certificado-${name.toLowerCase().replace(/\s/g, "-")}.pdf`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {({ loading }) => (loading ? "Gerando PDF..." : "Baixar Certificado")}
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
}

export default App;
