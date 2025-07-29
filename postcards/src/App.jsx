import Postcard from "./components/Postcard";
import "./App.css";
import PostcardsGrid from "./components/PostcardsGrid";
import Mailbox from "./components/Mailbox";
import { useState, useCallback } from "react";

function App() {
    // Ensure the imageNumber is stable between postcard flips
    const randomImageNumber = Math.floor(Math.random() * 8) + 1;
    
    // State to trigger re-fetch of postcards
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    const handlePostcardSubmitted = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);
    
    return (
        <>
            <Mailbox 
                imageNumber={randomImageNumber} 
                onPostcardSubmitted={handlePostcardSubmitted}
            />
            <PostcardsGrid refreshTrigger={refreshTrigger} />
        </>
    );
}

export default App;
