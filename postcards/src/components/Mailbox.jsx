import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Box } from "./Box";
import { useRef, useState, useEffect } from "react";
import styles from "./Mailbox.module.css";
import Postcard from "./Postcard";
import { useSpring, animated } from "@react-spring/web";
import FlipButton from "./FlipButton";

export default function Mailbox({ imageNumber = 1 }) {
    const boxRef = useRef();
    const [animations, setAnimations] = useState([]);

    const [flipped, setFlipped] = useState(false);
    const { transform } = useSpring({
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        config: { mass: 1, tension: 200, friction: 20 },
    });

    const handleFlip = () => {
        setFlipped(!flipped);
    };

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

    useEffect(() => {
        playAnimation("OPEN");
    }, [animations]);

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
                <Html position={[0, -1.5, -23]} center className={styles.html}>
                    <animated.div
                        className={styles.animated}
                        style={{
                            transform: transform.to((t) => `scale(0.7) ${t}`),
                        }}
                    >
                        <div className={styles.frontSide}>
                            <Postcard imageNumber={imageNumber} />
                            <FlipButton handleFlip={handleFlip} />
                        </div>

                        <div className={styles.backSide}>
                            <img
                                src={`/${imageNumber}.jpg`}
                                alt="Postcard back"
                            />
                            <FlipButton handleFlip={handleFlip} />
                        </div>
                    </animated.div>
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
