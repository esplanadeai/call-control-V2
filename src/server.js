const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const { apiKey, phoneNumberId, assistantId, apiBaseUrl } = require("./config");

const app = express();

// Configure CORS to allow requests from React dev server
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8080"],
  credentials: true
}));

app.use(express.json());

// Serve React build files in production, public folder in development
const isProduction = process.env.NODE_ENV === 'production';
const staticPath = isProduction 
  ? path.join(__dirname, "../client/build")
  : path.join(__dirname, "../public");

app.use(express.static(staticPath));

// Backend functions integrated into server.js
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
        return {
          listenUrl: callData.monitor.listenUrl,
          status: callData.status,
          callId: callId
        };
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

    const callData = await pollCallStatus(callId);
    return callData;
  } catch (error) {
    console.error("Error initiating call:", error.response?.data || error.message);
    throw error;
  }
}

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

// API Routes
app.post("/initiate-call", async (req, res) => {
  try {
    console.log("Received initiate-call request:", req.body);
    const callData = await initiateCall(req.body.phoneNumber, req.body.customerName);
    res.status(200).json({ success: true, ...callData });
  } catch (error) {
    console.error("Error initiating call:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/control-call", async (req, res) => {
  const { controlUrl, ...payload } = req.body;
  console.log("Received controlUrl:", controlUrl); 
  console.log("Payload:", payload); 

  try {
    await controlCall(controlUrl, payload);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error controlling call:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("*", (req, res) => {
  const indexPath = isProduction 
    ? path.join(__dirname, "../client/build/index.html")
    : path.join(__dirname, "../client/public/index.html");
  res.sendFile(indexPath);
});

const port = process.env.PORT || 8080; 
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));