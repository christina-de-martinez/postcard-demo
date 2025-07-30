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
                <div class={styles.cardContainer} key={postcard._id}>
                    <div class={styles.card}>
                        <div class={styles.front}>
                            <h3>{postcard.name}</h3>
                            <p>{postcard.location}</p>
                            <p>{postcard.message}</p>
                        </div>
                        <div class={styles.back}>
                            <img src={postcard.imageUrl} alt="Postcard" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PostcardsGrid;
