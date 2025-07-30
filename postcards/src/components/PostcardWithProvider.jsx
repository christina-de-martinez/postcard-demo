import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import Postcard from "./Postcard";

function PostcardWithProvider({ imageNumber }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Postcard imageNumber={imageNumber} />
        </QueryClientProvider>
    );
}

export default PostcardWithProvider;
