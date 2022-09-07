import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Sky, Environment, Cloud, useHelper, TransformControls } from '@react-three/drei'
import { CuboidCollider, Debug, MeshCollider, Physics, RigidBody, WorldApi } from '@react-three/rapier'
import { useControls, button } from 'leva'
import { v4 as uuid } from 'uuid'
// import { createWorldApi } from '@react-three/rapier/dist/declarations/src/api'


const box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())

let currentSelectedMesh = null;

let startPosition = new THREE.Vector3();
let resultVector = new THREE.Vector3();

let deleteBoxHandle = 0

export default function App() {
    const [balls, setBalls] = useState([])
    const transformRef = useRef();
    const rigidRef = useRef();
    const { debug } = useControls({
        position: {
            value: { x: 0, y: 0 },
            onChange: (value) => {
                currentSelectedMesh?.dispatchEvent({ type: "moved", message: { x: value.x * 50, y: value.y * 50, z: 0 } })
            }
        },
        debug: false,
        number: 3,
        foo: button((get) => alert(`Number value is ${get('number').toFixed(2)}`)),
        attach: button((get) => {
            transformRef.current.attach(currentSelectedMesh)
        }),
        add: button((get) => {
            setBalls(balls => [...balls, uuid()])
        })
    })

    function Attach(ref) {
        transformRef.current.attach(ref.current)
    }

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





                    <Plate position={[0, -5, 0]} rotation={[0, -0.4, 0]} />

                    <CollisionBox position={[-4, -6.45, 0.9]} scale={2} />
                    <CollisionBox position={[2.14, -6.45, 3.57]} scale={2} />

                    {balls.map((v, i) => (
                        <Sphere setBalls={setBalls} csid={v} key={v} position={[0, 5, 0]} />
                    ))}


                </Physics>
                <PositionHelper attach={Attach} />
                <OrbitControls makeDefault />
                <TransformControls ref={transformRef}
                    onMouseDown={(obj) => {
                        console.log(obj.target.object.position);
                        startPosition.copy(obj.target.object.position)
                    }}
                    onMouseUp={(obj) => {
                        console.log(obj.target.object.position);

                        // obj.target.object.dispatchEvent({ type: "moved", message: obj.target.object.position })
                        // obj.target.object.dispatchEvent({ type: "moved", message: resultVector })
                    }} />
            </Suspense>
        </Canvas>
    )
}
// z={-(i / 10) * depth - 20}
function CollisionBox(props) {
    const ref = useRef()


    useFrame(() => {
        // box.intersectsBox()
    })

    useEffect(() => {
        // box.setFromObject(ref.current);
        console.log(ref.current.raw().collider(0));
        console.log(ref.current.handle)
        deleteBoxHandle = ref.current.handle
        // ref.current.raw().collider().setSensor(true)
        // setTimeout(() => {
        //     // ref.current.raw().setSensor(true)
        //     // ref.current.raw().setIsSensor(true)
        // }, 2000)
    }, [])

    return (
        <RigidBody ref={ref} type="fixed" colliders={"cuboid"} >


            <mesh {...props}>
                <boxGeometry />
                <meshStandardMaterial wireframe={true} />
            </mesh>

        </RigidBody >
    )
}

function PositionHelper({ attach }) {

    const ref = useRef()

    return (
        <mesh ref={ref} onDoubleClick={() => attach(ref)}>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh>
    )
}



function Sphere(props) {
    const ref = useRef()
    const bodyRef = useRef()
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 0])
    const sBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    sBox.customFlag = false;
    // let boxHelper = {update:()=>{}}
    let shitNum = 0;
    useHelper(ref, THREE.BoxHelper, "red")

    const [data] = useState({
        x: THREE.MathUtils.randFloatSpread(2),
        y: THREE.MathUtils.randFloatSpread(height),
        rX: Math.random() * Math.PI,
        rY: Math.random() * Math.PI,
        rZ: Math.random() * Math.PI,
    })



    useFrame((state) => {


        if (bodyRef.current) {
            if (bodyRef.current.translation().y < -100) {
                bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 });
                bodyRef.current.raw().sleep()
            }
        }
    })


    function Remove(obj) {
        console.log(obj.target.handle);
        // 한번만 실행되게 flag 넣자 ....


        if (obj.target.handle === deleteBoxHandle) {
            sBox.customFlag = true
            bodyRef.current.raw().collider().setSensor(true)
            bodyRef.current.raw().sleep()
            ref.current.visible = false
        }

    }


    return (
        <RigidBody onCollisionEnter={Remove} ref={bodyRef} type={"dynamic"} colliders="ball" restitution={0.7}>
            <mesh ref={ref} castShadow receiveShadow {...props}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>
    )
}






function Cylinder({ position, rotation }) {


    const ref = useRef()
    const meshRef = useRef()




    return (
        <RigidBody ref={ref} colliders="hull" type="kinematicPosition">
            <mesh ref={meshRef} castShadow receiveShadow position={position} rotation={rotation}>
                <cylinderGeometry args={[0.25, 0.25, 4]} />
                <meshStandardMaterial />
            </mesh>
        </RigidBody>
    )
}



function Plate(props) {
    // const { nodes } = useGLTF('/ball-trip.optimized.glb')
    const { nodes } = useGLTF('/firstStage2.glb')
    console.log(nodes)
    return (
        <RigidBody colliders="trimesh" type="fixed">
            <mesh geometry={nodes.Cylinder008_1.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial color="lightblue" transmission={1} thickness={1} roughness={0} />
            </mesh>
            <mesh geometry={nodes.Cylinder008.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial color="lightblue" transmission={1} thickness={1} roughness={0} />
            </mesh>
        </RigidBody>
    )
}
