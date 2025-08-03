import { useQuery } from "@tanstack/react-query";
import { fetchPostcards } from "../services/api";
import styles from "./PostcardsGrid.module.css";
import Stamp from "./Stamp";

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
                            <div className={styles.leftSide}>
                                <p>{postcard.message}</p>
                            </div>
                            <div className={styles.rightSide}>
                                <div className={styles.fromFields}>
                                    <h2>{postcard.name}</h2>
                                    <p>{postcard.location}</p>
                                </div>
                                <div className={styles.gridStampPlacer}>
                                    <Stamp smaller={true} />
                                </div>
                            </div>
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
