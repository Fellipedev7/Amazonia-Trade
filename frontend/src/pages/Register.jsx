// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios'; // << ALTERADO: Usando axios diretamente
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // O CSS que criamos anteriormente

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'cliente', // Papel padrão
    cpf: '',
    telefone: '',
    // Campos específicos de Vendedor
    vendedorOption: '', // 'ong' ou 'carteira'
    selectedOng: '',
    carteiraNumero: '',
    // Campo específico de Admin
    adminCredential: '',
  });
  const [carteiraFoto, setCarteiraFoto] = useState(null); // Estado para o arquivo da foto da carteira
  const [error, setError] = useState('');
  // const [success, setSuccess] = useState(''); // O sucesso é tratado pelo alert e redirect
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
    if (name === "role" && value !== "vendedor") {
        setForm(prevForm => ({
            ...prevForm,
            role: value,
            vendedorOption: '',
            selectedOng: '',
            carteiraNumero: '',
        }));
        setCarteiraFoto(null);
    }
    if (name === "role" && value !== "admin") {
        setForm(prevForm => ({
            ...prevForm,
            role: value,
            adminCredential: '',
        }));
    }
  };

  const handleFileChange = (e) => {
    setCarteiraFoto(e.target.files[0]);
    // Você pode adicionar um preview da imagem aqui se desejar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // setSuccess(''); // Removido, pois o sucesso é tratado pelo alert e redirect
    setIsSubmitting(true);

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem!');
      setIsSubmitting(false);
      return;
    }

    // Dados que serão efetivamente enviados ao backend
    const backendData = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    try {
      // << ALTERADO: Usando axios.post diretamente com a URL completa >>
      await axios.post('http://localhost:3001/auth/register', backendData);

      let alertMessage = 'Cadastro básico realizado com sucesso!';
      if (form.role === 'vendedor') {
        if (form.vendedorOption === 'ong' && form.selectedOng) {
          alertMessage = `Cadastro básico realizado!\n\nSua solicitação de vínculo com a ONG "${form.selectedOng}" foi registrada. Você receberá um e-mail com a confirmação e próximos passos.`;
        } else if (form.vendedorOption === 'carteira' && form.carteiraNumero) {
          alertMessage = `Cadastro básico realizado!\n\nSua Carteira do Artesão (Nº ${form.carteiraNumero}) ${carteiraFoto ? 'com foto anexada ' : ''}será analisada. Em breve você receberá um e-mail de confirmação e próximos passos.`;
        } else {
            alertMessage = 'Cadastro de vendedor realizado! Para listar produtos, sua conta passará por uma breve aprovação ou você poderá completar informações de validação em seu perfil.';
        }
      } else if (form.role === 'admin') {
        alertMessage = `Cadastro de administrador realizado!.`;
      }
      
      alert(alertMessage);
      navigate('/'); // Redireciona para a home (ou login, se preferir)

    } catch (err) {
      console.error("Erro no cadastro:", err.response || err);
      setError(err.response?.data?.message || err.message || 'Erro desconhecido no cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-form-wrapper">
        <img src="/logo.png" alt="AmazôniaTrade Logo" className="register-logo" />
        <h2>Crie sua Conta na AmazôniaTrade</h2>
        <p className="register-subtitle">Junte-se à nossa comunidade e valorize a Amazônia!</p>

        {error && <p className="form-message error-message">{error}</p>}
        {/* {success && <p className="form-message success-message">{success}</p>} Removido */}


        <form onSubmit={handleSubmit} className="register-form">
          {/* Seleção de Papel */}
          <div className="form-group">
            <label htmlFor="role">Quero me cadastrar como:</label>
            <select id="role" name="role" value={form.role} onChange={handleInputChange} className="form-input">
              <option value="cliente">Cliente</option>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <fieldset>
            <legend>Suas Informações Pessoais</legend>
            <div className="form-group">
              <label htmlFor="name">Nome Completo:</label>
              <input type="text" id="name" name="name" value={form.name} onChange={handleInputChange} required className="form-input" placeholder="Seu nome completo"/>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleInputChange} required className="form-input" placeholder="seuemail@exemplo.com"/>
            </div>
             <div className="form-group">
              <label htmlFor="cpf">CPF (opcional):</label>
              <input type="text" id="cpf" name="cpf" value={form.cpf} onChange={handleInputChange} className="form-input" placeholder="000.000.000-00"/>
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone/Celular:</label>
              <input type="tel" id="telefone" name="telefone" value={form.telefone} onChange={handleInputChange} className="form-input" placeholder="(92) 99999-9999"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Segurança da Conta</legend>
            <div className="form-group">
              <label htmlFor="password">Senha:</label>
              <input type="password" id="password" name="password" value={form.password} onChange={handleInputChange} required className="form-input" placeholder="Mínimo 6 caracteres" minLength="6"/>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleInputChange} required className="form-input" placeholder="Repita sua senha" minLength="6"/>
            </div>
          </fieldset>

          {form.role === 'vendedor' && (
            <fieldset>
              <legend>Validação de Vendedor </legend>
              <p className="fieldset-description">Para agilizar a aprovação da sua loja, você pode nos fornecer uma das informações abaixo. Você também poderá fazer isso depois, no seu perfil.</p>
              <div className="form-group">
                <label>Como gostaria de validar sua atividade artesanal/sustentável?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="vendedorOption" value="ong" checked={form.vendedorOption === 'ong'} onChange={handleInputChange} />
                    Vínculo com ONG Parceira
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="vendedorOption" value="carteira" checked={form.vendedorOption === 'carteira'} onChange={handleInputChange} />
                    Carteira Nacional do Artesão
                  </label>
                  
                </div>
              </div>

              {form.vendedorOption === 'ong' && (
                <div className="form-group">
                  <label htmlFor="selectedOng">Selecione a ONG Parceira:</label>
                  <select id="selectedOng" name="selectedOng" value={form.selectedOng} onChange={handleInputChange} className="form-input">
                    <option value="">-- Escolha uma ONG --</option>
                    <option value="SOCIEDADE DOS ARTESÃOS TESOUROS DA AMAZÔNIA">SOCIEDADE DOS ARTESÃOS TESOUROS DA AMAZÔNIA</option>
                    <option value="MANAUS FEITA A MÃO">MANAUS FEITA A MÃO</option>
                  </select>
                </div>
              )}

              {form.vendedorOption === 'carteira' && (
                <>
                  <div className="form-group">
                    <label htmlFor="carteiraNumero">Número de Registro da Carteira do Artesão:</label>
                    <input type="text" id="carteiraNumero" name="carteiraNumero" value={form.carteiraNumero} onChange={handleInputChange} className="form-input" placeholder="Seu número de registro"/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="carteiraFoto">Foto da Carteira do Artesão*:</label>
                    <input type="file" id="carteiraFoto" name="carteiraFoto" onChange={handleFileChange} className="form-input-file" accept="image/png, image/jpeg, image/webp"/>
                    {carteiraFoto && <p className="file-name-display">Arquivo: {carteiraFoto.name}</p>}
                  </div>
                </>
              )}
            </fieldset>
          )}

          {form.role === 'admin' && (
            <fieldset>
              <legend>Credencial de Administrador</legend>
              <div className="form-group">
                <label htmlFor="adminCredential">Chave de Acesso Administrativo :</label>
                <input type="text" id="adminCredential" name="adminCredential" value={form.adminCredential} onChange={handleInputChange} className="form-input" placeholder="Insira sua chave de acesso"/>
              </div>
            </fieldset>
          )}
          <button type="submit" className="register-submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>
        <p className="login-redirect">
          Já tem uma conta? <Link to="/">Faça Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
