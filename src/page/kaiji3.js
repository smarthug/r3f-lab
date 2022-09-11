import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, } from '@react-three/fiber'
import { useGLTF, OrbitControls, Sky, Environment, Cloud, TransformControls } from '@react-three/drei'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import { useControls, button } from 'leva'
// import { createWorldApi } from '@react-three/rapier/dist/declarations/src/api'


// const box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())

let currentSelectedMesh = null;

let startPosition = new THREE.Vector3();
// let resultVector = new THREE.Vector3();

// let deleteBoxHandle = 0

let outBalls = null

// let scene = null;

export default function App() {
    const [balls, setBalls] = useState([])
    outBalls = balls;
    const transformRef = useRef();

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
            setBalls(balls => [...balls, { handle: 0, mesh: null, index: balls.length }])
        }),
        log: button((get) => {
            console.log(outBalls);
        }),
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





                    <ThreeHolePlate position={[0, -5, 0]} rotation={[0, -0.4, 0]} />
                    <FourHolePlate position={[0, -15, 0]} rotation={[0, -0.4, 0]} />
                    <FiveHolePlate position={[0, -25, 0]} rotation={[0, -0.4, 0]} />

                    <CollisionBox position={[-4, -6.45, 0.9]} scale={2} />
                    <CollisionBox position={[2.14, -6.45, 3.57]} scale={2} />

                    {balls.map((v, i) => (
                        <Sphere setBalls={setBalls} info={v} key={i} position={[0, 5, 0]} />
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




    function remove(obj) {


        // filter 써야겠네
        console.log(obj);
        outBalls.map((v, i) => {
            if (v.handle === obj.target.handle) {
                obj.target.collider().setSensor(true)
                obj.target.sleep()
                // ref.current.visible = false

                v.mesh.visible = false;
            }
            return null
            // 근데 찾는것도 world api 에 접근가능해야 하잖아??
        })
    }

    return (
        <RigidBody ref={ref}
            onCollisionEnter={remove}
            type="fixed" colliders={"cuboid"} >


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

    // useHelper(ref, THREE.BoxHelper, "red")

    useFrame((state) => {
        if (bodyRef.current) {
            if (bodyRef.current.translation().y < -100) {
                bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 });
                bodyRef.current.raw().sleep()
            }
        }
    })


    useEffect(() => {
        // console.log(props.info);
        outBalls[props.info.index].handle = bodyRef.current.handle;
        outBalls[props.info.index].mesh = ref.current;
        // console.log(outBalls);
    }, [props])


    // function Remove(obj) {
    //     console.log(obj.target.handle);
    //     // 한번만 실행되게 flag 넣자 ....


    //     if (obj.target.handle === deleteBoxHandle) {
    //         bodyRef.current.raw().collider().setSensor(true)
    //         bodyRef.current.raw().sleep()
    //         ref.current.visible = false
    //     }

    // }


    return (
        <RigidBody ref={bodyRef} type={"dynamic"} colliders="ball" restitution={0.7}>
            <mesh ref={ref} castShadow receiveShadow {...props}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>
    )
}









function ThreeHolePlate(props) {
    const ref = useRef()
    // const { nodes } = useGLTF('/ball-trip.optimized.glb')
    const { nodes } = useGLTF('/threeHolePlate.glb')
    console.log(nodes);
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.1, y: 0, z: Math.sin(t) * 0.1 })
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) , y: Math.sin(t), z: Math.cos(t) * 0.05 })
    })
    return (
        <RigidBody ref={ref} colliders="trimesh" type="kinematicPosition">
            <mesh geometry={nodes.Cylinder009_1.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial color="lightblue" thickness={1} roughness={0} />
            </mesh>
            <mesh geometry={nodes.Cylinder009.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial color="lightblue" thickness={1} roughness={0} metalness={0.4} />
            </mesh>
        </RigidBody>
    )
}

function FourHolePlate(props) {
    const ref = useRef()
    // const { nodes } = useGLTF('/ball-trip.optimized.glb')
    const { nodes } = useGLTF('/fourHolePlate.glb')
    console.log(nodes);
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.1, y: 0, z: Math.sin(t) * 0.1 })
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) , y: Math.sin(t), z: Math.cos(t) * 0.05 })
    })
    return (
        <RigidBody ref={ref} colliders="trimesh" type="kinematicPosition">
            <mesh geometry={nodes.Cylinder013_1.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial color="lightblue" thickness={1} roughness={0} />
            </mesh>
            <mesh geometry={nodes.Cylinder013.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial color="lightblue" thickness={1} roughness={0} metalness={0.4} />
            </mesh>
        </RigidBody>
    )
}

function FiveHolePlate(props) {
    const ref = useRef()
    // const { nodes } = useGLTF('/ball-trip.optimized.glb')
    const { nodes } = useGLTF('/fiveHolePlate.glb')
    console.log(nodes);
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.1, y: 0, z: Math.sin(t) * 0.1 })
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) , y: Math.sin(t), z: Math.cos(t) * 0.05 })
    })
    return (
        <RigidBody ref={ref} colliders="trimesh" type="kinematicPosition">
            <mesh geometry={nodes.Cylinder019_1.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial color="lightblue" thickness={1} roughness={0} />
            </mesh>
            <mesh geometry={nodes.Cylinder019.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial color="lightblue" thickness={1} roughness={0} metalness={0.4} />
            </mesh>
        </RigidBody>
    )
}
