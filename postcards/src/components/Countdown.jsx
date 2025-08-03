import styles from "./Countdown.module.css";

function Countdown({ countdownRemaining, cancelSend, resendResponse = null }) {
    const resendResponseMessage = resendResponse === "200" ? "Sent" : "Whoops!";
    const responseSubmessage = resendResponse !== "200" ? "Try again." : null;

    return (
        <div className={styles.countdown}>
            {countdownRemaining ? (
                <>
                    <p>{countdownRemaining}</p>
                    <button onClick={cancelSend}>Cancel email</button>
                </>
            ) : (
                <div className={styles.responseContainer}>
                    <p className={styles.responseMessage}>
                        {resendResponseMessage}
                    </p>
                    {responseSubmessage && (
                        <p className={styles.responseSubmessage}>
                            {responseSubmessage}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Countdown;
