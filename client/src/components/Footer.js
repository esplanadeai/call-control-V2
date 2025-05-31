import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="footer-content">
        <p className="footer-text">
          Built with <Heart size={14} className="heart-icon" /> by{' '}
          <a 
            href="https://www.youtube.com/@jonasmassieAI" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            @jonasmassieai
            <ExternalLink size={12} className="external-icon" />
          </a>
          {' '} | Powered by{' '}
          <a 
            href="https://vapi.ai/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link vapi-link"
          >
            @vapi
            <ExternalLink size={12} className="external-icon" />
          </a>
          {' '} | #BuildWithVapi
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer; 