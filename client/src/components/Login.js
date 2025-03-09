import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login for:', username);
      const response = await fetch('https://food-hub-server-git-main-sirivennelas-projects-9dbaf9e3.vercel.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token && data.username) {
        console.log('Login successful, storing auth data...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        
        // Verify stored data
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        console.log('Stored token:', storedToken);
        console.log('Stored username:', storedUsername);
        
        // Verify token format
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        console.log('Token payload:', payload);
        
        onLogin({ username: data.username });
        navigate('/');
      } else {
        console.log('Login failed: Missing token or username in response');
        setError('Invalid login response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center mt-3">
        Don't have an account? <Link to="https://food-hub-silk.vercel.app/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login; 