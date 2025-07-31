import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import Postcard from "./Postcard";

function PostcardWithProvider({ imageNumber, playAnimations }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Postcard
                imageNumber={imageNumber}
                playAnimations={playAnimations}
            />
        </QueryClientProvider>
    );
}

export default PostcardWithProvider;
