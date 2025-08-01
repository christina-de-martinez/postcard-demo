function Countdown({ countdownRemaining, cancelSend }) {
    return (
        <div>
            {countdownRemaining} <button onClick={cancelSend}>Cancel</button>
        </div>
    );
}

export default Countdown;
