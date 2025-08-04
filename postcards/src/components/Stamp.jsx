import { memo } from "react";
import SVGIcon from "../assets/resend-icon-white.svg?react";
import styles from "./Stamp.module.css";

const Stamp = memo(function Stamp({ smaller = false }) {
    return (
        <div className={`${styles.stamp} ${smaller ? styles.smaller : ""}`}>
            <div className={styles.stampImage}>
                <SVGIcon />
            </div>
        </div>
    );
});

export default Stamp;
