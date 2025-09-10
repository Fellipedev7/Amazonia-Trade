// frontend/src/pages/LoginForm.jsx (ou onde estiver)
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Importar Link
import './Login.css'; // Criaremos este arquivo CSS

// Supondo que sua API está rodando em http://localhost:3001
// A API_URL original era '/auth/', se seu backend espera '/auth/login', ajuste aqui.
// Vou manter '/auth/' conforme seu código original.
const API_URL = 'http://localhost:3001/auth/'; // Ou 'http://localhost:3001/auth/login' se for o endpoint exato

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Para feedback no botão
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await axios.post(API_URL, { email, password });
      const { token, userId, name, role, message } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);

      console.log(message || 'Login realizado com sucesso!');
      navigate('/home'); // Redireciona para a home após login

    } catch (err) {
      console.error('Login error:', err.response || err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.status === 404) {
        setError('Endpoint de login não encontrado. Verifique a URL da API ou a rota no backend.');
      }
       else {
        setError('Erro ao tentar fazer login. Verifique seu email e senha.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <img src="/logo.png" alt="AmazôniaTrade Logo" className="login-logo" />
        <h2>Bem-vindo(a) de volta!</h2>
        <p className="login-subtitle">Acesse sua conta para explorar a riqueza da Amazônia.</p>

        {error && <p className="login-error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>
          <button type="submit" className="login-submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-extra-links">
          <p>
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </p>
          <p className="ong-partner-text">
            Quer se tornar uma ONG parceira? <a href="/ong-parceria.html" target="_blank" rel="noopener noreferrer">
              Saiba mais
            </a>
            </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;