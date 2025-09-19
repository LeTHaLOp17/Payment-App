import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, formData }) => {
  const UPI_ID = "7292863850@ptsbi";
  const [isOpening, setIsOpening] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // Detect if user is on mobile device
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const handlePayment = (paymentApp) => {
    if (isOpening) return;
    
    setIsOpening(true);
    
    const { amount, fullName } = formData;
    const merchantName = "IBM Training Program";
    const transactionNote = `IBM Training Registration - ${fullName}`;
    
    if (isMobile) {
      // Mobile: Open UPI apps directly
      const paymentUrls = {
        paytm: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`,
        googlepay: `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`,
        phonepe: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`,
        upi: `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`
      };

      const selectedUrl = paymentUrls[paymentApp] || paymentUrls.upi;
      window.location.href = selectedUrl;
      
      setTimeout(() => {
        setIsOpening(false);
        onClose();
      }, 1000);
      
    } else {
      // Desktop: Show QR code
      setTimeout(() => {
        setIsOpening(false);
        setShowQR(true);
      }, 500);
    }
  };

  // Generate QR code URL for UPI payment
  const generateQRCode = () => {
    const { amount, fullName } = formData;
    const merchantName = "IBM Training Program";
    const transactionNote = `IBM Training Registration - ${fullName}`;
    
    const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    
    // Using QR Server API for QR generation
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;
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
          <h2>Payment</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            disabled={isOpening}
          >
            ×
          </button>
        </div>
        
        <div className="payment-modal-body">
          {!showQR ? (
            <>
              {/* Payment Info */}
              <div className="payment-info">
                <p><strong>Amount:</strong> ₹{formData.amount}</p>
                <p><strong>UPI ID:</strong> {UPI_ID}</p>
              </div>
              
              {/* Payment Options */}
              <div className="payment-options">
                <button 
                  className={`pay-button paytm-btn ${isOpening ? 'opening' : ''}`}
                  onClick={() => handlePayment('paytm')}
                  disabled={isOpening}
                >
                  <div className="app-logo">
                    <img src="/paytmLogo.jpg" alt="Paytm" className="paytm-logo"/>
                  </div>
                  <span>Pay with Paytm</span>
                  {isOpening && <div className="loading-spinner"></div>}
                </button>
                
                <button 
                  className={`pay-button gpay-btn ${isOpening ? 'opening' : ''}`}
                  onClick={() => handlePayment('googlepay')}
                  disabled={isOpening}
                >
                  <div className="app-logo">
                    <img src="/gpayLogo.png" alt="Google Pay" className="gpay-logo"/>
                  </div>
                  <span>Pay with Google Pay</span>
                  {isOpening && <div className="loading-spinner"></div>}
                </button>
                
                <button 
                  className={`pay-button phonepe-btn ${isOpening ? 'opening' : ''}`}
                  onClick={() => handlePayment('phonepe')}
                  disabled={isOpening}
                >
                  <div className="app-logo">
                    <img src="/phonePay.png" alt="PhonePe" className="phonepe-logo"/>
                  </div>
                  <span>Pay with PhonePe</span>
                  {isOpening && <div className="loading-spinner"></div>}
                </button>
                
                <button 
                  className={`pay-button upi-btn ${isOpening ? 'opening' : ''}`}
                  onClick={() => handlePayment('upi')}
                  disabled={isOpening}
                >
                  <div className="app-logo">
                    <svg viewBox="0 0 24 24" className="upi-logo">
                      <rect x="3" y="4" width="18" height="16" rx="2" fill="#FF6B35"/>
                      <path d="M12 8v8m-4-4h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Other UPI App</span>
                  {isOpening && <div className="loading-spinner"></div>}
                </button>
              </div>
              
              {/* Instructions */}
              <div className="payment-instructions">
                <p>{isMobile ? 'Tap any option to pay' : 'Click any option to generate QR code'}</p>
              </div>
            </>
          ) : (
            /* QR Code Section for Desktop */
            <div className="qr-section">
              <h3>Scan QR Code to Pay</h3>
              
              <div className="qr-container">
                <img 
                  src={generateQRCode()} 
                  alt="UPI Payment QR Code"
                  className="qr-code"
                />
              </div>
              
              <div className="qr-instructions">
                <p>Scan this QR code with any UPI app on your phone</p>
                <div className="payment-details">
                  <p>Amount: ₹{formData.amount}</p>
                  <p>UPI ID: {UPI_ID}</p>
                </div>
              </div>
              
              <div className="qr-actions">
                <button 
                  className="pay-button secondary"
                  onClick={() => setShowQR(false)}
                >
                  Back to Payment Options
                </button>
                
                <button 
                  className="pay-button"
                  onClick={() => {
                    navigator.clipboard.writeText(UPI_ID);
                  }}
                >
                  Copy UPI ID
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
