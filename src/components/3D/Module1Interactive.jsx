import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Text, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { modulosData } from '../../Data/dadosModulos.jsx'; // <--- CORRIGIDO: Caminho para modulosData

// Extender objetos Three.js para uso declarativo no R3F
extend({ Shape: THREE.Shape, ExtrudeGeometry: THREE.ExtrudeGeometry });

const createHeartGeometry = () => {
  const s = new THREE.Shape();
  const e = 0.04; // Escala
  s.moveTo(0, -5 * e);
  s.bezierCurveTo(-3 * e, -10 * e, -10 * e, -10 * e, -10 * e, -2 * e);
  s.bezierCurveTo(-10 * e, 4 * e, -3 * e, 8 * e, 0, 10 * e);
  s.bezierCurveTo(3 * e, 8 * e, 10 * e, 4 * e, 10 * e, -2 * e);
  s.bezierCurveTo(10 * e, -10 * e, 3 * e, -10 * e, 0, -5 * e);
  return new THREE.ExtrudeGeometry(s, { depth: 4 * e, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1 * e, bevelThickness: 1 * e }).center();
};
const heartGeometry = createHeartGeometry();

function Item({ id, cor, posicao, onSelect, isTarget, selected, isClosing }) {
  const d = useRef();
  
  useEffect(() => {
    document.body.style.cursor = isTarget ? "pointer" : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [isTarget]);

  useFrame(l => {
    const c = selected ? 0.3 : 0;
    const u = posicao[1] || 0;
    const m = u + c + Math.sin(2 * l.clock.getElapsedTime() + posicao[0]) * 0.05;
    if (d.current) {
      d.current.position.y = THREE.MathUtils.lerp(d.current.position.y, m, 0.1);
      if (isClosing) {
        d.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.15);
      } else if (isTarget) {
        d.current.scale.set(1 + Math.sin(5 * l.clock.getElapsedTime()) * 0.1, 1 + Math.sin(5 * l.clock.getElapsedTime()) * 0.1, 1 + Math.sin(5 * l.clock.getElapsedTime()) * 0.1);
      } else {
        d.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={posicao} onClick={e => { e.stopPropagation(); onSelect(); }}>
      <mesh ref={d} geometry={heartGeometry} rotation-x={-Math.PI / 2} castShadow>
        <meshStandardMaterial color={cor} roughness={0.3} metalness={0.2} />
      </mesh>
      <Text position={[0, 0.1, 0.2]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">
        {id === 'fhr' ? 'FHR' : 'TOCO'}
      </Text>
    </group>
  );
}

function Box({ onOpen, onClose, isOpen }) {
  const o = useRef();
  useFrame(() => {
    if (o.current) {
      if (isOpen) {
        if (o.current.rotation.x > -Math.PI / 1.9) {
          o.current.rotation.x = THREE.MathUtils.lerp(o.current.rotation.x, -Math.PI / 1.9, 0.08);
        }
      } else {
        if (o.current.rotation.x < 0) {
          o.current.rotation.x = THREE.MathUtils.lerp(o.current.rotation.x, 0, 0.08);
        }
      }
    }
  });
  return (
    <group onClick={e => { e.stopPropagation(); isOpen ? onClose() : onOpen(); }}>
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.3, 2]} />
        <meshStandardMaterial color="#EAEAEA" />
      </mesh>
      <mesh ref={o} position={[0, 0, -1]} castShadow>
        <boxGeometry args={[4.8, 0.08, 2]} />
        <meshStandardMaterial color="#f472b6" metalness={0.1} roughness={0.4} />
        {!isOpen && <Text position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} color="white" fontSize={0.25} anchorX="center">Clique para Abrir</Text>}
      </mesh>
    </group>
  );
}

function SafeCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 1.5, 7);
    camera.fov = 50;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function InteractiveModule({ modulo }) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [isBoxOpen, setBoxOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  const currentTask = modulo.tasks?.[taskIndex];

  useEffect(() => {
    if (currentTask?.isFinal) {
      setTimeout(() => setMissionComplete(true), 1200);
    }
  }, [currentTask]);

  const handleSelect = (selectedId) => {
    if (missionComplete || !currentTask || selectedId !== currentTask.target) return;
    
    if (currentTask.id === 'abrir_caixa') setBoxOpen(true);
    if (currentTask.id === 'fechar_caixa') setIsClosing(true);

    if (taskIndex < modulo.tasks.length - 1) {
      setTimeout(() => setTaskIndex(prev => prev + 1), 800);
    } else if (currentTask.isFinal) {
        setMissionComplete(true);
    }
  };
  
  const allModuleIds = Object.keys(modulosData).filter(id => modulosData[id].simulacao3D).sort((a, b) => parseInt(a) - parseInt(b));
  const currentIndex = allModuleIds.indexOf(modulo.id);
  let nextPath = "/home";
  let buttonText = "Finalizar Treinamento";
  if (currentIndex !== -1 && currentIndex < allModuleIds.length - 1) {
    const nextModuleId = allModuleIds[currentIndex + 1];
    nextPath = `/modulo/${nextModuleId}/teoria`;
    buttonText = "Avançar";
  }

  return (
    <div className="w-screen h-screen flex flex-col md:block bg-gray-900 text-white overflow-hidden">
      <div className="flex-none h-[45%] md:h-auto md:absolute md:top-8 md:left-8 md:max-w-md md:z-20 p-4">
        <div className="bg-black/70 md:backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-2xl h-full overflow-y-auto">
          
          {missionComplete ? (
            <div className="flex flex-col justify-center items-center h-full text-center animate-fade-in-up">
              <h2 className="text-3xl font-bold text-green-400 mb-4">Parabéns!</h2>
              <p className="text-lg text-white mb-6">Você concluiu a simulação.</p>
              <Link to={nextPath} className="block w-full text-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-lg">
                {buttonText}
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl md:text-3xl font-bold mb-2">{modulo.title}</h2>
              <h3 className="text-base md:text-xl font-semibold text-cyan-400 mb-1">Tarefa Atual:</h3>
              <p className="text-sm md:text-lg mb-4">{currentTask?.prompt}</p>
              {currentTask?.teoria && (
                <div className="mt-2 border-t border-gray-600 pt-2 text-xs md:text-base">
                  <p className="font-bold text-green-400">INFO:</p><p>{currentTask.teoria}</p>
                </div>
              )}
              <div className="mt-4">
                <h4 className="font-bold text-sm mb-1">Progresso da Missão:</h4>
                <ul className="space-y-1 text-xs">
                  {modulo.tasks?.map((task, index) => (
                    <li key={task.id} className={`transition-all ${
                        index < taskIndex ? 'text-green-400/70 line-through' :
                        index === taskIndex ? 'text-cyan-300 font-bold' :
                        'text-gray-400'
                      }`}
                    >
                      {task.completedText || task.prompt}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-grow md:absolute md:inset-0 md:z-10">
        <Canvas shadows dpr={[1, 2]}>
          <color attach="background" args={['#1A202C']} />
          <Suspense fallback={null}>
            <ambientLight intensity={1.2} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
            <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minDistance={3} maxDistance={12} target={[0, -0.5, 0]} />
            <SafeCamera />
            {!missionComplete && (
              <group position-y={-0.5}> 
                <Box onOpen={() => handleSelect('box')} onClose={() => handleSelect('box')} isOpen={isBoxOpen && !isClosing} />
                {isBoxOpen &&
                  modulo.components.map((comp) => (
                    <Item
                      key={comp.id}
                      {...comp}
                      onSelect={() => handleSelect(comp.id)}
                      isTarget={currentTask?.target === comp.id}
                      isClosing={isClosing}
                    />
                  ))}
              </group>
            )}
          </Suspense>
        </Canvas>
        <Loader />
      </div>
    </div>
  );
}

export default function ModulePage3D() {
  const { id } = useParams();
  const moduloData = modulosData?.[id];
  if (!moduloData || !moduloData.simulacao3D) {
    return (
      <div className="text-center p-10 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-700">Simulação não encontrada ou indisponível.</h2>
        <Link to="/home" className="mt-4 text-blue-600 hover:underline">Voltar</Link>
      </div>
    );
  }
  // Isso renderiza o InteractiveModule para o Módulo 1.
  // Para outros módulos, precisaremos de componentes 3D diferentes.
  // Atualmente, apenas o Módulo 1 tem 'components' e 'tasks' definidos em simulacao3D.
  if (id === '1') {
    return <InteractiveModule modulo={{ id, ...moduloData.simulacao3D, title: moduloData.title }} />;
  } else {
    // Para o Módulo 2 e outros, ele vai renderizar o Modulo2Simulacao3D ou similar
    // Isso é tratado no switch case dentro do return principal de ModulePage3D
    // (a função render3DContent no ModulePage3D que você tem)
    // Então, não precisamos de um InteractiveModule aqui para o caso default.
    // Retornamos o Canvas e a lógica de switch para carregar Modulo2Simulacao3D etc.
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#F0F2F5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} />
          <pointLight position={[-10, -10, -10]} />
          
          <Suspense fallback={null}>
          </Suspense>
        </Canvas>
      </div>
    );
  }
}