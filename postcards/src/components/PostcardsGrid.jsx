import { useState, useEffect } from "react";
import styles from "./PostcardsGrid.module.css";

function PostcardsGrid({ refreshTrigger }) {
    const [postcards, setPostcards] = useState([]);
    
    const fetchPostcards = () => {
        fetch(`${import.meta.env.VITE_BASEURL}/api/v1/postcards`)
            .then((response) => response.json())
            .then((data) => {
                setPostcards(data);
            })
            .catch((error) => {
                console.error("Error fetching postcards:", error);
            });
    };
    
    useEffect(() => {
        fetchPostcards();
    }, [refreshTrigger]); // Add refreshTrigger as dependency
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
