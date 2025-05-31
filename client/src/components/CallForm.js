import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, User, Loader } from 'lucide-react';
import './CallForm.css';

const CallForm = ({ onCallInitiated, isCallActive }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    customerName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/initiate-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          customerName: formData.customerName || 'Unknown'
        }),
      });

      const data = await response.json();

      if (data.success) {
        onCallInitiated({
          listenUrl: data.listenUrl,
          phoneNumber: formData.phoneNumber,
          customerName: formData.customerName
        });
        
        // Reset form
        setFormData({
          phoneNumber: '',
          customerName: ''
        });
      } else {
        setError(data.error || 'Failed to initiate call');
      }
    } catch (err) {
      console.error('Error initiating call:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <h2 className="card-title">
          <Phone className="inline-icon" />
          AI Call Assistant
        </h2>
        <p className="card-subtitle">
          {isCallActive ? 'Call in progress' : 'Initiate a new call'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phoneNumber" className="form-label">
            <Phone size={16} className="inline-icon" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            className="form-input"
            disabled={isLoading || isCallActive}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerName" className="form-label">
            <User size={16} className="inline-icon" />
            Customer Name (Optional)
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="John Doe"
            className="form-input"
            disabled={isLoading || isCallActive}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          className={`btn ${isCallActive ? 'btn-secondary' : 'btn-primary'} ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || isCallActive}
          whileHover={{ scale: isLoading || isCallActive ? 1 : 1.02 }}
          whileTap={{ scale: isLoading || isCallActive ? 1 : 0.98 }}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin inline-icon" />
              Initiating Call...
            </>
          ) : isCallActive ? (
            'Call Active'
          ) : (
            'Initiate Call'
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default CallForm; 