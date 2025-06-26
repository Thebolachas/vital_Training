import React from 'react';

export default function Simulacao() {
  return (
    <div className="simulacao-container" style={{ position: 'relative' }}>
      <canvas
        id="simulacao-3d"
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: '#fff',
          display: 'block',
          zIndex: 1,
          position: 'relative',
        }}
      ></canvas>

      <div
        className="caixa-flutuante"
        style={{
          position: 'fixed',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10,
          pointerEvents: 'auto',
          color: '#333',
          fontSize: '1rem',
          textAlign: 'center',
        }}
      >
        <p>Leia atentamente as instruções para prosseguir com a simulação.</p>
      </div>

      <button
        className="botao-continuar"
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '1rem 2rem',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          zIndex: 20,
          cursor: 'pointer',
        }}
        onClick={() => {
          alert('Continuar clicado!');
        }}
      >
        Continuar
      </button>
    </div>
  );
}
