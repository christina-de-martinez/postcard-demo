import { useEffect, useState } from "react";
import SVGIcon from "../assets/resend-icon-white.svg?react";
import styles from "./Postcard.module.css";

function Postcard({ imageNumber = 1, onPostcardSubmitted }) {
    const maxTextFieldLength = 50;
    const minNameLength = 1;
    const minLocationLength = 2;
    const minTextAreaLength = 2;
    const maxTextAreaLength = 500;

    const defaultValues = {
        name: "Your name",
        location: "Your location",
        message: "Your message",
    };

    const [nameValue, setNameValue] = useState(defaultValues.name);
    const [locationValue, setLocationValue] = useState(defaultValues.location);
    const [messageValue, setMessageValue] = useState(defaultValues.message);
    const [canSubmit, setCanSubmit] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const STATUSES = {
        submitted: "submitted",
        error: "error",
    };

    useEffect(() => {
        setCanSubmit(
            nameValue.length > minNameLength &&
                nameValue.length < maxTextFieldLength &&
                locationValue.length > minLocationLength &&
                locationValue.length < maxTextFieldLength &&
                messageValue.length > minTextAreaLength &&
                messageValue.length < maxTextAreaLength
        );
    }, [nameValue, locationValue, messageValue]);

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxTextFieldLength) {
            setNameValue(value);
        }
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxTextFieldLength) {
            setLocationValue(value);
        }
    };

    const handleMessageChange = (e) => {
        const value = e.target.value;
        if (value.length <= maxTextAreaLength) {
            e.target.value = value;
        } else {
            e.target.value = value.slice(0, maxTextAreaLength);
        }
        setMessageValue(value);
    };

    const resetForm = () => {
        setNameValue(defaultValues.name);
        setLocationValue(defaultValues.location);
        setMessageValue(defaultValues.message);
    };

    const submitPostcard = (e) => {
        e.preventDefault();
        if (!canSubmit) {
            console.error(
                "Validation error: Please fill out all fields correctly."
            );
            return;
        }

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
            .then((data) => {
                console.log("Postcard created successfully:", data);
                setSubmissionStatus(STATUSES.submitted);
                e.target.reset();
                resetForm();
                // Call the callback to refetch postcards
                if (onPostcardSubmitted) {
                    onPostcardSubmitted();
                }
            })
            .catch((error) => {
                console.error("Error creating postcard:", error);
                setSubmissionStatus(STATUSES.error);
            });
    };

    useEffect(() => {
        if (submissionStatus) {
            const timer = setTimeout(() => {
                setSubmissionStatus(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [submissionStatus]);

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
                        value={messageValue}
                        onChange={handleMessageChange}
                    ></textarea>
                    <div className={styles.errorMessageTextArea}>
                        {messageValue.length < minTextAreaLength && (
                            <span>Please type a message</span>
                        )}
                    </div>
                    <div className={styles.rightSide}>
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={nameValue}
                                onChange={handleNameChange}
                            ></input>
                            <div className={styles.errorMessage}>
                                {nameValue.length < minNameLength && (
                                    <span>Please fill out your name</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="location"
                                value={locationValue}
                                onChange={handleLocationChange}
                            ></input>
                            <div className={styles.errorMessage}>
                                {locationValue.length < minLocationLength && (
                                    <span>Please fill out your location</span>
                                )}
                            </div>
                        </div>
                        <button type="submit" disabled={!canSubmit}>
                            Send
                        </button>
                    </div>
                </div>
            </form>
            <div className={styles.submittedOrError}>
                {submissionStatus === STATUSES.submitted && (
                    <span className={styles.successMessage}>
                        Thanks for your postcard!
                    </span>
                )}
                {submissionStatus === STATUSES.error && (
                    <span className={styles.errorMessage}>
                        Oops! Something went wrong. Please try again.
                    </span>
                )}
            </div>
        </div>
    );
}

export default Postcard;
