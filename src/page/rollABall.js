// import * as THREE from 'three'
import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Sky, Environment, Cloud, Html } from '@react-three/drei'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import { useControls, button, Leva } from 'leva'
// import { FaMapMarkerAlt } from 'react-icons/fa'
import Youtube from "react-youtube";
import confetti from 'canvas-confetti'
import Star from './star'
// console.log(confetti);
const upVector = new THREE.Vector3(0, 1, 0);
const tempVector = new THREE.Vector3();

let currentSelectedMesh = null;

let outBalls = null

let orbitControlsRef = React.createRef();

let x = 0;
let y = 0;

export default function App() {
    const [balls, setBalls] = useState([])
    outBalls = balls;
    const transformRef = useRef();

    const videoRef = useRef();
    const [isSound, setSound] = useState(false);
    const scale = 1;
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
        add: button((get) => {
            setBalls(balls => [...balls, { handle: 0, mesh: null, index: balls.length }])
        }),
        music: button((get) => {
            toggleMusic()
        })
    })



    useEffect(() => {
        window.xManager = {
            transformControls: transformRef,
        }

        // const id = setInterval(() => {
        //     setBalls(balls => [...balls, { handle: 0, mesh: null, index: balls.length }])
        // }, 3000)


        setBalls(balls => [...balls, { handle: 0, mesh: null, index: balls.length }])

        return (() => {
            // clearInterval(id)
            setBalls([])
        })
    }, [])

    return (
        <React.Fragment>
            <Leva
                collapsed={window.innerWidth > 800 ? false : true}
            />
            <Canvas shadows camera={{ position: [0, 70, 0], fov: 15 }}>
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
                        <Stage position={[0, 0, 0]} />
                        <Cross position={[0, 0, 0]} setBalls={setBalls} />
                        <StarWrapper />
                        {/* <EndCollisionBox visible={true} position={[2.7, -26.46 + 10, 3.7]} rotation={[0, 0, 0]} scale={2} /> */}
                        {/* <CollisionBox position={[2.14, -6.45, 3.57]} scale={2} /> */}

                        {/* {balls.map((v, i) => (
                            <Sphere scale={scale} randomColor={randomColor} setBalls={setBalls} info={v} key={v.index} position={[0, 15, 0]} />
                        ))} */}

                        {balls.map((v, i) => (
                            <PlayerSphere scale={scale} randomColor={randomColor} setBalls={setBalls} info={v} key={v.index} position={[0, 5, 8]} />
                        ))}

                    </Physics>
                    {/* <PositionHelper /> */}
                    <OrbitControls ref={orbitControlsRef} makeDefault />

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

    function remove(obj) {
        outBalls.map((v) => {
            if (v.handle === obj.target.handle) {
                obj.target.collider().setSensor(true)
                obj.target.sleep()
                v.mesh.visible = false;
            }
            return null
        })
    }

    return (
        <RigidBody
            onCollisionEnter={remove}
            type="fixed"
            colliders={"cuboid"}
        >


            <mesh
                {...props}>
                <boxGeometry />
                <meshStandardMaterial transparent={true} opacity={0} wireframe={true} />
                {/* <meshStandardMaterial wireframe={true} /> */}
            </mesh>

        </RigidBody >
    )
}



function StarWrapper(props) {
    const ref = useRef()
    const meshRef = useRef()

    useFrame(()=>{

    })


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

                    // alert(`${color} Color Wins!`)
                    alert(`Player wins!`)
                }, 1000)
            }
            return null
            // 근데 찾는것도 world api 에 접근가능해야 하잖아??
        })
    }

    return (
        <RigidBody ref={ref}
            onCollisionEnter={winner}
            type="fixed" colliders={"trimesh"} >



            <Star position={[0, 1, -8]} />
        </RigidBody >
    )
}



function PlayerSphere(props) {
    const ref = useRef()
    const bodyRef = useRef()
    const color = props.randomColor ? [Math.random(), Math.random(), Math.random()] : props.info.index % 2 === 0 ? "tomato" : "cadetblue"

    // useHelper(ref, THREE.BoxHelper, "red")

    useFrame((state) => {
        // const t = state.clock.getDeltaTime()
        if (bodyRef.current) {
            if (bodyRef.current.translation().y < -100) {
                bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 });
                // bodyRef.current.collider().setSensor(true)
                bodyRef.current.raw().sleep()

                // bodyRef.sleep()
                // ref.current.visible = true

                ref.current.visible = false;
            }
            // const angle = orbitControlsRef.current.getAzimuthalAngle();

            // tempVector.set(x / 100 * t, 0, y / 100 * t).applyAxisAngle(upVector, angle);
            // // player.position.addScaledVector(tempVector, params.playerSpeed * delta);
            // bodyRef.current.applyImpulse({ x: tempVector.x, y: 0, z: tempVector.z })


        }
    })


    useEffect(() => {
        // console.log(props.info);
        outBalls[props.info.index].handle = bodyRef.current.handle;
        outBalls[props.info.index].mesh = ref.current;
        // console.log(outBalls);

        window.addEventListener("deviceorientation", handleOrientation, true);
    }, [props])

    function handleOrientation(e) {
        x = e.gamma;
        y = e.beta;

        const angle = orbitControlsRef.current.getAzimuthalAngle();
        tempVector.set(x / 100, 0, y / 100).applyAxisAngle(upVector, angle);
        bodyRef.current.applyImpulse({ x: tempVector.x, y: 0, z: tempVector.z })
    }



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






function Stage(props) {
    const ref = useRef()
    // const { nodes } = useGLTF('/ball-trip.optimized.glb')
    const { nodes } = useGLTF('/stage.glb')
    // console.log(nodes);

    return (
        <RigidBody ref={ref} colliders="trimesh" type="kinematicPosition">

            <mesh geometry={nodes.Cube.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transmission={1} color="skyblue" thickness={1} roughness={0} />
            </mesh>
        </RigidBody>
    )
}


function Cross(props) {
    const ref = useRef()
    // const { nodes } = useGLTF('/ball-trip.optimized.glb')
    const { nodes } = useGLTF('/cross.glb')
    // console.log(nodes);



    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        ref.current.setNextKinematicRotation({ x: 0, y: t, z: 0 })
    })

    function remove(obj) {
        outBalls.map((v) => {
            if (v.handle === obj.target.handle) {
                obj.target.collider().setSensor(true)
                obj.target.sleep()
                v.mesh.visible = false;

                // 재 생성 ...
                // props.setBalls(balls => [...balls, { handle: 0, mesh: null, index: balls.length }])
            }
            return null
        })
    }

    return (
        <RigidBody onCollisionEnter={remove} ref={ref} colliders="trimesh" type="kinematicPosition">
            <mesh geometry={nodes.Cube001.geometry} {...props} dispose={null}>
                <meshPhysicalMaterial transparent={true} transmission={1} color="forestgreen" thickness={1} roughness={0} />
            </mesh>
        </RigidBody>
    )
}
