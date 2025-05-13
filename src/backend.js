const axios = require("axios");
const { apiKey, phoneNumberId, assistantId, apiBaseUrl } = require("./config");

async function pollCallStatus(callId) {
  const maxRetries = 30; 
  const delay = 2000; 

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(`${apiBaseUrl}/call/${callId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const callData = response.data;
      console.log(`Polling attempt ${i + 1}: Status - ${callData.status}`);

      if (callData.status === "in-progress" && callData.monitor && callData.monitor.listenUrl) {
        console.log("Listen URL available:", callData.monitor.listenUrl);
        return callData.monitor.listenUrl;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      console.error("Error polling call status:", error.response?.data || error.message);
    }
  }

  throw new Error("Listen URL not available after polling.");
}

async function initiateCall(phoneNumber, customerName) {
  try {
    const payload = {
      phoneNumberId,
      customer: {
        number: phoneNumber,
        name: customerName || "Unknown",
      },
      assistantId,
    };

    console.log("Payload being sent to Vapi:", JSON.stringify(payload, null, 2));

    const response = await axios.post(`${apiBaseUrl}/call`, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const callId = response.data.id;
    console.log("Call initiated. Call ID:", callId);

    const listenUrl = await pollCallStatus(callId);
    return listenUrl;
  } catch (error) {
    console.error("Error initiating call:", error.response?.data || error.message);
    throw error;
  }
}

// Accepts controlUrl and a payload object (spread all other properties)
async function controlCall(controlUrl, payload) {
  try {
    const response = await axios.post(controlUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Message injected successfully:", response.data);
  } catch (error) {
    console.error("Error controlling call:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { initiateCall, controlCall };