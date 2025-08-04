import { memo } from "react";
import styles from "./Countdown.module.css";

const Countdown = memo(function Countdown({
    countdownRemaining,
    cancelSend,
    sendNow,
    resendResponse = null,
}) {
    const resendResponseMessage = resendResponse === "200" ? "Sent" : "Oops";
    const responseSubmessage = resendResponse !== "200" ? "Try again" : null;

    return (
        <div className={styles.countdown}>
            {countdownRemaining ? (
                <>
                    <p>{countdownRemaining}</p>
                    <div className={styles.cancelOrSendButtons}>
                        <button onClick={cancelSend}>Cancel email</button>
                        <button onClick={sendNow}>Send now</button>
                    </div>
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
});

export default Countdown;
