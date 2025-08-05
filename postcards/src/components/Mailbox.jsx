import {
    useRef,
    useState,
    useEffect,
    Suspense,
    useCallback,
    useMemo,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
    Html,
    OrbitControls,
    SoftShadows,
    ContactShadows,
} from "@react-three/drei";
import {
    EffectComposer,
    Bloom,
    Noise,
    Vignette,
} from "@react-three/postprocessing";
import { useSpring } from "@react-spring/web";
// eslint-disable-next-line no-unused-vars
import { animated } from "@react-spring/three";
import { DoubleSide, ACESFilmicToneMapping } from "three";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitPostcard, sendEmailWithAttachment } from "../services/api";
import { Box } from "./Box";
import Postcard from "./Postcard";
import FlipButton from "./FlipButton";
import Countdown from "./Countdown";
import PostcardLoading from "./PostcardLoading";
import { cancelSendEmail } from "../services/api";
import styles from "./Mailbox.module.css";

export default function Mailbox({ imageNumber = 1 }) {
    const minWindowWidthFor3D = 500;
    const STATUSES = {
        submitted: "submitted",
        error: "error",
    };
    const defaultValues = {
        name: "Your name",
        location: "Your location",
        message: "Your message",
    };
    const boxRef = useRef();
    const controlsRef = useRef();
    const [animations, setAnimations] = useState([]);
    const [flipped, setFlipped] = useState(false);
    const [inserted, setInserted] = useState(false);
    const [countdownRemaining, setCountdownRemaining] = useState(0);
    const [showCountdown, setShowCountdown] = useState(false);
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );
    const [countdownInterval, setCountdownInterval] = useState(null);
    const [resendEmailId, setResendEmailId] = useState(null);
    const [nameValue, setNameValue] = useState(defaultValues.name);
    const [locationValue, setLocationValue] = useState(defaultValues.location);
    const [messageValue, setMessageValue] = useState(defaultValues.message);
    const [submissionStatus, setSubmissionStatus] = useState(null);

    const getResponsiveDimensions = useCallback(() => {
        if (windowWidth <= minWindowWidthFor3D) {
            return null;
        } else if (windowWidth <= 599) {
            return {
                boxGeometry: [0, 0, 0.0025],
                frontPosition: [-0.09, 0.08, 0.0025],
                backPosition: [0.09, 0.08, -0.0025],
                scale: 0.32,
                springPosition: {
                    inserted: [-0.055, 1.52, 0],
                    default: [0, 1.55, 0.5],
                },
            };
        } else if (windowWidth <= 752) {
            return {
                boxGeometry: [0.3, 0.15, 0.0025],
                frontPosition: [-0.13, 0.08, 0.0025],
                backPosition: [0.13, 0.08, -0.0025],
                scale: 0.32,
                springPosition: {
                    inserted: [-0.055, 1.52, 0],
                    default: [0, 1.55, 0.5],
                },
            };
        } else {
            return {
                boxGeometry: [0.2, 0.15, 0.0025],
                frontPosition: [-0.16, 0.08, 0.0025],
                backPosition: [0.16, 0.08, -0.0025],
                scale: 0.25,
                springPosition: {
                    inserted: [-0.055, 1.52, 0],
                    default: [0, 1.55, 0.5],
                },
            };
        }
    }, [windowWidth]);

    const responsiveDimensions = useMemo(
        () => getResponsiveDimensions(),
        [getResponsiveDimensions]
    );

    useEffect(() => {
        let resizeTimeout;

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setWindowWidth(window.innerWidth);
            }, 150);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    const { position, rotation } = useSpring({
        position: inserted
            ? responsiveDimensions.springPosition.inserted
            : responsiveDimensions.springPosition.default,
        rotation: inserted
            ? [0, Math.PI / 2 + (flipped ? Math.PI : 0), 0]
            : [0, flipped ? Math.PI : 0, 0],
        config: { mass: 1, tension: 120, friction: 18 },
    });

    const handleFlip = useCallback(() => {
        setFlipped(!flipped);
    }, [flipped]);

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
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const playAnimation = useCallback((animationName) => {
        if (boxRef.current) {
            boxRef.current.playAnimation(animationName);
        }
    }, []);

    const toggleFlag = useCallback(() => {
        if (boxRef.current) {
            boxRef.current.toggleFlag();
        }
    }, []);

    const handleScheduledPostcardSent = useCallback(() => {
        toggleFlag();
        setResendEmailId(null);
        setTimeout(() => {
            setInserted(false);
        }, 2000);
    }, [toggleFlag]);

    const resetForm = useCallback(() => {
        setNameValue(defaultValues.name);
        setLocationValue(defaultValues.location);
        setMessageValue(defaultValues.message);
    }, [defaultValues.name, defaultValues.location, defaultValues.message]);

    const startCountdown = useCallback(
        (seconds) => {
            toggleFlag();
            setCountdownRemaining(seconds);
            setShowCountdown(true);
            if (countdownInterval) clearInterval(countdownInterval);
            let hasFinished = false;

            const interval = setInterval(() => {
                setCountdownRemaining((prevTime) => {
                    const newTime = prevTime - 1;

                    if (newTime <= 0 && !hasFinished) {
                        setTimeout(() => {
                            if (boxRef.current) {
                                boxRef.current.playAnimation("OPEN");
                            }
                        }, 3000);
                        hasFinished = true;
                        clearInterval(interval);
                        setCountdownInterval(null);
                        handleScheduledPostcardSent();
                        resetForm();
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
            setCountdownInterval(interval);
        },
        [countdownInterval, toggleFlag, handleScheduledPostcardSent, resetForm]
    );

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: submitPostcard,
        onSuccess: (res) => {
            setSubmissionStatus(STATUSES.submitted);
            queryClient.invalidateQueries({ queryKey: ["postcards"] });
            setResendEmailId(res.emailId);
        },
        onError: (error) => {
            console.error("Error creating postcard:", error);
            setSubmissionStatus(STATUSES.error);
        },
    });

    const mutationWithAttachment = useMutation({
        mutationFn: sendEmailWithAttachment,
        onSuccess: () => {
            setSubmissionStatus(STATUSES.submitted);
            resetForm();
        },
        onError: (error) => {
            console.error("Error sending email with attachment:", error);
            setSubmissionStatus(STATUSES.error);
        },
    });

    const handleSubmitFormAdditionalActions = useCallback(() => {
        setInserted(true);
        if (boxRef.current) {
            setTimeout(() => {
                boxRef.current.playAnimation("CLOSE");
            }, 500);

            // Wait for CLOSE animation to finish before raising flag
            setTimeout(() => {
                startCountdown(10);
            }, 1500);
        }
    }, [startCountdown]);

    const handleSubmitPostcard = useCallback(
        (e) => {
            e.preventDefault();
            const postcardData = {
                name: nameValue,
                location: locationValue,
                message: messageValue,
                imageUrl: `${
                    import.meta.env.VITE_FRONTENDURL
                }/${imageNumber}.jpg`,
            };
            handleSubmitFormAdditionalActions();
            mutation.mutate(postcardData);
        },
        [
            imageNumber,
            handleSubmitFormAdditionalActions,
            mutation,
            locationValue,
            messageValue,
            nameValue,
        ]
    );

    useEffect(() => {
        if (animations.length > 0) {
            playAnimation("OPEN");
        }
    }, [animations, playAnimation]);

    useEffect(() => {
        return () => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        };
    }, [countdownInterval]);

    const cancelSend = () => {
        if (resendEmailId) {
            cancelSendEmail({ resendEmailId })
                .then(() => {
                    if (boxRef.current) {
                        boxRef.current.playAnimation("OPEN");
                    }
                    setCountdownRemaining(0);
                    setShowCountdown(false);
                    setTimeout(() => {
                        setInserted(false);
                    }, 800);
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                        setCountdownInterval(null);
                    }
                })
                .catch((error) => {
                    console.error("Error cancelling email:", error);
                });
        } else {
            console.error("No resend email ID available to cancel");
        }
    };

    const handleSendNow = useCallback(
        (e) => {
            e.preventDefault();
            setCountdownRemaining(0);
            setShowCountdown(false);
            if (countdownInterval) {
                clearInterval(countdownInterval);
                setCountdownInterval(null);
            }
            const postcardData = {
                name: nameValue,
                location: locationValue,
                message: messageValue,
                imageUrl: `${
                    import.meta.env.VITE_FRONTENDURL
                }/${imageNumber}.jpg`,
            };
            if (resendEmailId) {
                cancelSendEmail({ resendEmailId })
                    .then(() => {
                        mutationWithAttachment.mutate(postcardData);
                    })
                    .catch((error) => {
                        console.error(
                            "Error cancelling scheduled email:",
                            error
                        );
                    })
                    .finally(() => {
                        setResendEmailId(null);
                        resetForm();
                        setInserted(false);
                    });
            } else {
                console.warn("No scheduled email ID to cancel");
                mutationWithAttachment.mutate(postcardData);
                resetForm();
                setInserted(false);
            }
        },
        [
            nameValue,
            locationValue,
            messageValue,
            imageNumber,
            mutationWithAttachment,
            resetForm,
            countdownInterval,
            resendEmailId,
        ]
    );

    return (
        <div className={styles.canvas}>
            <Canvas
                camera={{
                    position: [-0.0, 1.594, 1.044],
                    fov: 35,
                }}
                gl={{
                    toneMapping: ACESFilmicToneMapping,
                    antialias: false,
                    powerPreference: "high-performance",
                }}
                dpr={[1, 2]}
                performance={{ min: 0.8 }}
            >
                <OrbitControls
                    ref={controlsRef}
                    target={[0, 1.4, -1]}
                    enablePan={false}
                    enableZoom={false}
                    enableRotate={false}
                />
                <ambientLight intensity={0.2} color="#f0f0f0" />
                <directionalLight
                    position={[5, 8, 5]}
                    intensity={1.2}
                    color="#ffe9c5"
                    castShadow
                    shadow-mapSize-width={512}
                    shadow-mapSize-height={512}
                />
                <directionalLight
                    position={[-5, 5, 3]}
                    intensity={0.5}
                    color="#cfe7ff"
                />
                <directionalLight
                    position={[0, 4, -6]}
                    intensity={0.3}
                    color="#ffffff"
                />
                <hemisphereLight
                    skyColor="#87ceeb"
                    groundColor="#8b7355"
                    intensity={0.4}
                />
                <SoftShadows
                    frustum={3.75}
                    size={0.005}
                    near={9.5}
                    samples={8}
                    rings={6}
                />
                <ContactShadows
                    position={[0, -1, 0]}
                    opacity={0.3}
                    width={8}
                    height={8}
                    blur={1.5}
                    far={4}
                />
                <EffectComposer multisampling={0}>
                    <Bloom
                        luminanceThreshold={0.3}
                        luminanceSmoothing={0.8}
                        height={200}
                    />
                    <Noise opacity={0.01} />
                    <Vignette eskil={false} offset={0.2} darkness={0.3} />
                </EffectComposer>
                <Box ref={boxRef} position={[0, 0, 0]} />
                <animated.group position={position} rotation={rotation}>
                    <mesh>
                        <boxGeometry args={responsiveDimensions.boxGeometry} />
                        <meshPhysicalMaterial
                            transparent
                            opacity={0.001}
                            side={DoubleSide}
                            color="#141414"
                        />
                    </mesh>
                    <Html
                        transform
                        position={responsiveDimensions.frontPosition} // front side, slightly in front of mesh
                        rotation={[0, 0, 0]}
                        scale={responsiveDimensions.scale}
                        distanceFactor={0.5}
                        occlude
                        className={styles.html}
                        style={{
                            pointerEvents: flipped ? "none" : "auto",
                            display: flipped ? "none" : "block",
                        }}
                        material={
                            <meshPhysicalMaterial
                                side={DoubleSide}
                                opacity={0.1}
                                transparent
                                color="#141414"
                            />
                        }
                    >
                        <div className={styles.frontSide}>
                            <Suspense fallback={<PostcardLoading />}>
                                <Postcard
                                    nameValue={nameValue}
                                    setNameValue={setNameValue}
                                    locationValue={locationValue}
                                    setLocationValue={setLocationValue}
                                    messageValue={messageValue}
                                    setMessageValue={setMessageValue}
                                    submissionStatus={submissionStatus}
                                    setSubmissionStatus={setSubmissionStatus}
                                    handleSubmit={handleSubmitPostcard}
                                    mutation={mutation}
                                    statuses={STATUSES}
                                />
                                <FlipButton handleFlip={handleFlip} />
                            </Suspense>
                        </div>
                    </Html>
                    <Html
                        transform
                        position={responsiveDimensions.backPosition} // back side, behind mesh and offset
                        rotation={[0, Math.PI, 0]} // rotated 180 degrees so content faces forward when group flips
                        scale={responsiveDimensions.scale}
                        distanceFactor={0.5}
                        occlude
                        center
                        className={styles.html}
                        style={{
                            pointerEvents: flipped ? "auto" : "none",
                            display: !flipped ? "none" : "block",
                        }}
                        material={
                            <meshPhysicalMaterial
                                side={DoubleSide}
                                opacity={0.1}
                                transparent
                                color="white"
                            />
                        }
                    >
                        <div className={styles.backSide}>
                            <Suspense fallback={<PostcardLoading />}>
                                <img
                                    src={`/${imageNumber}.jpg`}
                                    alt="Postcard back"
                                />
                                <FlipButton handleFlip={handleFlip} />
                            </Suspense>
                        </div>
                    </Html>
                </animated.group>
                {showCountdown && (
                    <Html position={[0, 1.594, 0.5]} center>
                        <Countdown
                            countdownRemaining={countdownRemaining}
                            cancelSend={cancelSend}
                            sendNow={handleSendNow}
                            resendResponse={
                                submissionStatus === STATUSES.submitted
                                    ? "200"
                                    : null
                            }
                            setShowCountdown={setShowCountdown}
                        />
                    </Html>
                )}
            </Canvas>
            {import.meta.env.MODE === "development" && (
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
                        onClick={() => toggleFlag()}
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
                        Toggle flag
                    </button>
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
                        Animate into mailbox
                    </button>
                    <button
                        onClick={() => startCountdown(15)}
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
                        Countdown from 15
                    </button>
                </div>
            )}
        </div>
    );
}
