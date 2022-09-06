import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Sky, Environment, Cloud, useHelper, TransformControls } from '@react-three/drei'
import { Debug, Physics, RigidBody, WorldApi } from '@react-three/rapier'
import { useControls, button } from 'leva'


const box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())

let currentSelectedMesh = null;

let startPosition = new THREE.Vector3();
let resultVector = new THREE.Vector3();

export default function App() {
    const [balls, setBalls] = useState([])
    const transformRef = useRef();
    const rigidRef = useRef();
    const { debug } = useControls({
        position: {
            value:{x:0,y:0},
            onChange:(value)=>{
                currentSelectedMesh?.dispatchEvent({ type: "moved", message: {x:value.x*50,y:value.y*50, z:0} })
            }
        },
        debug: false,
        number: 3,
        foo: button((get) => alert(`Number value is ${get('number').toFixed(2)}`)),
        attach: button((get) => {
            console.log(transformRef.current);
            console.log(rigidRef.current)
            transformRef.current.attach(currentSelectedMesh)
        }),
        add:button((get)=>{
            setBalls(balls=>[...balls, {}])
        })
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


                        <Cylinder ref={rigidRef} rotation={[Math.PI / 2, 0, 0]} />

                        <Cylinder position={[1.5, 1.75, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[1.15, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[2, 3, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[1.25, 5, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[-1, 7, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[-1.5, 5, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Cylinder position={[1.75, 8, 0]} rotation={[Math.PI / 2, 0, 0]} />
                        <Track position={[-3, 0, 10.5]} rotation={[0, -0.4, 0]} />
                        <Box position={[-3, 10, 0]} rotation={[0, 0, -0.5]} />
                        <Box position={[-44.6, 12.3, 0]} length={80} rotation={[0, 0, -0.03]} />
                        {/* <Sphere position={[-12, 13, 0]} />
                        <Sphere position={[-9, 13, 0]} />
                        <Sphere position={[-6, 13, 0]} /> */}
                        <CollisionBox checkers />
                        {/* <Sphere position={[-6, 13, 0]} /> */}
                        {balls.map((_, i) => (
                            <Sphere setBalls={setBalls} csid={i} key={i} position={[-12 - (i * 3), 13 + i, 0]} />
                        ))}
                        <Pacman />
                    </group>
                </Physics>
                <OrbitControls makeDefault />
                <TransformControls ref={transformRef}
                    onMouseDown={(obj) => {
                        console.log(obj.target.object.position);
                        startPosition.copy(obj.target.object.position)
                    }}
                    onMouseUp={(obj) => {
                        console.log(obj.target.object.position);
                        // console.log(obj.target.object.children[0].children[0].position);
                        // console.log(obj.target.object.position);
                        resultVector.subVectors(obj.target.object.position,startPosition)
                        // obj.target.object.dispatchEvent({ type: "moved", message: obj.target.object.position })
                        obj.target.object.dispatchEvent({ type: "moved", message: resultVector })
                    }} />
            </Suspense>
        </Canvas>
    )
}
// z={-(i / 10) * depth - 20}
function CollisionBox() {
    const ref = useRef()


    useFrame(() => {
        // box.intersectsBox()
    })

    useEffect(() => {
        box.setFromObject(ref.current);
    }, [])

    return (
        <RigidBody onCollisionEnter={({ manifold }) => {
            // console.log('Collision at world position ', manifold.solverContactPoint(0))
        }} colliders={false} type="fixed">

            <mesh ref={ref} scale={10}>
                <boxGeometry />
                <meshStandardMaterial wireframe={true} />
            </mesh>
        </RigidBody>
    )
}

const Box = ({ length = 4, ...props }) => (
    <RigidBody  colliders="cuboid" type="fixed">
        <mesh castShadow receiveShadow {...props}>
            <boxGeometry args={[length, 0.4, 4]} />
            <meshStandardMaterial color="white" />
        </mesh>
    </RigidBody>
)

function Sphere(props) {
    const ref = useRef()
    const bodyRef = useRef()
    const { viewport, camera } = useThree()
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 0])
    const sBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    sBox.customFlag = false;
    // let boxHelper = {update:()=>{}}
    useHelper(ref, THREE.BoxHelper, "red")

    const [data] = useState({
        x: THREE.MathUtils.randFloatSpread(2),
        y: THREE.MathUtils.randFloatSpread(height),
        rX: Math.random() * Math.PI,
        rY: Math.random() * Math.PI,
        rZ: Math.random() * Math.PI,
    })



    useFrame((state) => {
        // boxHelper.update()
        sBox.setFromObject(ref.current)
        if (sBox.intersectsBox(box)) {
            // console.log("hell yeah");
            if (!sBox.customFlag) {
                console.log("Enter")
                // bodyRef.current.raw().sleep()
                console.log(bodyRef.current.raw())
            }
            sBox.customFlag = true;
        } else {
            if (sBox.customFlag) {
                console.log("Exit")
                // bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 });
                // bodyRef.current.raw().setTranslation({ x: -12, y: 13, z: 0 })
            }
            sBox.customFlag = false;
        }

        if (bodyRef.current) {
            if (bodyRef.current.translation().y < -100) {
                // bodyRef.current.setTranslation({ x: -12, y: 13, z: 0 });
                bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 });
                // bodyRef.current.sleep()
                // console.log(bodyRef.current)
                // bodyRef.current.lockTranslations(true)
                bodyRef.current.raw().sleep()
                // WorldApi.removeCollider(bodyRef.current)
                // props.setBalls((balls)=>{
                //     balls.splice(props.csid,1);
                //     console.log(balls)
                //     return [...balls]
                // })
            }
        }
    })





    return (
        <RigidBody ref={bodyRef} type={"dynamic"} colliders="ball" restitution={0.7}>
            <mesh ref={ref} castShadow receiveShadow {...props}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>
    )
}



// const Cylinder = (props) => (
//     <RigidBody colliders="hull" type="fixed">
//         <mesh castShadow receiveShadow {...props}>
//             <cylinderGeometry args={[0.25, 0.25, 4]} />
//             <meshStandardMaterial />
//         </mesh>
//     </RigidBody>
// )


function Cylinder({ position, rotation }) {


    const ref = useRef()
    const meshRef = useRef()
    const tmpVector = new THREE.Vector3();
    let num = 1;
    // const random = Math.floor(Math.random() * 4) + 1
    // useFrame((state) => {
    //     const t = state.clock.getElapsedTime()
    //     ref.current.setNextKinematicTranslation({ x: 3 + Math.cos(t * 10) / random, y: 2 + Math.sin(t * 10) / random, z: 0 })
    //     // ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.2, y: Math.sin(t) * 0.1 - 0.1, z: Math.cos(t) * 0.05 })
    // })

    // useEffect(() => {
    //     console.log(ref.current);
    // }, [])

    // 이벤트 기반으로 갈까나?

    useEffect(() => {
        currentSelectedMesh = meshRef.current
        meshRef.current.addEventListener("moved", (event) => {
            console.log("moved!!");
            num++;
            // meshRef.current.getWorldPosition(tmpVector);
            // ref.current.setNextKinematicTranslation({x: tmpVector.x, y: tmpVector.y, z: tmpVector.z })
            ref.current.setTranslation({ x: event.message.x / 2, y: event.message.y / 2, z: event.message.z / 2 })
            // meshRef.current.position.set(event.message.x, event.message.y, event.message.z)
            // ref.current.setNextKinematicTranslation({x: num, y: num, z: num })
            // ref.current.setNextKinematicTranslation({x: event.message.x, y: event.message.y, z: event.message.z })
        })
    }, [])

    function Test() {
        console.log("test")
        // ref.current.setNextKinematicTranslation({x: num, y: num, z: num })
        ref.current.setNextKinematicTranslation({ x: num, y: num, z: num })
        num++
    }

    return (
        <RigidBody ref={ref} colliders="hull" type="kinematicPosition">
            <mesh onClick={Test} ref={meshRef} castShadow receiveShadow position={position} rotation={rotation}>
                <cylinderGeometry args={[0.25, 0.25, 4]} />
                <meshStandardMaterial />
            </mesh>
        </RigidBody>
    )
}

function Pacman() {
    const ref = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        ref.current.setNextKinematicTranslation({ x: -5, y: -8 + Math.sin(t * 10) / 2, z: 0 })
        ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.2, y: Math.sin(t) * 0.1 - 0.1, z: Math.cos(t) * 0.05 })
    })
    return (
        <group>
            <RigidBody onCollisionEnter={(obj) => {
                // console.log('Collision at world position ', manifold.solverContactPoint(0))
                // console.log(obj)
            }} ref={ref} type="kinematicPosition" colliders="trimesh">
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
