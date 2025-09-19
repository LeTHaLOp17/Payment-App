import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, formData }) => {
  const UPI_ID = "6204223457-2@axl";
  const [isOpening, setIsOpening] = useState(false);
  
  const handlePayment = (paymentApp) => {
    if (isOpening) return;
    
    setIsOpening(true);
    
    const { amount, fullName } = formData;
    const merchantName = "IBM Training Program";
    const transactionNote = `IBM Training Registration - ${fullName}`;
    
    // App-specific deep links
    const paymentUrls = {
      paytm: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`,
      googlepay: `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`,
      phonepe: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`,
      upi: `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`
    };

    const selectedUrl = paymentUrls[paymentApp] || paymentUrls.upi;
    
    console.log(`Opening ${paymentApp} with URL:`, selectedUrl);
    
    // Use window.location.href directly - this works on all devices
    window.location.href = selectedUrl;
    
    // Close modal after short delay
    setTimeout(() => {
      setIsOpening(false);
      onClose();
    }, 1000);
  };

  const showManualPayment = (appName) => {
    const { amount, fullName } = formData;
    
    const paymentDetails = `Payment Failed to Auto-Open!

Please open your ${appName || 'UPI'} app manually and enter:

UPI ID: ${UPI_ID}
Amount: ₹${amount}
Name: ${fullName}
Note: IBM Training Registration - ${fullName}

UPI ID will be copied to clipboard!`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(UPI_ID).then(() => {
        alert(paymentDetails);
      }).catch(() => {
        alert(paymentDetails.replace('\n\nUPI ID will be copied to clipboard!', ''));
      });
    } else {
      alert(paymentDetails.replace('\n\nUPI ID will be copied to clipboard!', ''));
    }
    
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isOpening) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={handleBackdropClick}>
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h2>Select Payment App</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            disabled={isOpening}
          >
            ×
          </button>
        </div>
        
        <div className="payment-modal-body">
          <div className="payment-info">
            <p><strong>Amount:</strong> ₹{formData.amount}</p>
            <p><strong>For:</strong> {formData.fullName}</p>
            <p><strong>UPI ID:</strong> {UPI_ID}</p>
          </div>
          
          <div className="payment-options">
            <button 
              className={`payment-option paytm ${isOpening ? 'opening' : ''}`}
              onClick={() => handlePayment('paytm')}
              disabled={isOpening}
            >
              <div className="payment-icon paytm-icon">💳</div>
              <span>Pay with Paytm</span>
              {isOpening && <div className="opening-indicator">🔄</div>}
            </button>
            
            <button 
              className={`payment-option googlepay ${isOpening ? 'opening' : ''}`}
              onClick={() => handlePayment('googlepay')}
              disabled={isOpening}
            >
              <div className="payment-icon googlepay-icon">🌐</div>
              <span>Pay with Google Pay</span>
              {isOpening && <div className="opening-indicator">🔄</div>}
            </button>
            
            <button 
              className={`payment-option phonepe ${isOpening ? 'opening' : ''}`}
              onClick={() => handlePayment('phonepe')}
              disabled={isOpening}
            >
              <div className="payment-icon phonepe-icon">📱</div>
              <span>Pay with PhonePe</span>
              {isOpening && <div className="opening-indicator">🔄</div>}
            </button>
            
            <button 
              className={`payment-option upi ${isOpening ? 'opening' : ''}`}
              onClick={() => handlePayment('upi')}
              disabled={isOpening}
            >
              <div className="payment-icon upi-icon">🏦</div>
              <span>Other UPI App</span>
              {isOpening && <div className="opening-indicator">🔄</div>}
            </button>
          </div>
          
          <div className="payment-note">
            <p>💡 Tap any option to open your UPI app directly with pre-filled details.</p>
          </div>
          
          {isOpening && (
            <div className="opening-status">
              <div className="opening-animation">
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
              </div>
              <p>Opening payment app...</p>
              <p className="opening-hint">Your app should open in a moment</p>
            </div>
          )}
          
          <div className="manual-option">
            <button 
              className="manual-button"
              onClick={() => showManualPayment('Manual')}
              disabled={isOpening}
            >
              📋 Copy Payment Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
