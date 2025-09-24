import React, { useState } from 'react';
import PaymentModal from './PaymentModal'; // We'll create this component
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    state: '',
    amount: ''
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.state || !formData.amount) {
      alert('Please fill all required fields');
      return;
    }

    // Show payment modal instead of alert
    console.log('Form submitted:', formData);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="ibm-registration-container">
      {/* Hero Section with Office Background */}
      <div className="hero-section">
        <div className="hero-background">
          <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="IBM Office Training Environment" 
            className="hero-image"
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Shape Your Future with IBM</h1>
          <p className="hero-subtitle">Professional Training & Internship Program 2025</p>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="registration-section">
        <div className="form-container">
          {/* Header Section with IBM Logo */}
          <div className="form-header">
            <div className="ibm-logo-section">
              <div className="ibm-logo">
                <img 
                  src="/IBM_logo.svg" 
                  alt="IBM Logo" 
                  className="ibm-logo-image"
                />
              </div>
              <div className="program-info">
                <h2>IBM TRAINING AND INTERNSHIP PROGRAM</h2>
                <p>Professional Registration</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="form-content">
            {/* Left Side - Program Details */}
            <div className="program-details">
              <h3>About the Program</h3>
              
              <div className="program-info-details">
                <div className="info-row">
                  <span className="label">Program Type:</span>
                  <span className="value">Professional Mode</span>
                </div>
                <div className="info-row">
                  <span className="label">Registration Fee:</span>
                  <span className="value">Flexible (decide your amount)</span>
                </div>
              </div>

              <div className="highlight-box">
                <div className="star-icon">⭐</div>
                <p>Gain real-world experience, strengthen your profile, and stand out in the placement season. Register today!</p>
              </div>

              <div className="contact-info">
                <h4>Contact Us:</h4>
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>Ibmskillbuidscamp@co.in</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"></span>
                  <span>+91 9663447823</span>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="form-section">
              <form onSubmit={handleSubmit} className="registration-form">
                <div className="input-group">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    name="state"
                    placeholder="State you belong to"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter Amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    min="1"
                  />
                </div>

                <button type="submit" className="pay-button">
                  Pay Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={closePaymentModal}
          formData={formData}
        />
      )}
    </div>
  );
}

export default App;
