import React, { useState } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, formData }) => {
  const UPI_ID = "6204223457-2@axl"; // Change this to your UPI ID
  const [isOpening, setIsOpening] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  
  const handlePayment = (paymentApp) => {
    if (isOpening) return;
    
    setIsOpening(true);
    setShowFallback(false);
    
    const { amount, fullName } = formData;
    const merchantName = "IBM Training Program";
    const transactionNote = `IBM Training Registration - ${fullName}`;
    
    // App-specific deep links with proper encoding
    const paymentUrls = {
      paytm: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`,
      googlepay: `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`,
      phonepe: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`,
      upi: `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`
    };

    const selectedUrl = paymentUrls[paymentApp] || paymentUrls.upi;
    
    console.log(`Opening ${paymentApp} with URL:`, selectedUrl);
    
    // Multiple methods to open UPI app
    const openUpiApp = async () => {
      let appOpened = false;
      
      try {
        // Method 1: Direct window.location (best for mobile)
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          window.location.href = selectedUrl;
          appOpened = true;
        } else {
          // Method 2: Try window.open first (for desktop)
          const popup = window.open(selectedUrl, '_blank');
          
          // Check if popup was blocked
          if (popup && !popup.closed) {
            appOpened = true;
          } else {
            // Method 3: Create invisible iframe
            const iframe = document.createElement('iframe');
            iframe.src = selectedUrl;
            iframe.style.display = 'none';
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            document.body.appendChild(iframe);
            
            setTimeout(() => {
              document.body.removeChild(iframe);
            }, 3000);
            
            // Method 4: Create link and click
            const link = document.createElement('a');
            link.href = selectedUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            appOpened = true;
          }
        }
      } catch (error) {
        console.error('Error opening payment app:', error);
        appOpened = false;
      }
      
      return appOpened;
    };

    // Execute payment opening
    openUpiApp().then((success) => {
      setTimeout(() => {
        setIsOpening(false);
        
        if (success) {
          // Show fallback options if app might not have opened
          setTimeout(() => {
            setShowFallback(true);
          }, 2000);
        } else {
          setShowFallback(true);
        }
      }, 1000);
    });
  };

  const handleManualPayment = () => {
    const { amount, fullName } = formData;
    const paymentDetails = `
UPI ID: ${UPI_ID}
Amount: ₹${amount}
Name: ${fullName}
Note: IBM Training Registration - ${fullName}
    `;
    
    // Copy to clipboard
    navigator.clipboard.writeText(UPI_ID).then(() => {
      alert(`Payment details:\n${paymentDetails}\n\nUPI ID copied to clipboard!`);
    }).catch(() => {
      alert(`Payment details:\n${paymentDetails}`);
    });
    
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
          
          {!showFallback ? (
            <>
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
                <p>💡 Make sure your preferred UPI app is installed on your device.</p>
              </div>
              
              {isOpening && (
                <div className="opening-status">
                  <div className="opening-animation">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring"></div>
                  </div>
                  <p>Opening payment app...</p>
                  <p className="opening-hint">If app doesn't open, try the manual option below</p>
                </div>
              )}
            </>
          ) : (
            <div className="fallback-options">
              <div className="fallback-header">
                <h3>App didn't open?</h3>
                <p>No worries! You can still make the payment manually:</p>
              </div>
              
              <div className="manual-payment-info">
                <div className="qr-placeholder">
                  <div className="qr-icon">📱</div>
                  <p>Scan QR code or use UPI ID manually</p>
                </div>
                
                <div className="payment-details">
                  <div className="detail-row">
                    <span className="label">UPI ID:</span>
                    <span className="value">{UPI_ID}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => navigator.clipboard.writeText(UPI_ID)}
                    >
                      📋
                    </button>
                  </div>
                  <div className="detail-row">
                    <span className="label">Amount:</span>
                    <span className="value">₹{formData.amount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Note:</span>
                    <span className="value">IBM Training - {formData.fullName}</span>
                  </div>
                </div>
                
                <button 
                  className="manual-pay-button"
                  onClick={handleManualPayment}
                >
                  Copy Payment Details
                </button>
              </div>
              
              <div className="back-option">
                <button 
                  className="back-button"
                  onClick={() => setShowFallback(false)}
                >
                  ← Try Apps Again
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
