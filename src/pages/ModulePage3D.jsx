import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { modulosData } from '../Data/dadosModulos.jsx';

// --- GEOMETRIA DO CORAÇÃO REINTRODUZIDA ---
const createHeartGeometry = () => {
  const shape = new THREE.Shape();
  const s = 0.04; // Aumentei um pouco o tamanho para melhor visualização
  shape.moveTo(0, -5 * s);
  shape.bezierCurveTo(-3 * s, -10 * s, -10 * s, -10 * s, -10 * s, -2 * s);
  shape.bezierCurveTo(-10 * s, 4 * s, -3 * s, 8 * s, 0, 10 * s);
  shape.bezierCurveTo(3 * s, 8 * s, 10 * s, 4 * s, 10 * s, -2 * s);
  shape.bezierCurveTo(10 * s, -10 * s, 3 * s, -10 * s, 0, -5 * s);
  const extrudeSettings = {
    depth: 4 * s,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 1 * s,
    bevelThickness: 1 * s,
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  return geometry;
};
const heartGeometry = createHeartGeometry();


function Item({ id, nome, cor, posicao, onSelect, isTarget, selected }) {
  const meshRef = useRef();
  
  useEffect(() => {
    if (isTarget) {
      document.body.style.cursor = 'pointer';
      return () => { document.body.style.cursor = 'auto'; };
    }
  }, [isTarget]);

  useFrame((state) => {
    const offsetY = selected ? 0.3 : 0;
    const baseY = posicao[1] || 0;
    const targetY = baseY + offsetY + Math.sin(state.clock.getElapsedTime() * 2 + posicao[0]) * 0.05;
    
    if (meshRef.current) {
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
        if (isTarget) {
            const scale = 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.1;
            meshRef.current.scale.set(scale, scale, scale);
        } else {
            meshRef.current.scale.set(1, 1, 1);
        }
    }
  });

  return (
    <group
      position={[posicao[0], posicao[1], posicao[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(selected ? null : id);
      }}
    >
      {/* --- CORREÇÃO: TROCANDO A ESFERA DE VOLTA PELO CORAÇÃO --- */}
      <mesh ref={meshRef} geometry={heartGeometry} rotation-x={-Math.PI / 2} castShadow>
        <meshStandardMaterial color={cor} roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

// O resto do código (Box, AdaptiveCamera, InteractiveModule, etc.) permanece o mesmo da versão funcional anterior.
// ... (incluindo o resto do arquivo para garantir que esteja completo)
function Box({ onOpen, isOpen }) {
  const lidRef = useRef();

  useFrame(() => {
    if (isOpen && lidRef.current && lidRef.current.rotation.x > -Math.PI / 1.9) {
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        -Math.PI / 1.9,
        0.08
      );
    }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); if (!isOpen) onOpen(); }}>
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.3, 2.0]} />
        <meshStandardMaterial color="#EAEAEA" />
      </mesh>
      <mesh ref={lidRef} position={[0, 0, -1.0]} castShadow>
        <boxGeometry args={[4.8, 0.08, 2.0]} />
        <meshStandardMaterial color="#f472b6" metalness={0.1} roughness={0.4}/>
        {!isOpen && (
          <Text
            position={[0, 0.05, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            color="white"
            fontSize={0.25}
            anchorX="center"
          >
            Clique para Abrir
          </Text>
        )}
      </mesh>
    </group>
  );
}

function AdaptiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const isMobile = size.width < 768;
    if (isMobile) {
      camera.position.set(0, 3, 7);
      camera.fov = 55;
    } else {
      camera.position.set(0, 2, 5);
      camera.fov = 50;
    }
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

function InteractiveModule({ modulo }) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [isBoxOpen, setBoxOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const currentTask = modulo.tasks[taskIndex];

  const handleSelect = (selectedId) => {
    setSelectedItem(selectedId);
    if (selectedId && selectedId === currentTask.target) {
      if (currentTask.id === 'abrir_caixa' && !isBoxOpen) {
          setBoxOpen(true);
      }
      if (taskIndex + 1 < modulo.tasks.length) {
          setTimeout(() => {
              setTaskIndex(taskIndex + 1);
              setSelectedItem(null);
          }, 500);
      }
    }
  };
  
  return (
    <div className="w-full h-screen relative bg-gray-900 text-white">
      <Canvas 
        className="absolute inset-0 z-10 bg-gray-900"
        shadows
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
          <Environment preset="city" />
          <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minDistance={3} maxDistance={12} />
          
          <AdaptiveCamera />

          <group position-y={-0.5}>
            <Box onOpen={() => handleSelect('box')} isOpen={isBoxOpen} />
            {isBoxOpen &&
              modulo.components.map((comp) => (
                <Item
                  key={comp.id}
                  {...comp}
                  onSelect={handleSelect}
                  isTarget={!selectedItem && currentTask.target === comp.id}
                  selected={selectedItem === comp.id}
                />
              ))}
          </group>
        </Suspense>
      </Canvas>

      <div className="absolute top-0 left-0 p-4 w-full md:max-w-md md:p-8 z-20 pointer-events-none">
        <div className="bg-black bg-opacity-60 backdrop-blur-sm p-4 rounded-lg shadow-2xl pointer-events-auto">
          <h2 className="text-xl md:text-3xl font-bold mb-2">{modulo.title}</h2>
          <h3 className="text-base md:text-xl font-semibold text-cyan-400 mb-1">Tarefa Atual:</h3>
          <p className="text-sm md:text-lg mb-4">{currentTask.prompt}</p>
          {currentTask.teoria && (
            <div className="mt-2 border-t border-gray-600 pt-2 text-xs md:text-base">
              <p className="font-bold text-green-400">INFO:</p>
              <p>{currentTask.teoria}</p>
            </div>
          )}
          <div className="mt-4">
            <h4 className="font-bold text-sm mb-1">Progresso da Missão:</h4>
            <ul className="space-y-1 text-xs">
              {modulo.tasks.map((task, index) => (
                <li key={task.id} className={`transition-all ${
                    index < taskIndex ? 'text-green-400 opacity-70 line-through'
                    : index === taskIndex ? 'text-cyan-300 font-bold'
                    : 'text-gray-400'
                  }`}
                >
                  {task.completedText || task.prompt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {currentTask.isFinal && (
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20 pointer-events-auto">
          <Link to="/home" className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-lg animate-pulse">
            Missão Concluída! Voltar
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ModulePage3D() {
  const { id } = useParams();
  const moduloData = modulosData[id];

  if (!moduloData || !moduloData.simulacao3D) {
    return (
      <div className="text-center p-10 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-700">Simulação não encontrada ou indisponível.</h2>
        <Link to="/home" className="mt-4 text-blue-600 hover:underline">Voltar para a seleção de módulos</Link>
      </div>
    );
  }

  const moduloParaRenderizar = { 
    id, 
    title: moduloData.title, 
    ...moduloData.simulacao3D 
  };

  return <InteractiveModule modulo={moduloParaRenderizar} />;
}