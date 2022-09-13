import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, } from '@react-three/fiber'
import { useGLTF, OrbitControls, Sky, Environment, Cloud, TransformControls } from '@react-three/drei'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import { useControls, button } from 'leva'

import Youtube from "react-youtube";

let currentSelectedMesh = null;

let outBalls = null



export default function App() {
    const [balls, setBalls] = useState([])
    outBalls = balls;
    const transformRef = useRef();

    const videoRef = useRef();
    const [isSound, setSound] = useState(false);

    function toggleMusic() {

        isSound ? videoRef.current.pauseVideo() : videoRef.current.playVideo()
        setSound(!isSound);
    }

    function onReady(event) {
        videoRef.current = event.target;
        toggleMusic()
    }

    function onEnd(event){
        videoRef.current.playVideo()
        // setSound(!isSound);
    }

    const { debug } = useControls({

        debug: false,
        // attach: button((get) => {
        //     transformRef.current.attach(currentSelectedMesh)
        // }),
        add: button((get) => {
            setBalls(balls => [...balls, { handle: 0, mesh: null, index: balls.length }])
        }),
        // log: button((get) => {
        //     console.log(outBalls);
        // }),
        music: button((get) => {
            toggleMusic()
        })
    })



    useEffect(() => {
        window.xManager = {
            transformControls: transformRef,
        }

        const id = setInterval(() => {
            setBalls(balls => [...balls, { handle: 0, mesh: null, index: balls.length }])
        }, 3000)


        return (() => {
            clearInterval(id)
        })
    }, [])

    return (
        <React.Fragment>

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





                        <ThreeHolePlate position={[0, -5, 0]} />
                        <FourHolePlate position={[0, -15, 0]} />
                        <FiveHolePlate position={[0, -25, 0]} />

                        <CollisionBox visible={true} position={[-0.46, -6.47243272649825, 2.27]} scale={[12.55, 2, 4.84]} />
                        <CollisionBox visible={true} position={[1.92, -16.14, 1.85]} rotation={[0, 0.82, 0]} scale={[12.55, 2, 7.78]} />
                        <CollisionBox visible={true} position={[-1.35, -26.46, -0.54]} rotation={[0, 0.67, 0]} scale={[12.55, 2, 9.11]} />
                        {/* <CollisionBox position={[2.14, -6.45, 3.57]} scale={2} /> */}

                        {balls.map((v, i) => (
                            <Sphere setBalls={setBalls} info={v} key={v.index} position={[0, 5, 0]} />
                        ))}


                    </Physics>
                    {/* <PositionHelper /> */}
                    <OrbitControls makeDefault />
                    {/* <TransformControls ref={transformRef}
                    onMouseDown={(obj) => {
                    }}
                    onMouseUp={(obj) => {
                        console.log(obj.target.object.position, obj.target.object.rotation, obj.target.object.scale);
                    }} /> */}
                </Suspense>
            </Canvas>
            <div
                style={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    zIndex: -999,
                }}
            >
                <Youtube
                    videoId={"CGaba0gekn4"}
                    opts={{
                        width: "10",
                        height: "10",
                        playerVars: {
                            //   autoplay: 1,
                        },
                    }}
                    onReady={onReady}
                    onEnd={onEnd}
                />
            </div>
        </React.Fragment>
    )
}
// z={-(i / 10) * depth - 20}
function CollisionBox(props) {
    const ref = useRef()
    const meshRef = useRef()




    function remove(obj) {


        // filter 써야겠네
        // console.log(obj);
        outBalls.map((v, i) => {
            if (v.handle === obj.target.handle) {
                obj.target.collider().setSensor(true)
                obj.target.sleep()
                // ref.current.visible = true

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


            <mesh
                ref={meshRef}
                onDoubleClick={() => {
                    currentSelectedMesh = meshRef.current
                    console.log("currentSelectedMesh: ", currentSelectedMesh);
                }}
                {...props}>
                <boxGeometry />
                <meshStandardMaterial transparent={true} opacity={0} wireframe={true} />
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



    return (
        <RigidBody ref={bodyRef} type={"dynamic"} colliders="ball" restitution={0.7}>
            <mesh ref={ref} castShadow receiveShadow {...props}>
                <sphereGeometry args={[0.5, 32, 32]} />
                {/* <meshStandardMaterial color="white" /> */}
                <meshPhysicalMaterial transmission={1} color={[Math.random(), Math.random(), Math.random()]} thickness={1} roughness={0} />
            </mesh>
        </RigidBody>
    )
}









function ThreeHolePlate(props) {
    const ref = useRef()
    // const { nodes } = useGLTF('/ball-trip.optimized.glb')
    const { nodes } = useGLTF('/threeHolePlate.glb')
    // console.log(nodes);
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.1, y: 0, z: Math.sin(t) * 0.1 })
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) , y: Math.sin(t), z: Math.cos(t) * 0.05 })
    })
    return (
        <RigidBody ref={ref} colliders="trimesh" type="kinematicPosition">
            <mesh geometry={nodes.Cylinder009_1.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="orange" thickness={1} roughness={0} />
            </mesh>
            <mesh geometry={nodes.Cylinder009.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="orange" thickness={1} roughness={0} />
            </mesh>
        </RigidBody>
    )
}

function FourHolePlate(props) {
    const ref = useRef()
    // const { nodes } = useGLTF('/ball-trip.optimized.glb')
    const { nodes } = useGLTF('/fourHolePlate.glb')
    // console.log(nodes);
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.1, y: 0, z: Math.sin(t) * 0.1 })
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) , y: Math.sin(t), z: Math.cos(t) * 0.05 })
    })
    return (
        <RigidBody ref={ref} colliders="trimesh" type="kinematicPosition">
            <mesh geometry={nodes.Cylinder013_1.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="lime" thickness={1} roughness={0} />
            </mesh>
            <mesh geometry={nodes.Cylinder013.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="lime" thickness={1} roughness={0} />
            </mesh>
        </RigidBody>
    )
}

function FiveHolePlate(props) {
    const ref = useRef()
    // const { nodes } = useGLTF('/ball-trip.optimized.glb')
    const { nodes } = useGLTF('/fiveHolePlate.glb')
    // console.log(nodes);
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.1, y: 0, z: Math.sin(t) * 0.1 })
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) , y: Math.sin(t), z: Math.cos(t) * 0.05 })
    })
    return (
        <RigidBody ref={ref} colliders="trimesh" type="kinematicPosition">
            <mesh geometry={nodes.Cylinder019_1.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="cyan" thickness={1} roughness={0} />
            </mesh>
            <mesh geometry={nodes.Cylinder019.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="cyan" thickness={1} roughness={0} />
            </mesh>
        </RigidBody>
    )
}
