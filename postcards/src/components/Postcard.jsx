import SVGIcon from "../assets/resend-icon-white.svg?react";
import styles from "./Postcard.module.css";

function Postcard() {
    return (
        <div className={styles.postcard}>
            <div className={styles.stampPlacer}>
                <div className={styles.stamp}>
                    <div className={styles.stampImage}>
                        <SVGIcon />
                    </div>
                </div>
            </div>
            <form>
                <textarea defaultValue="Your message"></textarea>
                <div className={styles.rightSide}>
                    <div>
                        <input
                            type="text"
                            name="Your name"
                            defaultValue="Your name"
                        ></input>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="location"
                            defaultValue="Your location"
                        ></input>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Postcard;
