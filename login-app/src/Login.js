import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Login.css';

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        setMessage({ type: 'success', text: 'Login successful!' });
      } else {
        setMessage({ type: 'success', text: 'Registration successful!' });
      }
    }, 2000);
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
  };

  const handleSocialLogin = (provider) => {
    setMessage({ type: 'info', text: `${provider} login not implemented yet` });
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

        <form onSubmit={handleSubmit}>
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
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
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
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </motion.div>

          {!isLogin && (
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
          )}

          {isLogin && (
            <motion.div className="checkbox-group" variants={itemVariants}>
              <label>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                Remember me
              </label>
              <button type="button" className="forgot-password" onClick={() => setMessage({ type: 'info', text: 'Forgot password functionality not implemented yet' })}>Forgot password?</button>
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
          <button onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
