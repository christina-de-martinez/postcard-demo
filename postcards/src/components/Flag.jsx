// eslint-disable-next-line no-unused-vars
import { useSpring, a } from "@react-spring/three";
import { memo } from "react";

const Flag = memo(function Flag({ isUp, geometry, material }) {
    const { rotation } = useSpring({
        rotation: isUp ? [0, 0, 0] : [-Math.PI / 2, 0, 0],
        config: {
            mass: 1,
            tension: 170,
            friction: 26,
        },
    });

    return (
        <a.mesh
            name="Flag003"
            castShadow
            receiveShadow
            geometry={geometry}
            material={material}
            position={[0.092, -0.401, 0.275]}
            rotation={rotation}
        />
    );
});

export default Flag;
