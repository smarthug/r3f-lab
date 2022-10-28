import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { getProject } from '@theatre/core'
import studio from '@theatre/studio'
import extension from '@theatre/r3f/dist/extension'
import { editable as e, SheetProvider } from '@theatre/r3f'
import demoProjectState from './state.json'
import { useEffect } from 'react'

// create-react-app
if (process.env.NODE_ENV === 'development') {
    // studio.initialize()
    // studio.extend(extension)
}
// studio.initialize()
// studio.extend(extension)

// Tip: To make the canvas full-screen, you can add the following rules to your CSS: height: 100vh; margin: 0;

// our Theatre.js project sheet, we'll use this later
const demoSheet = getProject('Demo Project', { state: demoProjectState }).sheet('Demo Sheet')

export default function App() {
    return (
        <Canvas camera={{ position: [5, 5, -5] }} gl={{ preserveDrawingBuffer: true }}>
            <Scene />
        </Canvas>
    )
}

function Scene() {

    useEffect(() => {
        demoSheet.sequence.play({ iterationCount: Infinity, range: [0, 3] })
    }, [])
    return (
        <SheetProvider sheet={demoSheet}>
            <ambientLight />
            <e.pointLight theatreKey='Light' position={[10, 10, 10]} />
            <e.mesh theatreKey='Cube'>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" />
            </e.mesh>
        </SheetProvider>
    )
}