import Postcard from "./components/Postcard";
import "./App.css";
import PostcardsGrid from "./components/PostcardsGrid";
import Mailbox from "./components/Mailbox";

function App() {
    // Ensure the imageNumber is stable between postcard flips
    const randomImageNumber = Math.floor(Math.random() * 8) + 1;
    return (
        <>
            <Mailbox imageNumber={randomImageNumber} />
            <PostcardsGrid />
        </>
    );
}

export default App;
