import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import './RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const register = useStore((state) => state.register);
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    }
  }, [setAuthErrorMessage]);

  const handleRegister = (event) => {
    event.preventDefault();

    register({
      username: username,
      password: password,
    });
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Create Account</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username:
          </label>
          <input
            type="text"
            id="username"
            className="form-input"
            placeholder="Enter username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
      {errorMessage && (
        <h3 className="error-message">{errorMessage}</h3>
      )}
    </div>
  );
}

export default RegisterPage;