import React, { useState, useEffect } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, formData }) => {
  const UPI_ID = "8809945055@kotak811";
  const UPI_NAME = "IBM Training Program";
  const [timeLeft, setTimeLeft] = useState(3 * 60); // 3 minutes in seconds
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Timer effect for QR code
  useEffect(() => {
    if (isOpen) {
      // Reset timer when modal opens
      setTimeLeft(3 * 60);
      
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Generate QR code URL for UPI payment
  const generateQRCode = () => {
    const { amount, fullName } = formData;
    const merchantName = UPI_NAME;
    const transactionNote = `IBM Training Registration - ${fullName}`;
    
    const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;
  };

  // Handle copy UPI ID with feedback
  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={handleBackdropClick}>
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h2>Payment</h2>
          <button 
            className="close-button" 
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="payment-modal-body">
          <div className="qr-section">
            <h3>Scan QR Code to Pay</h3>
            
            {/* Timer Display */}
            <div className="timer-display">
              <p className={`timer-text ${timeLeft <= 60 ? 'timer-warning' : ''}`}>
                Time remaining: {formatTime(timeLeft)}
              </p>
              {timeLeft === 0 && (
                <p className="timer-expired">QR Code expired! Please close and try again.</p>
              )}
            </div>
            
            <div className="qr-container">
              <img 
                src={generateQRCode()} 
                alt="UPI Payment QR Code"
                className={`qr-code ${timeLeft === 0 ? 'qr-expired' : ''}`}
              />
            </div>
            
            <div className="qr-instructions">
              <p>Scan this QR code with any UPI app on your phone</p>
              <div className="payment-details">
                <p><strong>Amount:</strong> ₹{formData.amount}</p>
                <p><strong>UPI ID:</strong> {UPI_ID}</p>
                <p><strong>Name:</strong> {UPI_NAME}</p>
              </div>
            </div>
            
            <div className="qr-actions">
              <button 
                className={`pay-button ${copySuccess ? 'success' : ''}`}
                onClick={handleCopyUPI}
                disabled={timeLeft === 0}
              >
                {copySuccess ? 'Copied!' : 'Copy UPI ID'}
              </button>
              
              <button 
                className="pay-button secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
