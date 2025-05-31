import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Square, Headphones } from 'lucide-react';

const LiveListening = ({ callData }) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const audioContextRef = useRef(null);
  const wsRef = useRef(null);

  const startAudio = async () => {
    if (wsRef.current) {
      console.warn("Audio is already playing.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const sampleRate = 16000;
      
      // Create AudioContext
      audioContextRef.current = new AudioContext({ sampleRate });
      console.log("AudioContext created with sample rate:", sampleRate);

      // Load the audioProcessor module
      await audioContextRef.current.audioWorklet.addModule('/audioProcessor.js');
      console.log("AudioProcessor module loaded.");

      // Create AudioWorkletNode
      const audioNode = new AudioWorkletNode(audioContextRef.current, 'audio-processor', {
        outputChannelCount: [2], // Stereo
      });
      audioNode.connect(audioContextRef.current.destination);

      // Set up WebSocket connection
      wsRef.current = new WebSocket(callData.listenUrl);
      wsRef.current.binaryType = 'arraybuffer';

      wsRef.current.onopen = () => {
        console.log("WebSocket connection opened.");
        setIsListening(true);
        setIsLoading(false);
      };

      wsRef.current.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          const int16Array = new Int16Array(event.data);
          const float32Array = new Float32Array(int16Array.length);

          // Convert 16-bit PCM to Float32 [-1.0, 1.0]
          for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
          }

          // Send audio data to AudioWorkletProcessor
          audioNode.port.postMessage({ audioData: float32Array });
        } else {
          console.log("Non-audio message received:", event.data);
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed.");
        stopAudio();
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection failed");
        stopAudio();
      };

    } catch (err) {
      console.error("Error starting audio:", err);
      setError("Failed to start audio: " + err.message);
      setIsLoading(false);
      stopAudio();
    }
  };

  const stopAudio = async () => {
    console.log("Stopping audio.");
    
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsListening(false);
    setIsLoading(false);
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <h2 className="card-title">
          <Headphones className="inline-icon" />
          Live Listening
        </h2>
        <p className="card-subtitle">
          {isListening ? 'Audio streaming active' : 'Start listening to the call'}
        </p>
      </div>

      {/* Status Display */}
      <div className="status-section">
        <div className={`status-indicator ${isListening ? 'status-active' : 'status-inactive'}`}>
          {isListening ? (
            <>
              <Volume2 size={16} className="inline-icon" />
              <div className="pulse-dot"></div>
              Listening
            </>
          ) : (
            <>
              <VolumeX size={16} className="inline-icon" />
              Not Listening
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-message"
        >
          {error}
        </motion.div>
      )}

      {/* Audio Controls */}
      <div className="audio-controls">
        {!isListening ? (
          <motion.button
            onClick={startAudio}
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Connecting...
              </>
            ) : (
              <>
                <Play size={16} className="inline-icon" />
                Start Listening
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            onClick={stopAudio}
            className="btn btn-danger"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Square size={16} className="inline-icon" />
            Stop Listening
          </motion.button>
        )}
      </div>

      {/* Audio Visualization */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="audio-visualization"
        >
          <div className="audio-bars">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="audio-bar"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: `${Math.random() * 40 + 20}px`
                }}
              ></div>
            ))}
          </div>
          <p className="visualization-text">Audio streaming...</p>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="instructions">
        <h4>Instructions:</h4>
        <ul>
          <li>Click "Start Listening" to hear the live call audio</li>
          <li>Make sure your speakers/headphones are connected</li>
          <li>Audio will stream in real-time from the call</li>
          <li>Click "Stop Listening" to disconnect</li>
        </ul>
      </div>
    </div>
  );
};

export default LiveListening; 