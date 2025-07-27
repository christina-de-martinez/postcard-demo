import { useState, useEffect } from "react";
import styles from "./PostcardsGrid.module.css";

function PostcardsGrid() {
    const [postcards, setPostcards] = useState([]);
    // todo: add react query
    // todo: error/loading states
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASEURL}/api/v1/postcards`)
            .then((response) => response.json())
            .then((data) => {
                setPostcards(data);
            })
            .catch((error) => {
                console.error("Error fetching postcards:", error);
            });
    }, []);
    return (
        <div className={styles.postcardsGrid}>
            {postcards &&
                postcards?.map((postcard) => (
                    <div key={postcard._id} className={styles.card}>
                        <h3>{postcard.name}</h3>
                        <p>{postcard.location}</p>
                        <p>{postcard.message}</p>
                        <img src={postcard.imageUrl} alt="Postcard" />
                    </div>
                ))}
        </div>
    );
}

export default PostcardsGrid;
