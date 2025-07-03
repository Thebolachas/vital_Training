// pages/CertificateGenerator.jsx
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificateGenerator() {
  const [name, setName] = useState("");
  const [course] = useState("Treinamento do Monitor Fetal iCTG");
  const [showCert, setShowCert] = useState(false);
  const certRef = useRef(null);

  const generatePDF = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", [canvas.width, canvas.height]);
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`Certificado-${name}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {!showCert ? (
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Gerador de Certificado</h1>
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-6"
          />
          <button
            disabled={!name}
            onClick={() => setShowCert(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Visualizar Certificado
          </button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
