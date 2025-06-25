import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

const itens = [
  { id: 'fhr', nome: "Transdutor Fetal (FHR)", cor: '#EC4899', pos: [-0.6,0.05,0], descricao: "Captura batimentos cardíacos fetais." },
  { id: 'toco', nome: "Transdutor de Contrações (TOCO)", cor: '#3B82F6', pos: [0.6,0.05,0], descricao: "Detecta contrações uterinas." }
];

function Item({ data, onSelect, isSelected }) {
  const mesh = useRef();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto';
  },[hover]);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.position.y = data.pos[1] + Math.sin(clock.getElapsedTime() *2 + data.pos[0]) *0.05;
    }
  });

  return (
    <group position={data.pos} onClick={(e)=>{e.stopPropagation(); onSelect(data);}}>
      <mesh ref={mesh} scale={hover?1.2:1} onPointerOver={()=>setHover(true)} onPointerOut={()=>setHover(false)}>
        <boxGeometry args={[0.5,0.2,0.5]}/>
        <meshStandardMaterial color={data.cor}/>
      </mesh>
      <Text position={[0,0.4,0]} fontSize={0.1}>{data.nome}</Text>
    </group>
  );
}

function Box({ onOpen, isOpen }) {
  const lid = useRef();
  useFrame(()=>{
    if(isOpen && lid.current && lid.current.rotation.x > -Math.PI/2){
      lid.current.rotation.x -= 0.04;
    }
  });
  return (
    <group onClick={e=>{e.stopPropagation(); if(!isOpen) onOpen();}}>
      <mesh position={[0,-0.1,0]}>
        <boxGeometry args={[2.8,0.2,1.8]}/>
        <meshStandardMaterial color="#fff"/>
      </mesh>
      <mesh ref={lid} position={[0,0.01,0.9]}>
        <boxGeometry args={[2.8,0.02,1.8]}/>
        <meshStandardMaterial color="#f472b6"/>
        {!isOpen && (
          <Text position={[0,0.02,-0.5]} rotation={[-Math.PI/2,0,0]} color="white" fontSize={0.2}>Clique para Abrir</Text>
        )}
      </mesh>
    </group>
  );
}

export default function Module1Interactive() {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);
  const [found, setFound] = useState(new Set());

  const onSelect = (item) => {
    setSel(item);
    setFound(prev => new Set(prev).add(item.id));
  };

  const allFound = found.size === itens.length;

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <Suspense fallback={<div className="flex items-center justify-center h-full">Carregando...</div>}>
        <Canvas camera={{position:[0,2.5,4.5], fov:50}} shadows>
          <ambientLight intensity={1.2}/>
          <spotLight position={[10,10,10]} angle={0.3} penumbra={1} castShadow />
          <Box onOpen={()=>setOpen(true)} isOpen={open}/>
          {open && itens.map(item=>(
            <Item key={item.id} data={item} onSelect={onSelect} isSelected={sel?.id===item.id}/>
          ))}
          <mesh rotation-x={-Math.PI/2} position-y={-0.21}>
            <planeGeometry args={[20,20]}/>
            <shadowMaterial opacity={0.2}/>
          </mesh>
          <OrbitControls enablePan={false} minDistance={3} maxDistance={8} maxPolarAngle={Math.PI/2.1} />
          <Environment preset="city"/>
        </Canvas>
      </Suspense>

      <div className="absolute top-5 left-5 bg-white p-6 backdrop-blur-sm rounded shadow max-w-sm">
        <h2 className="text-xl font-bold mb-2">Módulo 1: Interativo iCTG</h2>
        {!open && <p>Clique na caixa para iniciar.</p>}
        {open && !sel && <p>Explore os itens. Clique para ver detalhes.</p>}
        {sel && (
          <div>
            <h3 className="font-bold">{sel.nome}</h3>
            <p>{sel.descricao}</p>
          </div>
        )}
      </div>

      {allFound && (
        <div className="absolute bottom-8 right-8">
          <Link to="/modulos/2" className="bg-green-500 text-white font-bold py-3 px-6 rounded-full">Próximo: Módulo 2 ➔</Link>
        </div>
      )}
    </div>
  );
}
