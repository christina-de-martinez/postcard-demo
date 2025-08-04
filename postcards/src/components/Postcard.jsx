import { useEffect, useState, useCallback } from "react";
import styles from "./Postcard.module.css";
import Stamp from "./Stamp";

function Postcard({
    nameValue,
    setNameValue,
    locationValue,
    setLocationValue,
    messageValue,
    setMessageValue,
    submissionStatus,
    setSubmissionStatus,
    handleSubmit,
    mutation,
}) {
    const maxTextFieldLength = 22;
    const minNameLength = 1;
    const minLocationLength = 2;
    const minTextAreaLength = 2;
    const maxTextAreaLength = 320;

    const [canSubmit, setCanSubmit] = useState(false);

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

    const handleSubmitPostcard = useCallback(
        (e) => {
            e.preventDefault();
            if (canSubmit) {
                handleSubmit(e);
            } else {
                console.error(
                    "Form cannot be submitted due to validation errors"
                );
            }
        },
        [canSubmit, handleSubmit]
    );

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

    useEffect(() => {
        if (submissionStatus) {
            const timer = setTimeout(() => {
                setSubmissionStatus(null);
            }, 14600);
            return () => clearTimeout(timer);
        }
    }, [submissionStatus, setSubmissionStatus]);

    return (
        <div className={styles.postcard}>
            <form onSubmit={handleSubmitPostcard}>
                <div className={styles.stampPlacer}>
                    <Stamp />
                </div>
                <div className={styles.mainForm}>
                    <textarea
                        name="message"
                        value={messageValue}
                        onChange={handleMessageChange}
                        autoFocus
                    ></textarea>
                    <div className={styles.errorMessageTextArea}>
                        {messageValue.length < minTextAreaLength && (
                            <span>Please type a message</span>
                        )}
                        {messageValue.length > maxTextAreaLength - 10 && (
                            <span
                                className={
                                    messageValue.length > maxTextAreaLength
                                        ? ""
                                        : styles.warning
                                }
                            >
                                {messageValue.length}/{maxTextAreaLength}
                            </span>
                        )}
                    </div>
                    <div className={styles.rightSide}>
                        <div className={styles.inputsContainer}>
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
                                    {locationValue.length <
                                        minLocationLength && (
                                        <span>
                                            Please fill out your location
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button
                                type="submit"
                                disabled={!canSubmit || mutation.isPending}
                                style={{
                                    cursor:
                                        !canSubmit || mutation.isPending
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Postcard;
