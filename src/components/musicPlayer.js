import React, { useEffect, useRef, useState } from 'react'
import Youtube from "react-youtube";

export default function MusicPlayer({ play = true, loop = false }) {
    const videoRef = useRef();
    const [isReady,setIsReady] = useState(false);

    function onReady(event) {
        videoRef.current = event.target;
        videoRef.current.playVideo()
        setIsReady(!isReady)
    }

    function onEnd(event) {
        if (loop) {
            videoRef.current.playVideo()
        }
    }

    useEffect(() => {
        if(isReady){

            play ? videoRef.current.pauseVideo() : videoRef.current.playVideo()
        }
    }, [play,isReady])

    return (
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
    )
}