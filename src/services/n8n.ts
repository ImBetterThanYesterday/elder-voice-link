/**
 * N8N service
 * Handles communication with the N8N endpoint
 */

export const sendToN8N = async (text: string, elderId: string = "47c53ec8-de0c-4c8d-b97f-18608e7c4abe"): Promise<string> => {
  try {
    const response = await fetch(
      "https://n8n-pc98.onrender.com/webhook/76c09305-9123-4cfb-831e-4bceaa51a561",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: text,
          elderId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`N8N processing failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.output || "Sorry, I couldn't process your request.";
  } catch (error) {
    console.error("N8N processing error:", error);
    throw error;
  }
};
