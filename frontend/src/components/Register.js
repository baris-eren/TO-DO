import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${API_URL}/auth/register`, { username, password });
      setSuccess('Kayıt başarılı! Giriş yapabilirsiniz.');
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      setError('Kullanıcı adı zaten mevcut.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Kullanıcı adı" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Kayıt Ol</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <p>Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link></p>
    </div>
  );
}

export default Register;
