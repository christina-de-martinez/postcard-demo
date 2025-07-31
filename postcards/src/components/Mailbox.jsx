import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Box } from "./Box";
import { useRef, useState, useEffect } from "react";
import styles from "./Mailbox.module.css";
import PostcardWithProvider from "./PostcardWithProvider";
import { useSpring } from "@react-spring/web";
import { animated } from "@react-spring/three";
import FlipButton from "./FlipButton";

export default function Mailbox({ imageNumber = 1 }) {
    const boxRef = useRef();
    const [animations, setAnimations] = useState([]);
    const [inserted, setInserted] = useState(false);

    const [flipped, setFlipped] = useState(false);

    // todo: animation for dropping in the postcard from above when form is submitted or upon initial load
    // this should happen after the open animation
    const { position, rotation } = useSpring({
        position: inserted ? [-0.055, 1.52, 0] : [0, 1.55, 0.5],
        rotation: inserted
            ? [0, Math.PI / 2 + (flipped ? Math.PI : 0), 0]
            : [0, flipped ? Math.PI : 0, 0],
        config: { mass: 1, tension: 120, friction: 18 },
    });

    const { frontOpacity } = useSpring({
        frontOpacity: flipped ? 0 : 1,
        config: { mass: 1, tension: 200, friction: 20 },
    });

    const { backOpacity } = useSpring({
        backOpacity: flipped ? 1 : 0,
        config: { mass: 1, tension: 200, friction: 20 },
        delay: flipped ? 100 : 0, // delay showing back when flipping to avoid overlap
    });

    const handleFlip = () => {
        console.log("about to flip");
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

    const playAnimations = () => {
        setInserted(true);
        if (boxRef.current) {
            boxRef.current.playAnimation("CLOSE");
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
                    target={[0, 1.4, -1]}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
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
                <Box ref={boxRef} position={[0, 0, 0]} />
                <animated.group position={position} rotation={rotation}>
                    <mesh>
                        <boxGeometry args={[0.25, 0.15, 0.0025]} />
                        <meshStandardMaterial transparent opacity={0} />
                    </mesh>

                    <Html
                        transform
                        position={[-0.13, 0.08, 0.0015]} // front side, slightly in front of mesh
                        rotation={[0, 0, 0]}
                        scale={0.21}
                        distanceFactor={0.5}
                        occlude
                        className={styles.html}
                        style={{
                            opacity: frontOpacity,
                            pointerEvents: flipped ? "none" : "auto",
                        }}
                    >
                        <div className={styles.frontSide}>
                            <PostcardWithProvider
                                imageNumber={imageNumber}
                                playAnimations={playAnimations}
                            />
                            <FlipButton handleFlip={handleFlip} />
                        </div>
                    </Html>

                    <Html
                        transform
                        position={[0.13, 0.08, -0.0015]} // back side, slightly behind mesh
                        rotation={[0, Math.PI, 0]} // rotated 180 degrees so content faces forward when group flips
                        scale={0.21}
                        distanceFactor={0.5}
                        occlude
                        className={styles.html}
                        style={{
                            opacity: backOpacity,
                            pointerEvents: flipped ? "auto" : "none",
                        }}
                    >
                        <div
                            className={styles.backSide}
                            style={{
                                width: "1000px",
                                height: "600px",
                                color: "white",
                                fontSize: "24px",
                                fontWeight: "bold",
                            }}
                        >
                            <img
                                src={`/${imageNumber}.jpg`}
                                alt="Postcard back"
                            />
                            <FlipButton handleFlip={handleFlip} />
                        </div>
                    </Html>
                </animated.group>
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
                <button
                    onClick={() => setInserted((v) => !v)}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    Animate
                </button>
            </div>
        </div>
    );
}
