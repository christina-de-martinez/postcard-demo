import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Box } from "./Box";
import { useRef, useState, useEffect } from "react";
import styles from "./Mailbox.module.css";
import Postcard from "./Postcard";

export default function Mailbox() {
    const boxRef = useRef();
    const [animations, setAnimations] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (boxRef.current) {
                try {
                    const availableAnimations =
                        boxRef.current.getAvailableAnimations();
                    setAnimations(availableAnimations);
                } catch (error) {
                    console.error("Error getting animations:", error);
                }
            } else {
                console.log("boxRef.current is null");
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const playAnimation = (animationName) => {
        if (boxRef.current) {
            boxRef.current.playAnimation(animationName);
        }
    };

    const refreshAnimations = () => {
        if (boxRef.current) {
            try {
                const availableAnimations =
                    boxRef.current.getAvailableAnimations();
                console.log(
                    "Manually fetched animations:",
                    availableAnimations
                );
                setAnimations(availableAnimations);
            } catch (error) {
                console.error("Error in manual refresh:", error);
            }
        } else {
            console.log("boxRef.current is still null");
        }
    };

    return (
        <div className={styles.canvas}>
            <Canvas
                camera={{
                    position: [-0.0, 1.594, 1.044],
                    fov: 35,
                }}
            >
                <OrbitControls
                    target={[0.022, 1.356, -1.666]}
                    enablePan={false}
                    enableZoom={false}
                    enableRotate={false}
                />
                <ambientLight intensity={0.8} color="#f0f0f0" />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={0.8}
                    color="#ffffff"
                    castShadow
                />
                <directionalLight
                    position={[-5, 5, 5]}
                    intensity={0.6}
                    color="#e6f2ff"
                />
                <directionalLight
                    position={[0, -2, 5]}
                    intensity={0.3}
                    color="#fff8e1"
                />
                <hemisphereLight
                    skyColor="#87ceeb"
                    groundColor="#8b7355"
                    intensity={0.4}
                />
                <Box ref={boxRef} />
                <Html
                    position={[0, -0.4, -5]}
                    center
                    distanceFactor={4}
                    style={{
                        color: "white",
                        fontSize: "24px",
                        fontWeight: "bold",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    }}
                >
                    <Postcard />
                </Html>
            </Canvas>

            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    backgroundColor: "#333",
                    padding: "10px",
                    borderRadius: "5px",
                }}
            >
                <div style={{ color: "white", fontSize: "12px" }}>
                    Animations found: {animations.length}
                </div>

                {/* Manual refresh button */}
                <button
                    onClick={refreshAnimations}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#9b59b6",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    Refresh Animations
                </button>

                {animations.map((animationName) => (
                    <button
                        key={animationName}
                        onClick={() => playAnimation(animationName)}
                        style={{
                            padding: "10px 15px",
                            backgroundColor: "#007acc",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Play {animationName}
                    </button>
                ))}
            </div>
        </div>
    );
}
