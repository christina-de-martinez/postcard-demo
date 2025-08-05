// backend for frontend API, which will allow me to use react query to invalidate cache

export const fetchPostcards = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/api/v1/postcards`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch postcards");
    }
    return response.json();
};

export const cancelSendEmail = async ({ resendEmailId }) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BASEURL}/api/v1/postcards/cancelEmail`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: resendEmailId }),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to cancel email: ${response.status} ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error cancelling email:", error);
        throw error;
    }
};

export const submitPostcard = async (postcardData) => {
    const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/api/v1/postcards/create`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postcardData),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to submit postcard");
    }

    return response.json();
};

export const sendEmailWithAttachment = async (postcardData) => {
    const response = await fetch(
        `${import.meta.env.VITE_BASEURL}/api/v1/postcards/sendWithAttachment`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postcardData),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to send email with attachment");
    }

    return response.json();
};
