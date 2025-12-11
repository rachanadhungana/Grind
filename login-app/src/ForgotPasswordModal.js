import React, { useState } from 'react';
import Modal from 'react-modal';
import './ForgotPasswordModal.css';

Modal.setAppElement('#root');

const ForgotPasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit(email);
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="forgot-password-modal"
      overlayClassName="forgot-password-overlay"
      contentLabel="Forgot Password Modal"
    >
      <div className="modal-header">
        <h2>Reset Password</h2>
        <button className="close-button" onClick={handleClose} aria-label="Close modal">
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="reset-email">Email Address</label>
          <input
            type="email"
            id="reset-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            aria-describedby={error ? "reset-error" : undefined}
          />
          {error && <span id="reset-error" className="error-text">{error}</span>}
        </div>

        <button type="submit" className="reset-btn" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Email'}
        </button>
      </form>

      <p className="modal-footer">
        Remember your password? <button type="button" onClick={handleClose}>Sign In</button>
      </p>
    </Modal>
  );
};

export default ForgotPasswordModal;
