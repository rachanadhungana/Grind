import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import ForgotPasswordModal from './ForgotPasswordModal';
import './Login.css';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'password' && !isLogin) {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setMessage({ type: 'success', text: 'Login successful!' });
      } else {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        setMessage({ type: 'success', text: 'Registration successful!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false
    });
    setErrors({});
    setMessage('');
    setPasswordStrength(0);
  };

  useEffect(() => {
    if (formData.rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  }, [formData.rememberMe, formData.email]);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setMessage('');

    try {
      if (provider === 'Google') {
        const providerInstance = new GoogleAuthProvider();
        await signInWithPopup(auth, providerInstance);
      } else if (provider === 'Facebook') {
        const providerInstance = new FacebookAuthProvider();
        await signInWithPopup(auth, providerInstance);
      }

      setMessage({ type: 'success', text: `${provider} login successful!` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-form"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 variants={itemVariants}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </motion.h2>

        {message && (
          <motion.div
            className={`message ${message.type}`}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <motion.div className="input-group" variants={itemVariants}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
              required
            />
            {errors.email && <span id="email-error" className="error-text" role="alert">{errors.email}</span>}
          </motion.div>

          <motion.div className="input-group" variants={itemVariants}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
              required
            />
            {errors.password && <span id="password-error" className="error-text" role="alert">{errors.password}</span>}
          </motion.div>

          {!isLogin && (
            <>
              <motion.div className="input-group" variants={itemVariants}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </motion.div>
              <motion.div className="password-strength" variants={itemVariants}>
                <div className="strength-bar">
                  <div className={`strength-fill strength-${passwordStrength}`}></div>
                </div>
                <span className="strength-text">
                  {passwordStrength === 0 && 'Very Weak'}
                  {passwordStrength === 1 && 'Weak'}
                  {passwordStrength === 2 && 'Fair'}
                  {passwordStrength === 3 && 'Good'}
                  {passwordStrength === 4 && 'Strong'}
                  {passwordStrength === 5 && 'Very Strong'}
                </span>
              </motion.div>
            </>
          )}

          {isLogin && (
            <motion.div className="checkbox-group" variants={itemVariants}>
              <label>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  aria-describedby="remember-desc"
                />
                Remember me
              </label>
              <span id="remember-desc" className="sr-only">Keep me logged in on this device</span>
              <button type="button" className="forgot-password" onClick={() => setIsForgotPasswordModalOpen(true)} aria-label="Open forgot password modal">Forgot password?</button>
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="login-btn"
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </motion.button>
        </form>

        <motion.div className="social-login" variants={itemVariants}>
          <p>Or continue with</p>
          <div className="social-buttons">
            <button
              className="social-btn google-btn"
              onClick={() => handleSocialLogin('Google')}
            >
              Google
            </button>
            <button
              className="social-btn facebook-btn"
              onClick={() => handleSocialLogin('Facebook')}
            >
              Facebook
            </button>
          </div>
        </motion.div>

        <motion.div className="toggle-mode" variants={itemVariants}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} aria-label={isLogin ? 'Switch to sign up form' : 'Switch to sign in form'}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </motion.div>
      </motion.div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSubmit={async (email) => {
          try {
            await sendPasswordResetEmail(auth, email);
            setMessage({ type: 'success', text: 'Password reset email sent!' });
            setIsForgotPasswordModalOpen(false);
          } catch (error) {
            setMessage({ type: 'error', text: error.message });
          }
        }}
      />
    </div>
  );
};

export default Login;
