import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

import { useEffect } from 'react'

import { OrbitControls, useGLTF, } from '@react-three/drei'

import GLTFLoader from '../util/gltfLoader'



export default function App() {
    return (
        <Canvas camera={{ position: [5, 5, -5] }} gl={{ preserveDrawingBuffer: true }}>
            <Scene />
        </Canvas>
    )
}

function Scene() {

    useEffect(() => {

    }, [])
    return (
        <>
            <hemisphereLight intensity={0.45} />
            <spotLight angle={0.4} penumbra={1} position={[20, 30, 2.5]} castShadow shadow-bias={-0.00001} />
            <directionalLight color="red" position={[-10, -10, 0]} intensity={1.5} />
            <OrbitControls />

            <Model />
        </>

    )
}






function Model(props) {
    const group = useRef()
    // const { nodes, materials } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/star/model.gltf')
    // const { scene } = useThree()
    const { scene } = useGLTF('QuestionBlock.glb')



    function handleClick() {
        console.log("clicked");
    }

    useEffect(() => {
        // GLTFLoader('QuestionBlock.glb').then((glb) => {
        //     glb.scale.set(0.1,0.1,0.1)
        //     scene.add(glb)
        // })
    }, [])
    return (
        <group ref={group} {...props} dispose={null}>
            <primitive onClick={handleClick} object={scene}/>
        </group>
    )
}

useGLTF.preload('QuestionBlock.glb')