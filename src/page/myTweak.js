import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Sky, Environment, Cloud } from '@react-three/drei'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import { useControls, button } from 'leva'

export default function App() {
    const { debug } = useControls({
        debug: false, number: 3, foo: button((get) => alert(`Number value is ${get('number').toFixed(2)}`)),
    })
    return (
        <Canvas shadows camera={{ position: [-50, -25, 150], fov: 15 }}>
            <Suspense fallback={null}>
                <hemisphereLight intensity={0.45} />
                <spotLight angle={0.4} penumbra={1} position={[20, 30, 2.5]} castShadow shadow-bias={-0.00001} />
                <directionalLight color="red" position={[-10, -10, 0]} intensity={1.5} />
                <Cloud scale={1.5} position={[20, 0, 0]} />
                <Cloud scale={1} position={[-20, 10, 0]} />
                <Environment preset="city" />
                <Sky />
                <Physics colliders={false}>
                    {debug && <Debug />}
                    <group position={[2, 3, 0]}>
                        <Cylinder position={[-0.85, 4, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[1.5, 1.75, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[1.15, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[2, 3, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[1.25, 5, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[-1, 7, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[-1.5, 5, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[1.75, 8, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Track position={[-3, 0, 10.5]} rotation={[0, -0.4, 0]} />
                        <Box position={[-3, 11, 0]} rotation={[0, 0, -0.5]} />
                        <Box position={[-8.6, 12.3, 0]} length={80} rotation={[0, 0, -0.1]} />
                        <Sphere position={[-12, 13, 0]} />
                        <Sphere position={[-9, 13, 0]} />
                        <Sphere position={[-6, 13, 0]} />
                        {/* <Sphere position={[-6, 13, 0]} /> */}
                        {Array.from({ length: 10 }, (_, i) => (
                            <Sphere key={i} position={[-12-(i*3), 13+i, 0]} />
                        ))}
                        <Pacman />
                    </group>
                </Physics>
                <OrbitControls />
            </Suspense>
        </Canvas>
    )
}
// z={-(i / 10) * depth - 20}
function Add() {
    console.log("add");
}

const Box = ({ length = 4, ...props }) => (
    <RigidBody colliders="cuboid" type="fixed">
        <mesh castShadow receiveShadow {...props}>
            <boxGeometry args={[length, 0.4, 4]} />
            <meshStandardMaterial color="white" />
        </mesh>
    </RigidBody>
)

const Sphere = (props) => (
    <RigidBody colliders="ball" restitution={0.7}>
        <mesh castShadow receiveShadow {...props}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="white" />
        </mesh>
    </RigidBody>
)
console.log(Sphere);
const Cylinder = (props) => (
    <RigidBody colliders="hull" type="fixed">
        <mesh castShadow receiveShadow {...props}>
            <cylinderGeometry args={[0.25, 0.25, 4]} />
            <meshStandardMaterial />
        </mesh>
    </RigidBody>
)

function Pacman() {
    const ref = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        ref.current.setNextKinematicTranslation({ x: -5, y: -8 + Math.sin(t * 10) / 2, z: 0 })
        ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.2, y: Math.sin(t) * 0.1 - 0.1, z: Math.cos(t) * 0.05 })
    })
    return (
        <group>
            <RigidBody ref={ref} type="kinematicPosition" colliders="trimesh">
                <mesh castShadow receiveShadow rotation={[-Math.PI / 2, Math.PI, 0]}>
                    <sphereGeometry args={[10, 32, 32, 0, Math.PI * 1.3]} />
                    <meshStandardMaterial color="#ffc060" side={THREE.DoubleSide} />
                </mesh>
                <mesh castShadow position={[-5, 0, 8.5]}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial color="black" roughness={0.75} />
                </mesh>
                <mesh castShadow position={[-5, 0, -8.5]}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial color="black" roughness={0.75} />
                </mesh>
            </RigidBody>
        </group>
    )
}

function Track(props) {
    const { nodes } = useGLTF('/ball-trip.optimized.glb')
    return (
        <RigidBody colliders="trimesh" type="fixed">
            <mesh geometry={nodes.Cylinder.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial color="lightblue" transmission={1} thickness={1} roughness={0} />
            </mesh>
        </RigidBody>
    )
}
