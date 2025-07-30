import { useQuery } from "@tanstack/react-query";
import { fetchPostcards } from "../services/api";
import styles from "./PostcardsGrid.module.css";

function PostcardsGrid() {
    const query = useQuery({
        queryKey: ["postcards"],
        queryFn: fetchPostcards,
    });

    return (
        <div className={styles.postcardsGrid}>
            {query.data?.map((postcard) => (
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
