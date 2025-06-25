import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificateGenerator() {
  const [name, setName] = useState("");
  const [showCert, setShowCert] = useState(false);
  const certRef = useRef(null);

  const generatePDF = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`certificado-${name}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      {!showCert && (
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Gerador de Certificado</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full border rounded px-4 py-2 mb-4"
          />
          <button
            onClick={() => setShowCert(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Gerar Certificado
          </button>
        </div>
      )}

      {showCert && (
        <div className="mt-8 text-center">
          <div
            ref={certRef}
            className="bg-white w-[800px] h-[565px] border shadow-xl p-10 relative flex flex-col items-center justify-center text-center"
          >
            <img
              src="/logo-hc.png"
              alt="Logo HC"
              className="absolute top-10 left-10 w-28"
            />
            <h2 className="text-2xl font-bold mb-2">Hospital das Clínicas da Faculdade de Medicina da USP</h2>
            <p className="text-xl mt-10">Certificamos que</p>
            <p className="text-3xl font-bold text-blue-800 my-4">{name}</p>
            <p className="text-lg">participou do curso de treinamento promovido por esta instituição.</p>
            <p className="mt-12">São Paulo, 2025</p>
          </div>

          <button
            onClick={generatePDF}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
          >
            Baixar PDF
          </button>
        </div>
      )}
    </div>
  );
}
