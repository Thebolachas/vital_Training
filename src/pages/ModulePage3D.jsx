import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { modulosData } from '../Data/dadosModulos.jsx';

const createHeartGeometry=()=> {const s=new THREE.Shape,e=0.04;return s.moveTo(0,-5*e),s.bezierCurveTo(-3*e,-10*e,-10*e,-10*e,-10*e,-2*e),s.bezierCurveTo(-10*e,4*e,-3*e,8*e,0,10*e),s.bezierCurveTo(3*e,8*e,10*e,4*e,10*e,-2*e),s.bezierCurveTo(10*e,-10*e,3*e,-10*e,0,-5*e),new THREE.ExtrudeGeometry(s,{depth:4*e,bevelEnabled:!0,bevelSegments:2,steps:2,bevelSize:1*e,bevelThickness:1*e}).center()};const heartGeometry=createHeartGeometry();function Item({id:s,cor:e,posicao:t,onSelect:o,isTarget:i,selected:a}){const r=useRef();return useEffect(()=>{document.body.style.cursor=i?"pointer":"auto",()=>{document.body.style.cursor="auto"}},[i]),useFrame(n=>{const d=a?.3:0,l=t[1]||0,c=l+d+Math.sin(2*n.clock.getElapsedTime()+t[0])*.05;r.current&&(r.current.position.y=THREE.MathUtils.lerp(r.current.position.y,c,.1),i?r.current.scale.set(1+Math.sin(5*n.clock.getElapsedTime())*.1,1+Math.sin(5*n.clock.getElapsedTime())*.1,1+Math.sin(5*n.clock.getElapsedTime())*.1):r.current.scale.set(1,1,1))}),<group position={t} onClick={n=>{n.stopPropagation(),o(a?null:s)}}><mesh ref={r} geometry={heartGeometry} rotation-x={-Math.PI/2} castShadow><meshStandardMaterial color={e} roughness={.3} metalness={.2}/></mesh></group>}function Box({onOpen:s,isOpen:e}){const t=useRef();return useFrame(()=>{e&&t.current&&t.current.rotation.x>-Math.PI/1.9&&(t.current.rotation.x=THREE.MathUtils.lerp(t.current.rotation.x,-Math.PI/1.9,.08))}),<group onClick={t=>{t.stopPropagation(),e||s()}}><mesh position={[0,-.15,0]} castShadow receiveShadow><boxGeometry args={[4.8,.3,2]}/><meshStandardMaterial color="#EAEAEA"/></mesh><mesh ref={t} position={[0,0,-1]} castShadow><boxGeometry args={[4.8,.08,2]}/><meshStandardMaterial color="#f472b6" metalness={.1} roughness={.4}/>{!e&&<Text position={[0,.05,0]} rotation={[-Math.PI/2,0,0]} color="white" fontSize={.25} anchorX="center">Clique para Abrir</Text>}</mesh></group>}

// --- CÂMERA SIMPLIFICADA PARA GARANTIR VISIBILIDADE ---
function SafeCamera() {
  const { camera } = useThree();
  useEffect(() => {
    // Posição única e segura que funciona bem em todas as telas
    camera.position.set(0, 1.5, 7); 
    camera.fov = 50;
    camera.lookAt(0, 0, 0); // Garante que a câmera sempre olhe para o centro
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function InteractiveModule({ modulo }) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [isBoxOpen, setBoxOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [missionComplete, setMissionComplete] = useState(false);
  const currentTask = modulo.tasks?.[taskIndex];

  const handleSelect = (selectedId) => {
    if (missionComplete || !currentTask) return;
    setSelectedItem(selectedId);
    if (selectedId && selectedId === currentTask.target) {
      if (currentTask.id === 'abrir_caixa' && !isBoxOpen) setBoxOpen(true);
      if (taskIndex + 1 < modulo.tasks.length) {
          setTimeout(() => {
              setTaskIndex(taskIndex + 1);
              setSelectedItem(null);
          }, 500);
      } else {
        setTimeout(() => setMissionComplete(true), 800);
      }
    }
  };
  
  return (
    <div className="w-screen h-screen relative bg-gray-900 text-white overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={['#1A202C']} />
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
          <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minDistance={3} maxDistance={12} target={[0, 0, 0]} />
          <SafeCamera />

          {!missionComplete && (
            // --- POSIÇÃO DO GRUPO RESETADA PARA O CENTRO ---
            <group position-y={0}> 
              <Box onOpen={() => handleSelect('box')} isOpen={isBoxOpen} />
              {isBoxOpen &&
                modulo.components.map((comp) => (
                  <Item
                    key={comp.id}
                    {...comp}
                    onSelect={handleSelect}
                    isTarget={!selectedItem && currentTask?.target === comp.id}
                    selected={selectedItem === comp.id}
                  />
                ))}
            </group>
          )}
        </Suspense>
      </Canvas>
      <Loader />

      <div className="absolute p-4 w-full 
                     bottom-0 left-0 
                     md:top-0 md:left-0 md:bottom-auto md:w-auto md:max-w-md md:p-8">
        <div className="bg-black bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-2xl">
          {missionComplete ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Parabéns!</h3>
              <p className="text-lg mb-6">Você completou todas as tarefas deste módulo.</p>
              <Link to="/home" className="block w-full text-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-lg">
                Voltar aos Módulos
              </Link>
            </div>
          ) : (
            // ... (Restante da interface, sem alterações)
            <>
              <h2 className="text-xl md:text-3xl font-bold mb-4">{modulo.title}</h2>
              <h3 className="text-base md:text-xl font-semibold text-cyan-400 mb-1">Tarefa Atual:</h3>
              <p className="text-sm md:text-lg mb-4">{currentTask?.prompt}</p>
              {currentTask?.teoria && (
                <div className="mt-2 border-t border-gray-600 pt-2 text-xs md:text-base">
                  <p className="font-bold text-green-400">INFO:</p>
                  <p>{currentTask.teoria}</p>
                </div>
              )}
              <div className="mt-4">
                <h4 className="font-bold text-sm mb-1">Progresso da Missão:</h4>
                <ul className="space-y-1 text-xs">
                  {modulo.tasks?.map((task, index) => (
                    <li key={task.id} className={`transition-all ${
                        index < taskIndex || missionComplete ? 'text-green-400 opacity-70 line-through' :
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
        <Link to="/home" className="mt-4 text-blue-600 hover:underline">Voltar para a seleção de módulos</Link>
      </div>
    );
  }
  const moduloParaRenderizar = { id, title: moduloData.title, ...moduloData.simulacao3D };
  return <InteractiveModule modulo={moduloParaRenderizar} />;
}