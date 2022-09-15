// import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Sky, Environment, Cloud, Html } from '@react-three/drei'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import { useControls, button, Leva } from 'leva'
import { FaMapMarkerAlt } from 'react-icons/fa'
import Youtube from "react-youtube";
import confetti from 'canvas-confetti'
// console.log(confetti);


let currentSelectedMesh = null;

let outBalls = null



export default function App() {
    const [balls, setBalls] = useState([])
    outBalls = balls;
    const transformRef = useRef();

    const videoRef = useRef();
    const [isSound, setSound] = useState(false);
    // const [isRandomColor, setIsRandomColor] = useState(false);
    const scale = 1.2;
    function toggleMusic() {

        isSound ? videoRef.current.pauseVideo() : videoRef.current.playVideo()
        setSound(!isSound);
    }

    function onReady(event) {
        videoRef.current = event.target;
        // toggleMusic()
    }

    function onEnd(event) {
        videoRef.current.playVideo()
        // setSound(!isSound);
    }

    const { debug, randomColor } = useControls({

        debug: false,
        randomColor: false,
        // scale: {
        //     value: 1,
        //     min: 1,
        //     max: 10,

        // },
        // scale: {
        //     value: 1,
        //     min: 1,
        //     max: 10,

        // },
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
            <Leva
                collapsed={window.innerWidth > 800 ? false : true}
            />
            <Canvas shadows camera={{ position: [0, 70, 140], fov: 15 }}>
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





                        <ThreeHolePlate position={[0, 5, 0]} />
                        <FourHolePlate position={[0, -5, 0]} />
                        <FiveHolePlate position={[0, -15, 0]} />

                        <CollisionBox visible={true} position={[-0.46, -6.47243272649825 + 10, 2.27]} scale={[12.55, 2, 4.84]} />
                        <CollisionBox visible={true} position={[1.92, -16.14 + 10, 1.85]} rotation={[0, 0.82, 0]} scale={[12.55, 2, 7.78]} />
                        <CollisionBox visible={true} position={[-1.35, -26.46 + 10, -0.54]} rotation={[0, 0.67, 0]} scale={[12.55, 2, 9.11]} />

                        <EndCollisionBox visible={true} position={[2.7, -26.46 + 10, 3.7]} rotation={[0, 0, 0]} scale={2} />
                        {/* <CollisionBox position={[2.14, -6.45, 3.57]} scale={2} /> */}

                        {balls.map((v, i) => (
                            <Sphere scale={scale} randomColor={randomColor} setBalls={setBalls} info={v} key={v.index} position={[0, 15, 0]} />
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
                    <Marker rotation={[0, 0, 0]} position={[0, -3 + 10, -5]} scale={3}>
                        {/* Anything in here is regular HTML, these markers are from font-awesome */}
                        <FaMapMarkerAlt style={{ color: 'red' }} />
                    </Marker>
                    <Marker rotation={[0, 0, 0]} position={[-3.5, -13 + 10, -3]} scale={3}>
                        {/* Anything in here is regular HTML, these markers are from font-awesome */}
                        <FaMapMarkerAlt style={{ color: 'red' }} />
                    </Marker>
                    <Marker rotation={[0, 0, 0]} position={[2.7, -23 + 10, 4]} scale={3}>
                        <div style={{ position: 'absolute', fontSize: 10, letterSpacing: -0.5, left: 17.5 }}>GOAL</div>
                        <FaMapMarkerAlt style={{ color: 'red' }} />
                    </Marker>
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
                {/* <meshStandardMaterial transparent={true} opacity={0} wireframe={true} /> */}
                <meshStandardMaterial wireframe={true} />
            </mesh>

        </RigidBody >
    )
}



function EndCollisionBox(props) {
    const ref = useRef()
    const meshRef = useRef()




    function winner(obj) {


        // filter 써야겠네
        // console.log(obj);
        outBalls.map((v, i) => {
            if (v.handle === obj.target.handle) {
                obj.target.collider().setSensor(true)
                obj.target.sleep()
                // ref.current.visible = true

                v.mesh.visible = false;
                console.log(v);
                let color = v.index % 2 === 0 ? "tomato" : "cadetblue"
                confetti();
                setTimeout(() => {

                    alert(`${color} Color Wins!`)
                }, 1000)
            }
            return null
            // 근데 찾는것도 world api 에 접근가능해야 하잖아??
        })
    }

    return (
        <RigidBody ref={ref}
            onCollisionEnter={winner}
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
                {/* <meshStandardMaterial wireframe={true} /> */}
            </mesh>

        </RigidBody >
    )
}

// function PositionHelper({ attach }) {

//     const ref = useRef()

//     return (
//         <mesh ref={ref} onDoubleClick={() => attach(ref)}>
//             <boxGeometry />
//             <meshNormalMaterial />
//         </mesh>
//     )
// }



function Sphere(props) {
    const ref = useRef()
    const bodyRef = useRef()
    const color = props.randomColor ? [Math.random(), Math.random(), Math.random()] : props.info.index % 2 === 0 ? "tomato" : "cadetblue"

    // useHelper(ref, THREE.BoxHelper, "red")

    useFrame((state) => {
        if (bodyRef.current) {
            if (bodyRef.current.translation().y < -100) {
                bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 });
                // bodyRef.current.collider().setSensor(true)
                bodyRef.current.raw().sleep()

                // bodyRef.sleep()
                // ref.current.visible = true

                ref.current.visible = false;
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
                <meshPhysicalMaterial transmission={1} color={color} thickness={1} roughness={0} />
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
        // const t = state.clock.getElapsedTime()
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.1, y: 0, z: Math.sin(t) * 0.1 })
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) , y: Math.sin(t), z: Math.cos(t) * 0.05 })
    })

    useEffect(() => {
        window.addEventListener("deviceorientation", handleOrientation, true);
    }, [])

    function handleOrientation(e) {
        const x = e.gamma;
        const y = e.beta;
        // Ball._player.body.velocity.x += x;
        // Ball._player.body.velocity.y += y;
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) , y: Math.sin(t), z: Math.cos(t) * 0.05 })
        ref.current.setNextKinematicRotation({ x: y/100 , y: 0, z: -x/100 })
    }

    return (
        <RigidBody ref={ref} colliders="trimesh" type="kinematicPosition">
            <mesh geometry={nodes.Cylinder009_1.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="darkorange" thickness={1} roughness={0} />
            </mesh>
            <mesh geometry={nodes.Cylinder009.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="darkorange" thickness={1} roughness={0} />
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
        // const t = state.clock.getElapsedTime()
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.1, y: 0, z: Math.sin(t) * 0.1 })
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) , y: Math.sin(t), z: Math.cos(t) * 0.05 })
    })
    return (
        <RigidBody ref={ref} colliders="trimesh" type="kinematicPosition">
            <mesh geometry={nodes.Cylinder013_1.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="chartreuse" thickness={1} roughness={0} />
            </mesh>
            <mesh geometry={nodes.Cylinder013.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="chartreuse" thickness={1} roughness={0} />
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
        // const t = state.clock.getElapsedTime()
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) * 0.1, y: 0, z: Math.sin(t) * 0.1 })
        // ref.current.setNextKinematicRotation({ x: Math.cos(t) , y: Math.sin(t), z: Math.cos(t) * 0.05 })
    })
    return (
        <RigidBody ref={ref} colliders="trimesh" type="kinematicPosition">
            <mesh geometry={nodes.Cylinder019_1.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="skyblue" thickness={1} roughness={0} />
            </mesh>
            <mesh geometry={nodes.Cylinder019.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="skyblue" thickness={1} roughness={0} />
            </mesh>
        </RigidBody>
    )
}



// Let's make the marker into a component so that we can abstract some shared logic
function Marker({ children, ...props }) {
    // This holds the local occluded state
    const [occluded, occlude] = useState()
    return (
        <Html
            // 3D-transform contents
            transform
            // Hide contents "behind" other meshes
            occlude
            // Tells us when contents are occluded (or not)
            onOcclude={occlude}
            // We just interpolate the visible state into css opacity and transforms
            style={{ transition: 'all 0.2s', opacity: occluded ? 0 : 1, transform: `scale(${occluded ? 0.25 : 1})` }}
            {...props}>
            {children}
        </Html>
    )
}