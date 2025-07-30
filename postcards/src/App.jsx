import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import PostcardsGrid from "./components/PostcardsGrid";
import Mailbox from "./components/Mailbox";
import "./App.css";

function App() {
    // Ensure the imageNumber is stable between postcard flips
    const randomImageNumber = Math.floor(Math.random() * 8) + 1;

    return (
        <QueryClientProvider client={queryClient}>
            <Mailbox imageNumber={randomImageNumber} />
            <PostcardsGrid />
        </QueryClientProvider>
    );
}

export default App;
