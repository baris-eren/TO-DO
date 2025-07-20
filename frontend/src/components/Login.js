import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      setToken(res.data.token);
      navigate('/');
    } catch {
      setError('Kullanıcı adı veya şifre hatalı');
    }
  };

  return (
    <div className="auth-container">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Kullanıcı adı" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Giriş</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link></p>
    </div>
  );
}

export default Login;
