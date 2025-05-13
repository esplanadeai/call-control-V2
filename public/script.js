const serverUrl = "http://localhost:8080"; // Base URL of your backend server
const sampleRate = 16000; // Hz
let audioContext = null;
let ws = null;

async function startAudio(listenUrl) {
    if (ws) {
        console.warn("Audio is already playing.");
        return;
    }

    try {
        
        // Step 1: Create an AudioContext with the server's sample rate
        audioContext = new AudioContext({ sampleRate });
        console.log("AudioContext created with sample rate:", sampleRate);

        // Step 2: Load the audioProcessor.js module
        await audioContext.audioWorklet.addModule('./audioProcessor.js');
        console.log("AudioProcessor module loaded.");

        // Step 3: Create the AudioWorkletNode and connect it to the destination
        const audioNode = new AudioWorkletNode(audioContext, 'audio-processor', {
            outputChannelCount: [2], // Stereo: 2 output channels
        });
        audioNode.connect(audioContext.destination);
        
        console.log("AudioWorkletNode connected to destination.");

        // Step 4: Set up the WebSocket connection to receive audio data
        ws = new WebSocket(listenUrl);
        ws.binaryType = 'arraybuffer';

        ws.onopen = () => {
            console.log("WebSocket connection opened.");
        };

        ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                const int16Array = new Int16Array(event.data);
                const float32Array = new Float32Array(int16Array.length);

                // Convert 16-bit PCM to Float32 [-1.0, 1.0]
                for (let i = 0; i < int16Array.length; i++) {
                    float32Array[i] = int16Array[i] / 32768.0;
                }

                // Send the Float32 audio data to the AudioWorkletProcessor
                audioNode.port.postMessage({ audioData: float32Array });
            } else {
                console.log("Non-audio message received:", event.data);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed.");
            stopAudio();
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            stopAudio();
        };

    } catch (error) {
        console.error("Error starting audio:", error);
        stopAudio();
    }
}

async function stopAudio() {
    console.log("Stopping audio.");
    if (audioContext) {
        await audioContext.close();
        audioContext = null;
    }
    if (ws) {
        ws.close();
        ws = null;
    }
}

// Handle form submission to initiate a call
document.getElementById("callForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const phoneNumber = document.getElementById("phoneNumber").value;
    const customerName = document.getElementById("customerName").value;

    try {
        const response = await fetch(`${serverUrl}/initiate-call`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber, customerName }),
        });

        const data = await response.json();

        if (data.success) {
            const listenUrl = data.listenUrl;

            document.getElementById("listenUrl").innerText = listenUrl;
            document.getElementById("liveListening").style.display = "block";
            document.getElementById("callControls").style.display = "block";

            document.getElementById("startListening").onclick = () => startAudio(listenUrl);
            document.getElementById("stopListening").onclick = stopAudio;

            // Advanced call controls
            document.getElementById("sendSay").onclick = () => sendSay(listenUrl);
            document.getElementById("sendAddMessage").onclick = () => sendAddMessage(listenUrl);
            document.getElementById("muteAssistant").onclick = () => sendAssistantControl(listenUrl, "mute-assistant");
            document.getElementById("unmuteAssistant").onclick = () => sendAssistantControl(listenUrl, "unmute-assistant");
            document.getElementById("sayFirstMessage").onclick = () => sendAssistantControl(listenUrl, "say-first-message");
            document.getElementById("endCall").onclick = () => sendEndCall(listenUrl);

            alert("Call answered! Listen URL is ready.");
        } else {
            alert("Error initiating call: " + data.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while initiating the call.");
    }
});

// Send control messages to the server
async function sendControl(listenUrl) {
    const type = document.getElementById("controlType").value;
    const value = document.getElementById("controlMessage").value;

    // Derive the control URL from the listen URL
    const controlUrl = listenUrl.replace("/listen", "/control").replace("wss://", "https://");
    console.log("Derived controlUrl:", controlUrl); // Debugging log

    try {
        const response = await fetch(`${serverUrl}/control-call`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ controlUrl, type, value }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Control message sent successfully.");
        } else {
            alert("Failed to send control message: " + data.error);
        }
    } catch (error) {
        console.error("Error sending control message:", error);
        alert("An error occurred while sending the control message.");
    }
}

function getControlUrl(listenUrl) {
    return listenUrl.replace("/listen", "/control").replace("wss://", "https://");
}

async function sendSay(listenUrl) {
    const content = document.getElementById("sayMessage").value;
    await sendControlRequest(listenUrl, { type: "say", content });
}

async function sendAddMessage(listenUrl) {
    const content = document.getElementById("addMessageContent").value;
    const role = document.getElementById("addMessageRole").value;
    await sendControlRequest(listenUrl, {
        type: "add-message",
        message: { role, content },
        triggerResponseEnabled: true
    });
}

async function sendAssistantControl(listenUrl, controlType) {
    await sendControlRequest(listenUrl, { type: "control", control: controlType });
}

async function sendEndCall(listenUrl) {
    await sendControlRequest(listenUrl, { type: "end-call" });
}

async function sendControlRequest(listenUrl, payload) {
    const controlUrl = getControlUrl(listenUrl);
    try {
        const response = await fetch(`${serverUrl}/control-call`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ controlUrl, ...payload }),
        });
        const data = await response.json();
        if (data.success) {
            alert("Control message sent successfully.");
        } else {
            alert("Failed to send control message: " + data.error);
        }
    } catch (error) {
        console.error("Error sending control message:", error);
        alert("An error occurred while sending the control message.");
    }
}