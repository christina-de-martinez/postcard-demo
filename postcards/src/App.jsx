import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { queryClient } from "./lib/queryClient";
import PostcardsGrid from "./components/PostcardsGrid";
import Mailbox from "./components/Mailbox";
import Postcard from "./components/Postcard";
import "./App.css";

function App() {
    // Ensure the imageNumber is stable between postcard flips
    const randomImageNumber = useMemo(
        () => Math.floor(Math.random() * 8) + 1,
        []
    );
    const minWindowWidthFor3D = 500;

    return (
        <QueryClientProvider client={queryClient}>
            {window.innerWidth > minWindowWidthFor3D ? (
                <Mailbox imageNumber={randomImageNumber} />
            ) : (
                <Postcard
                    imageNumber={randomImageNumber}
                    playAnimations={false}
                />
            )}
            <PostcardsGrid />
        </QueryClientProvider>
    );
}

export default App;
