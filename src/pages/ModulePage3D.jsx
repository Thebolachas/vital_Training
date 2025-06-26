import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { modulosData } from '../Data/dadosModulos.jsx';

// (Os componentes auxiliares createHeartGeometry, Item, Box, SafeCamera não precisam de alteração)
const createHeartGeometry=()=> {const s=new THREE.Shape,e=0.04;return s.moveTo(0,-5*e),s.bezierCurveTo(-3*e,-10*e,-10*e,-10*e,-10*e,-2*e),s.bezierCurveTo(-10*e,4*e,-3*e,8*e,0,10*e),s.bezierCurveTo(3*e,8*e,10*e,4*e,10*e,-2*e),s.bezierCurveTo(10*e,-10*e,3*e,-10*e,0,-5*e),new THREE.ExtrudeGeometry(s,{depth:4*e,bevelEnabled:!0,bevelSegments:2,steps:2,bevelSize:1*e,bevelThickness:1*e}).center()};const heartGeometry=createHeartGeometry();function Item({id:s,cor:e,posicao:t,onSelect:o,isTarget:i,selected:a}){const r=useRef();return useEffect(()=>{document.body.style.cursor=i?"pointer":"auto",()=>{document.body.style.cursor="auto"}},[i]),useFrame(n=>{const d=a?.3:0,l=t[1]||0,c=l+d+Math.sin(2*n.clock.getElapsedTime()+t[0])*.05;r.current&&(r.current.position.y=THREE.MathUtils.lerp(r.current.position.y,c,.1),i?r.current.scale.set(1+Math.sin(5*n.clock.getElapsedTime())*.1,1+Math.sin(5*n.clock.getElapsedTime())*.1,1+Math.sin(5*n.clock.getElapsedTime())*.1):r.current.scale.set(1,1,1))}),<group position={t} onClick={n=>{n.stopPropagation(),o(a?null:s)}}><mesh ref={r} geometry={heartGeometry} rotation-x={-Math.PI/2} castShadow><meshStandardMaterial color={e} roughness={.3} metalness={.2}/></mesh></group>}function Box({onOpen:s,isOpen:e}){const t=useRef();return useFrame(()=>{e&&t.current&&t.current.rotation.x>-Math.PI/1.9&&(t.current.rotation.x=THREE.MathUtils.lerp(t.current.rotation.x,-Math.PI/1.9,.08))}),<group onClick={t=>{t.stopPropagation(),e||s()}}><mesh position={[0,-.15,0]} castShadow receiveShadow><boxGeometry args={[4.8,.3,2]}/><meshStandardMaterial color="#EAEAEA"/></mesh><mesh ref={t} position={[0,0,-1]} castShadow><boxGeometry args={[4.8,.08,2]}/><meshStandardMaterial color="#f472b6" metalness={.1} roughness={.4}/>{!e&&<Text position={[0,.05,0]} rotation={[-Math.PI/2,0,0]} color="white" fontSize={.25} anchorX="center">Clique para Abrir</Text>}</mesh></group>}function SafeCamera(){const{camera:s}=useThree();return useEffect(()=>{s.position.set(0,1.5,7),s.fov=50,s.lookAt(0,0,0),s.updateProjectionMatrix()},[s]),null}
const MissionCompleteScreen = ({ currentModuleId }) => {
  const allModuleIds = Object.keys(modulosData).filter(id => modulosData[id].simulacao3D);
  const currentIndex = allModuleIds.indexOf(currentModuleId);
  let nextPath = "/home";
  let buttonText = "Finalizar Treinamento";

  if (currentIndex !== -1 && currentIndex < allModuleIds.length - 1) {
    const nextModuleId = allModuleIds[currentIndex + 1];
    nextPath = `/modulo/${nextModuleId}/teoria`;
    buttonText = "Avançar";
  }

  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-95 flex flex-col justify-center items-center z-30 animate-fade-in-up">
      <div className="text-center p-8">
        <h2 className="text-4xl font-bold text-green-400 mb-4">Parabéns!</h2>
        <p className="text-xl text-white mb-8">Você concluiu o módulo de simulação.</p>
        <Link to={nextPath} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors shadow-lg text-lg">{buttonText}</Link>
      </div>
    </div>
  );
};


function InteractiveModule({ modulo }) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [isBoxOpen, setBoxOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [missionComplete, setMissionComplete] = useState(false);
  const currentTask = modulo.tasks?.[taskIndex];

  const handleSelect = (selectedId) => {
    if (missionComplete || !currentTask || selectedId !== currentTask.target) return;
    if (currentTask.id === 'abrir_caixa') setBoxOpen(true);
    if (currentTask.id === 'fechar_caixa') setBoxOpen(false);

    if (taskIndex + 1 < modulo.tasks.length) {
        setTimeout(() => setTaskIndex(prev => prev + 1), 800);
    } else {
      setTimeout(() => setMissionComplete(true), 1200);
    }
    setSelectedItem(selectedId);
  };
  
  return (
    <div className="w-screen h-screen bg-gray-900 text-white">
      
      {/* --- ALTERAÇÃO NO LAYOUT --- */}
      {/* O container da UI agora é um elemento separado, no topo em telas mobile */}
      <div className="h-2/5 md:h-auto md:absolute md:p-8 md:top-0 md:left-0 md:w-auto md:max-w-md z-20 flex flex-col justify-center bg-gray-900 md:bg-transparent">
        <div className="bg-black md:bg-opacity-70 md:backdrop-blur-sm p-4 md:p-6 rounded-none md:rounded-xl shadow-2xl overflow-y-auto">
          <h2 className="text-xl md:text-3xl font-bold mb-2">{modulo.title}</h2>
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
                    index < taskIndex ? 'text-green-400 opacity-70 line-through' :
                    index === taskIndex ? 'text-cyan-300 font-bold' :
                    'text-gray-400'
                  }`}
                >
                  {task.completedText || task.prompt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* O container do Canvas agora ocupa a parte de baixo no mobile */}
      <div className="h-3/5 md:h-full w-full relative">
        <Canvas shadows dpr={[1, 2]}>
          <color attach="background" args={['#1A202C']} />
          <Suspense fallback={null}>
            <ambientLight intensity={1.2} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
            <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minDistance={3} maxDistance={12} target={[0, 0, 0]} />
            <SafeCamera />
            <group position-y={-0.5}> 
              <Box onOpen={() => handleSelect('box')} onClose={() => handleSelect('box')} isOpen={isBoxOpen} />
              {isBoxOpen &&
                modulo.components.map((comp) => (
                  <Item
                    key={comp.id}
                    {...comp}
                    onSelect={() => handleSelect(comp.id)}
                    isTarget={!selectedItem && currentTask?.target === comp.id}
                    selected={selectedItem === comp.id}
                  />
                ))}
            </group>
          </Suspense>
        </Canvas>
        <Loader />
      </div>

      {missionComplete && <MissionCompleteScreen currentModuleId={modulo.id} />}
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
  const moduloParaRenderizar = { id, title: moduloData.title, ...moduloData.simulacao3D };
  return <InteractiveModule modulo={moduloParaRenderizar} />;
}