# API Live Call Control Framework

This project demonstrates the use of VAPI's live call control features to monitor and interact with ongoing calls in real time. The framework enables users to listen to live calls and inject prompts or commands to the assistant without interrupting the call flow. For the #BuildWithVapi challenge, additional features and UI were implemented, including: Say Message, Add Message to Conversation, Assistant Control (mute/unmute, say first message), and End Call.

The implementation leverages browser-based audio processing (using AudioWorkletProcessor) for streaming and playback. The call control interface allows for dynamic message injection, assistant muting, and call termination, making it suitable for both experimentation (e.g., testing assistant behaviors, rapid iteration) and creative use cases (such as orchestrating or modifying live call interactions with friends or test users).

This setup was built to provide a practical environment for developing, debugging, and iterating on VAPI-powered assistants, as well as exploring the boundaries of real-time telephony control in a web context. The creative aspect lies in exposing granular, real-time control of live calls—such as dynamic message injection, assistant muting, and call termination—through an intuitive, browser-based interface.


## ⚠️ Disclaimer
This project is for **educational and internal use only**. Monitoring or recording calls without explicit or implied consent from both parties is illegal. Ensure you adhere to all legal and ethical standards when using this tool.

---

## Features
- **Live Call Monitoring**: Listen to ongoing calls in real time using WebSocket audio streaming.
- **Call Control**: Inject messages or commands to guide agents during live calls.
- **Audio Playback**: Low-latency audio processing in a browser environment using `AudioWorkletProcessor`.
- **Interactive Web Interface**: A simple webpage to facilitate monitoring and call control.

---

## Getting Started

Follow these steps to set up and run the project:

### 1. Clone the Repository
```bash
git clone https://github.com/esplanadeai/call-control-V2.git
```

### 2. Navigate to the Project Directory
```bash
cd your-project-folder
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure the Project
Create a `src/config.js` file and input your **VAPI API key**, **phone number ID** and **assistant ID**:

```javascript
module.exports = {
  apiKey: "your-vapi-api-key",
  phoneNumberId: "your-vapi-phone-number-id",
  assistantId: "your-vapi-assistant-id",
  apiBaseUrl: "https://api.vapi.ai",
};
```

### 5. Configure the Server
In `src/server.js`, specify the server port. By default, it runs locally on port 8080:

```javascript
const port = 8080;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
```

### 6. Run the Server
```bash
node src/server.js
```

---

## Usage
- Open your browser and navigate to `http://localhost:8080`.
- Use the web interface to initiate, monitor, and control live calls.

![1](https://github.com/user-attachments/assets/b87bacb2-96bc-4fa6-b9d4-3668f502c919)

- Input fields Number + Customer Name-
- When a call is answered by the distination the listen URL is available - hit OK.

![2](https://github.com/user-attachments/assets/a3736624-8a12-4004-adb4-b971972245af)

- Enjoy the call control features and prank your friends or use for voice agent debugging and testing.

![3](https://github.com/user-attachments/assets/edb75c18-cd2d-46b7-bdb9-4c0098b5de99)


---

## License
This project was built for #BuildWithVapi and for educational purposes only. See the Disclaimer above for legal and ethical use.
