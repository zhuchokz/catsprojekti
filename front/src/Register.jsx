import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './auth.css'; // Общий CSS

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3005/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const result = await response.text();
      setError(result);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {error && error.includes('Username') && <p>{error}</p>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && error.includes('Password') && <p>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
