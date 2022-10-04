import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import GUI from "lil-gui";
// import Peer from 'simple-peer'

console.log(window.location.hash === '#1');

const p = new window.SimplePeer({
    initiator: window.location.hash === '#1',
    trickle: false
})

// 커넥션 하나당 p 가 늘어나야한다 ...
// 배열로 관리
// webrtc 대규모 멀티플레이에는 부적합 .
// 물리까지 싱크가 가능할까 ??

// var peer1 = new window.SimplePeer({ initiator: true })
// var peer2 = new window.SimplePeer()

// peer1.on('signal', data => {
//   // when peer1 has signaling data, give it to peer2 somehow
//   peer2.signal(data)
// })

// peer2.on('signal', data => {
//   // when peer2 has signaling data, give it to peer1 somehow
//   peer1.signal(data)
// })

// peer1.on('connect', () => {
//   // wait for 'connect' event before using the data channel
//   peer1.send('hey peer2, how is it going?')
// })

// peer2.on('data', data => {
//   // got a data channel message
//   console.log('got a message from peer1: ' + data)
// })

export default function Main() {
    // const canvasRef = useRef();
    const incomingRef = useRef();
    const outgoingRef = useRef();
    useEffect(() => {

        p.on('error', err => console.log('error', err))

        p.on('signal', data => {
            console.log('SIGNAL', JSON.stringify(data))
            outgoingRef.current.textContent = JSON.stringify(data)
        })



        p.on('connect', () => {
            console.log('CONNECT')
            p.send('whatever' + Math.random())
        })

        p.on('data', data => {
            console.log('data: ' + data)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <div>
            <form onSubmit={ev => {
                ev.preventDefault()
                p.signal(JSON.parse(incomingRef.current.value))
            }}>
                <textarea id="incoming" ref={incomingRef}></textarea>
                <button type="submit">submit</button>
            </form>
            <pre id="outgoing" ref={outgoingRef}></pre>
            <button onClick={() => {
                p.send(prompt())
            }}>Send</button>
        </div>
    );
}