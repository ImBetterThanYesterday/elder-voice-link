/**
 * N8N service
 * Handles communication with the N8N endpoint
 */
import { endpoints } from "../utils/endpoints";

export const sendToN8N = async (
  text: string, 
  elderId: string = "1e77cf24-ec07-4308-91e3-990675e00399",
  webhookUrl?: string
): Promise<string> => {
  try {
    const response = await fetch(
      webhookUrl || endpoints.n8n.webhook,
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
