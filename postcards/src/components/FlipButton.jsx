import { memo } from "react";
import styles from "./FlipButton.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

const FlipButton = memo(function FlipButton({ handleFlip }) {
    return (
        <button className={styles.flipButton} onClick={handleFlip}>
            <FontAwesomeIcon icon={faArrowsRotate} />
        </button>
    );
});

export default FlipButton;
