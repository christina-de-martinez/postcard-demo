import SVGIcon from "../assets/resend-icon-white.svg?react";
import styles from "./Postcard.module.css";

function Postcard({ imageNumber = 1 }) {
    const submitPostcard = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const postcardData = {
            name: formData.get("name") || "Your name",
            location: formData.get("location") || "Your location",
            message: formData.get("message") || "Your message",
            imageUrl: `https://postcard-demo.vercel.app/${imageNumber}.jpg`,
        };

        fetch(`${import.meta.env.VITE_BASEURL}/api/v1/postcards/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postcardData),
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error creating postcard:", error);
            });
    };

    return (
        <div className={styles.postcard}>
            <form onSubmit={submitPostcard}>
                <div className={styles.stampPlacer}>
                    <div className={styles.stamp}>
                        <div className={styles.stampImage}>
                            <SVGIcon />
                        </div>
                    </div>
                </div>
                <div className={styles.mainForm}>
                    <textarea
                        name="message"
                        defaultValue="Your message"
                    ></textarea>
                    <div className={styles.rightSide}>
                        <div>
                            <input
                                type="text"
                                name="name"
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
                        <button type="submit">Send</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Postcard;
