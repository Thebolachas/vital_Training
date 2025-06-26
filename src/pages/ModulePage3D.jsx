import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { modulosData } from '../Data/dadosModulos.jsx';

// --- GEOMETRIA DOS CORAÇÕES ---
const createHeartGeometry = () => {
    const shape = new THREE.Shape();
    const s = 0.04;
    shape.moveTo(0, -5 * s);
    shape.bezierCurveTo(-3 * s, -10 * s, -10 * s, -10 * s, -10 * s, -2 * s);
    shape.bezierCurveTo(-10 * s, 4 * s, -3 * s, 8 * s, 0, 10 * s);
    shape.bezierCurveTo(3 * s, 8 * s, 10 * s, 4 * s, 10 * s, -2 * s);
    shape.bezierCurveTo(10 * s, -10 * s, 3 * s, -10 * s, 0, -5 * s);
    const extrudeSettings = { depth: 4 * s, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1 * s, bevelThickness: 1 * s };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    return geometry;
};
const heartGeometry = createHeartGeometry();

// --- COMPONENTE DO ITEM (CORAÇÃO) ---
function Item({ cor, posicao, onSelect, isTarget, selected, isClosing }) {
    const meshRef = useRef();
    useEffect(() => {
        document.body.style.cursor = isTarget ? 'pointer' : 'auto';
        return () => { document.body.style.cursor = 'auto'; };
    }, [isTarget]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const targetY = (posicao[1] || 0) + (selected ? 0.3 : 0) + Math.sin(state.clock.getElapsedTime() * 2 + posicao[0]) * 0.05;
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);

        if (isClosing) {
            meshRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.15);
        } else if (isTarget) {
            const scale = 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.1;
            meshRef.current.scale.set(scale, scale, scale);
        } else {
            meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
    });
    return (
        <group position={posicao} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
            <mesh ref={meshRef} geometry={heartGeometry} rotation-x={-Math.PI / 2} castShadow>
                <meshStandardMaterial color={cor} roughness={0.3} metalness={0.2} />
            </mesh>
        </group>
    );
}

// --- COMPONENTE DA CAIXA ---
function Box({ onOpen, onClose, isOpen }) {
    const lidRef = useRef();
    useFrame(() => {
        if (!lidRef.current) return;
        const targetRotation = isOpen ? -Math.PI / 1.9 : 0;
        lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetRotation, 0.08);
    });
    return (
        <group onClick={(e) => { e.stopPropagation(); isOpen ? onClose() : onOpen(); }}>
            <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
                <boxGeometry args={[4.8, 0.3, 2]} />
                <meshStandardMaterial color="#EAEAEA" />
            </mesh>
            <mesh ref={lidRef} position={[0, 0, -1]} castShadow>
                <boxGeometry args={[4.8, 0.08, 2]} />
                <meshStandardMaterial color="#f472b6" metalness={0.1} roughness={0.4} />
                {!isOpen && <Text position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} color="white" fontSize={0.25} anchorX="center">Clique para Abrir</Text>}
            </mesh>
        </group>
    );
}

// --- CÂMERA ADAPTATIVA ---
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

// --- MÓDULO INTERATIVO PRINCIPAL ---
export default function ModulePage3D() {
    const { id } = useParams();
    const moduloData = modulosData?.[id];

    const [taskIndex, setTaskIndex] = useState(0);
    const [isBoxOpen, setBoxOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [missionComplete, setMissionComplete] = useState(false);
    const currentTask = moduloData?.simulacao3D?.tasks?.[taskIndex];

    const handleSelect = (selectedId) => {
        if (missionComplete || !currentTask || selectedId !== currentTask.target) return;
        
        if (currentTask.id === 'abrir_caixa') setBoxOpen(true);
        if (currentTask.id === 'fechar_caixa') setIsClosing(true);

        setTimeout(() => {
            if (taskIndex + 1 < moduloData.simulacao3D.tasks.length) {
                setTaskIndex(prev => prev + 1);
            }
        }, 800);
    };

    useEffect(() => {
      if (currentTask?.isFinal) {
        setMissionComplete(true);
      }
    }, [currentTask]);


    if (!moduloData || !moduloData.simulacao3D) {
        return <div className="text-center p-10">Simulação não encontrada.</div>;
    }
    
    const { title, components, tasks } = moduloData.simulacao3D;

    const allModuleIds = Object.keys(modulosData).filter(id => modulosData[id].simulacao3D);
    const currentIndex = allModuleIds.indexOf(id);
    let nextPath = "/home";
    let buttonText = "Finalizar Treinamento";
    if (currentIndex !== -1 && currentIndex < allModuleIds.length - 1) {
        const nextModuleId = allModuleIds[currentIndex + 1];
        nextPath = `/modulo/${nextModuleId}/teoria`;
        buttonText = "Avançar";
    }

    return (
        <div className="w-screen h-screen relative bg-gray-900 text-white overflow-hidden">
            <Canvas shadows dpr={[1, 2]}>
                <color attach="background" args={['#1A202C']} />
                <Suspense fallback={null}>
                    <ambientLight intensity={1.2} />
                    <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
                    <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minDistance={3} maxDistance={12} target={[0, 0, 0]} />
                    <SafeCamera />
                    <group position-y={-0.5}>
                        <Box
                            onOpen={() => handleSelect('box')}
                            onClose={() => handleSelect('box')}
                            isOpen={isBoxOpen && !isClosing}
                        />
                        {isBoxOpen &&
                            components.map((comp) => (
                                <Item
                                    key={comp.id}
                                    {...comp}
                                    onSelect={() => handleSelect(comp.id)}
                                    isTarget={currentTask?.target === comp.id}
                                    isClosing={isClosing}
                                />
                            ))}
                    </group>
                </Suspense>
            </Canvas>
            <Loader />

            <div className="absolute p-4 w-full bottom-0 left-0 md:top-0 md:left-0 md:bottom-auto md:w-auto md:max-w-md md:p-8 z-20">
                <div className="bg-black bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-2xl">
                    <h2 className="text-xl md:text-3xl font-bold mb-4">{title}</h2>
                    <h3 className="text-base md:text-xl font-semibold text-cyan-400 mb-1">Tarefa Atual:</h3>
                    <p className="text-sm md:text-lg mb-4">{currentTask?.prompt}</p>
                    {currentTask?.teoria && <p className="text-xs md:text-base mt-2 border-t border-gray-600 pt-2">{currentTask.teoria}</p>}
                    <div className="mt-4">
                        <h4 className="font-bold text-sm mb-1">Progresso da Missão:</h4>
                        <ul className="space-y-1 text-xs">
                            {tasks?.map((task, index) => (
                                <li key={task.id} className={`transition-all ${index < taskIndex ? 'text-green-400 opacity-70 line-through' : index === taskIndex ? 'text-cyan-300 font-bold' : 'text-gray-400'}`}>
                                    {task.completedText || task.prompt}
                                </li>
                            ))}
                        </ul>
                        {missionComplete && (
                           <Link to={nextPath} className="block w-full text-center mt-4 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-lg">
                                {buttonText}
                           </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}