const express = require("express");
const cors = require("cors");
const path = require("path");
const { initiateCall, controlCall } = require("./backend");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.post("/initiate-call", async (req, res) => {
  try {
    const listenUrl = await initiateCall(req.body.phoneNumber, req.body.customerName);
    res.status(200).json({ success: true, listenUrl });
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
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const port = 8080; 
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));