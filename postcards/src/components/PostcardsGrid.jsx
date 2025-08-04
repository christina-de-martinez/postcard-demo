import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { fetchPostcards } from "../services/api";
import styles from "./PostcardsGrid.module.css";
import Stamp from "./Stamp";

const PostcardsGrid = memo(function PostcardsGrid() {
    const query = useQuery({
        queryKey: ["postcards"],
        queryFn: fetchPostcards,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    if (query.isLoading) {
        return (
            <div className={styles.errorOrLoadingContainer}>
                <p className={styles.loading}>Loading...</p>
            </div>
        );
    }
    if (query.isError) {
        return (
            <div className={styles.errorOrLoadingContainer}>
                <div className={styles.error}>
                    <h2>Error loading postcards</h2>
                    <p>Try again later</p>
                </div>
            </div>
        );
    }
    if (query.data.length === 0) {
        return (
            <div className={styles.errorOrLoadingContainer}>
                <div className={styles.empty}>
                    <h2>No postcards yet</h2>
                    <p>Submit one to see it here</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.postcardsGrid}>
            {query.data?.map((postcard) => (
                <div className={styles.cardContainer} key={postcard._id}>
                    <div className={styles.card}>
                        <div className={styles.front}>
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
                        <div className={styles.back}>
                            <img src={postcard.imageUrl} alt="Postcard" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default PostcardsGrid;
