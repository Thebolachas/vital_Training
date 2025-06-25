import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { modulosData } from '../Data/dadosModulos.jsx';

const createHeartGeometry = () => {
  const shape = new THREE.Shape();
  const s = 0.03;
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
    document.body.style.cursor = isTarget ? 'pointer' : 'auto';
  }, [isTarget]);

  useFrame((state) => {
    const offsetY = selected ? 1.2 : 0;
    const baseY = posicao[1];
    const targetY = baseY + offsetY + Math.sin(state.clock.getElapsedTime() * 2 + posicao[0]) * 0.05;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
    if (isTarget) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group
      position={[posicao[0], 0, posicao[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(selected ? null : id);
      }}
    >
      <mesh ref={meshRef} geometry={heartGeometry} rotation-x={-Math.PI / 2} castShadow>
        <meshStandardMaterial color={cor} roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

function Box({ onOpen, isOpen }) {
  const lidRef = useRef();
  useFrame(() => {
    if (isOpen && lidRef.current.rotation.x > -Math.PI / 2) {
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        -Math.PI / 2,
        0.1
      );
    }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); if (!isOpen) onOpen(); }}>
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.25, 2.0]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh ref={lidRef} position={[0, 0.01, -1.0]} castShadow>
        <boxGeometry args={[4.8, 0.05, 2.0]} />
        <meshStandardMaterial color="#f472b6" />
        {!isOpen && (
          <Text
            position={[0, 0.02, 0.6]}
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

function InteractiveModule({ modulo }) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [isBoxOpen, setBoxOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const currentTask = modulo.tasks[taskIndex];

  const handleSelect = (selectedId) => {
    setSelectedItem(selectedId);
    if (selectedId === currentTask.target) {
      if (currentTask.id === 'abrir_caixa') setBoxOpen(true);
      if (taskIndex + 1 < modulo.tasks.length) setTaskIndex(taskIndex + 1);
    }
  };

  return (
    <div className="w-full h-screen relative bg-gray-800 text-white">
      <Suspense fallback={<div className="flex items-center justify-center h-full">Carregando Simulação...</div>}>
        <Canvas camera={{ position: [0, 2, 4.5], fov: 50 }} shadows>
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
          <Environment preset="city" />
          <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} minDistance={3} maxDistance={8} />
          <Box onOpen={() => handleSelect('box')} isOpen={isBoxOpen} />
          {isBoxOpen &&
            modulo.components.map((comp) => (
              <Item
                key={comp.id}
                {...comp}
                onSelect={handleSelect}
                isTarget={currentTask.target === comp.id}
                selected={selectedItem === comp.id}
              />
            ))}
        </Canvas>
      </Suspense>

      <div className="absolute top-0 left-0 p-4 md:p-8 w-full md:max-w-md pointer-events-none">
        <div className="bg-black bg-opacity-60 backdrop-blur-sm p-6 rounded-lg shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{modulo.title}</h2>
          <h3 className="text-lg md:text-xl font-semibold text-cyan-400 mb-2">Tarefa Atual:</h3>
          <p className="text-md md:text-lg mb-6">{currentTask.prompt}</p>
          {currentTask.teoria && (
            <div className="mt-4 border-t border-gray-600 pt-4 text-sm md:text-base">
              <p className="font-bold text-green-400">INFO:</p>
              <p>{currentTask.teoria}</p>
            </div>
          )}
          <div className="mt-6">
            <h4 className="font-bold mb-2">Progresso da Missão:</h4>
            <ul className="space-y-1 text-sm">
              {modulo.tasks.map((task, index) => (
                <li
                  key={task.id}
                  className={`transition-all ${
                    index < taskIndex
                      ? 'text-green-400 opacity-70 line-through'
                      : index === taskIndex
                      ? 'text-cyan-300 font-bold'
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
        <div className="absolute bottom-8 right-8">
          <Link
            to="/home"
            className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-lg animate-pulse"
          >
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
      <div className="text-center p-10">
        <h2>Simulação não encontrada ou indisponível.</h2>
        <Link to="/">Voltar</Link>
      </div>
    );
  }
  const moduloParaRenderizar = { id, title: moduloData.title, ...moduloData.simulacao3D };
  return <InteractiveModule modulo={moduloParaRenderizar} />;
}
