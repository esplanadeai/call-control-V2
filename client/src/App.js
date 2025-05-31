import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import CallForm from './components/CallForm';
import CallControls from './components/CallControls';
import LiveListening from './components/LiveListening';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [callData, setCallData] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);

  const handleCallInitiated = (data) => {
    setCallData(data);
    setIsCallActive(true);
  };

  const handleCallEnded = () => {
    setCallData(null);
    setIsCallActive(false);
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="cards-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CallForm 
              onCallInitiated={handleCallInitiated}
              isCallActive={isCallActive}
            />
          </motion.div>

          <AnimatePresence>
            {isCallActive && callData && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <CallControls 
                    callData={callData}
                    onCallEnded={handleCallEnded}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <LiveListening 
                    callData={callData}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
