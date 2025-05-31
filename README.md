# API Live Call Control Framework

This project demonstrates the use of VAPI live call control features to monitor and interact with ongoing calls in real time. The framework enables users to listen to live calls and inject prompts or commands to the assistant without interrupting the call flow. For the #BuildWithVapi challenge, additional features and UI were implemented, including: Say Message, Add Message to Conversation, Assistant Control (mute/unmute, say first message), Transfer Call, and End Call.

The implementation leverages browser-based audio processing (using AudioWorkletProcessor) for streaming and playback. The call control interface allows for dynamic message injection, assistant muting, call transfer, and call termination, making it suitable for both experimentation (e.g., testing assistant behaviors, rapid iteration) and creative use cases (such as orchestrating or modifying live call interactions with friends or test users).

This setup was built to provide a practical environment for developing, debugging, and iterating on VAPI-powered assistants, as well as exploring the boundaries of real-time telephony control in a web context. The creative aspect lies in exposing granular, real-time control of live calls—such as dynamic message injection, assistant muting, call transfer, and call termination—through an intuitive, modern React-based interface.

## ⚠️ Disclaimer
This project is for **educational and internal use only**. Monitoring or recording calls without explicit or implied consent from both parties is illegal. Ensure you adhere to all legal and ethical standards when using this tool.

---

## Features
- **Live Call Monitoring**: Listen to ongoing calls in real time using WebSocket audio streaming
- **Call Control**: Inject messages or commands to guide agents during live calls
- **Call Transfer**: Transfer active calls to different phone numbers with custom messages
- **Audio Playback**: Low-latency audio processing in a browser environment using `AudioWorkletProcessor`
- **Modern React Interface**: Component-based UI with glassmorphism design and BuildWithVapi branding
- **Real-time Status**: Live call status indicators with smooth animations

---

## Getting Started

Follow these steps to set up and run the project:

### 1. Clone the Repository
```bash
git clone https://github.com/esplanadeai/call-control-V2.git
```

### 2. Navigate to the Project Directory
```bash
cd call-control-V2
```

### 3. Install Dependencies
Install dependencies for both the server and client:

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 4. Configure the Project
Update `src/config.js` with your **VAPI API key**, **phone number ID** and **assistant ID**:

```javascript
module.exports = {
  apiKey: "your-vapi-api-key",
  phoneNumberId: "your-vapi-phone-number-id",
  assistantId: "your-vapi-assistant-id",
  apiBaseUrl: "https://api.vapi.ai",
};
```

### 5. Run the Application
```bash
# Development mode (runs both server and React app)
npm run dev

# Or run separately:
npm run server  # Backend on port 8080
npm run client  # React app on port 3000
```

### 6. Access the Application
- **React Frontend**: http://localhost:3000 (development)
- **Backend API**: http://localhost:8080
- **Production**: http://localhost:8080 (serves React build)

---

## Project Structure

```
BWV-CALL-CONTROL/
├── client/                 # React frontend
│   ├── public/
│   │   ├── audioProcessor.js
│   │   ├── volume-control.png
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.js
│   │   │   ├── CallForm.js
│   │   │   ├── CallControls.js
│   │   │   ├── LiveListening.js
│   │   │   └── Footer.js
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # Global styles
│   │   └── index.js       # React entry point
│   └── package.json
├── src/                   # Backend
│   ├── server.js         # Express server with integrated API functions
│   └── config.js         # Configuration
└── package.json          # Root package.json with dev scripts
```

---

## Usage
- Open your browser and navigate to `http://localhost:3000` (development) or `http://localhost:8080` (production)
- Use the modern React interface to initiate, monitor, and control live calls

![1](https://github.com/user-attachments/assets/9ecee28b-064e-456f-89e4-142c2b514cd5)

- Input phone number and customer name to initiate calls
- When a call is answered, the listen URL becomes available - and the control panel is displayed.

![2](https://github.com/user-attachments/assets/029b6d24-d6c9-42cf-be24-366b6db7d411)

- Use advanced call control features: Say Message, Add to Conversation, Transfer Call, Mute/Unmute, End Call

![3](https://github.com/user-attachments/assets/2162db28-38b2-45c4-9736-f61a77bd151b)

![4](https://github.com/user-attachments/assets/6dce99d0-bf64-4e43-bd5c-6aa23f67c80b)

---

## Technical Details

### Architecture

- **Frontend**: React 18 with modern hooks and component architecture
- **Backend**: Express.js server with integrated Vapi API functions
- **Audio Processing**: WebSocket streaming with AudioWorkletProcessor
- **Styling**: CSS with glassmorphism effects and BuildWithVapi branding
- **Development**: Concurrent server and client development with hot reload

### API Integration
- Integrated backend functions directly into `server.js`
- Real-time call status polling
- WebSocket audio streaming
- RESTful API endpoints for call control
- Enjoy the call control features and prank your friends or use for voice agent debugging and testing.

---

## License
This project was built for #BuildWithVapi and for educational purposes only. See the Disclaimer above for legal and ethical use.
