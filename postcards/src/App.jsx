import Postcard from "./components/Postcard";
import "./App.css";
import PostcardsGrid from "./components/PostcardsGrid";
import Mailbox from "./components/Mailbox";

function App() {
    return (
        <>
            <Mailbox />
            <Postcard />
            <PostcardsGrid />
        </>
    );
}

export default App;
