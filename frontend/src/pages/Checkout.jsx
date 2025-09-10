// frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './Checkout.css'; // Criaremos este arquivo para estilos

// Ícones simples para bandeiras (você pode substituir por SVGs ou pequenas imagens)
const VisaIcon = () => <span className="card-flag">Visa</span>;
const MastercardIcon = () => <span className="card-flag">Master</span>;
const EloIcon = () => <span className="card-flag">Elo</span>;
// Adicione outros conforme necessário

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    // Endereço detalhado
    cep: '',
    logradouro: '', // Rua, Avenida, etc.
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '', // Pode ser um select no futuro
    // Outros campos
    pagamento: '',
    cupomDesconto: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(loadedCart);
    const cartTotal = loadedCart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);
    setTotal(cartTotal);

    if (loadedCart.length === 0 && !isSubmitting) { // Evita alert se já estiver submetendo
        alert("Seu carrinho está vazio. Adicionando produtos...");
        
    }
  }, [isSubmitting, navigate]); // Adicionado isSubmitting e navigate para evitar warnings


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleApplyCoupon = () => {
    // Lógica frontend apenas para o cupom
    if (form.cupomDesconto) {
      alert(`Cupom "${form.cupomDesconto}" aplicado! (Funcionalidade de desconto não implementada)`);
    } else {
      alert("Por favor, insira um código de cupom.");
    }
  };

  const handleConfirm = async () => {
    setError('');
    if (cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return navigate("/home");
    }

    // Validação dos campos de endereço
    if (!form.cep || !form.logradouro || !form.numero || !form.bairro || !form.cidade || !form.estado || !form.pagamento) {
      setError("Por favor, preencha todos os campos de endereço e forma de pagamento.");
      return;
    }
    setIsSubmitting(true);

    // Monta a string de endereço completa para enviar ao backend
    const enderecoCompleto = `${form.logradouro}, ${form.numero}${form.complemento ? ` - ${form.complemento}` : ''}, Bairro: ${form.bairro}, Cidade: ${form.cidade}, Estado: ${form.estado}, CEP: ${form.cep}`;

    const produtosParaEnvio = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image
    }));

    try {
      await apiClient.post('/compras', {
        produtos: produtosParaEnvio,
        total,
        endereco: enderecoCompleto, // Enviando a string montada
        pagamento: form.pagamento
        // O campo cupomDesconto não é enviado ao backend conforme solicitado
      });

      localStorage.removeItem("cart");
      setCart([]);
      alert("Compra realizada com sucesso! Seus produtos estão a caminho.");
      navigate('/meusPedidos');
    } catch (err) {
      console.error("Erro ao finalizar compra no frontend:", err.response || err);
      setError(err.response?.data?.message || err.message || "Erro ao finalizar compra. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <header className="checkout-header">
          <img src="/logo.png" alt="AmazôniaTrade Logo" className="checkout-logo" />
          <h1>Finalizar Compra</h1>
        </header>

        {error && <p className="checkout-error-message">{error}</p>}

        <div className="checkout-content-wrapper">
          {/* Coluna da Esquerda: Formulário de Endereço e Pagamento */}
          <div className="checkout-form-section">
            <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
              <fieldset>
                <legend>Endereço de Entrega</legend>
                <div className="form-row">
                    <div className="form-group half-width">
                        <label htmlFor="cep">CEP:</label>
                        <input id="cep" type="text" name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" required />
                    </div>
                    {/* <button type="button" className="cep-search-button">Buscar CEP</button> (funcionalidade futura) */}
                </div>
                <div className="form-group">
                  <label htmlFor="logradouro">Logradouro (Rua/Avenida):</label>
                  <input id="logradouro" type="text" name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Ex: Av. das Sementes da Amazônia" required />
                </div>
                <div className="form-row">
                  <div className="form-group two-thirds-width">
                    <label htmlFor="numero">Número:</label>
                    <input id="numero" type="text" name="numero" value={form.numero} onChange={handleChange} placeholder="Ex: 123" required />
                  </div>
                  <div className="form-group one-third-width">
                    <label htmlFor="complemento">Complemento:</label>
                    <input id="complemento" type="text" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Apto, Bloco" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="bairro">Bairro:</label>
                  <input id="bairro" type="text" name="bairro" value={form.bairro} onChange={handleChange} placeholder="Ex: Centro da Floresta" required />
                </div>
                 <div className="form-row">
                    <div className="form-group two-thirds-width">
                        <label htmlFor="cidade">Cidade:</label>
                        <input id="cidade" type="text" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Ex: Manaus" required />
                    </div>
                    <div className="form-group one-third-width">
                        <label htmlFor="estado">Estado:</label>
                        <input id="estado" type="text" name="estado" value={form.estado} onChange={handleChange} placeholder="Ex: AM" required maxLength="2" />
                        {/* Ou use um select para estados */}
                    </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Pagamento</legend>
                <div className="form-group">
                  <label htmlFor="pagamento">Forma de Pagamento:</label>
                  <select id="pagamento" name="pagamento" value={form.pagamento} onChange={handleChange} required>
                    <option value="">Selecione uma opção</option>
                    <option value="Pix">Pix</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Boleto">Boleto</option>
                  </select>
                </div>
                {form.pagamento === 'Cartão de Crédito' && (
                  <div className="accepted-cards">
                    <span>Aceitamos: </span>
                    <VisaIcon /> <MastercardIcon /> <EloIcon />
                    {/* Adicionar mais ícones/imagens de bandeiras aqui */}
                  </div>
                )}
                {/* Futuramente, aqui entrariam os campos para dados do cartão */}
              </fieldset>

              <fieldset>
                <legend>Cupom de Desconto</legend>
                <div className="form-group coupon-group">
                  <input type="text" name="cupomDesconto" value={form.cupomDesconto} onChange={handleChange} placeholder="Digite seu cupom" />
                  <button type="button" onClick={handleApplyCoupon} className="apply-coupon-button">Aplicar</button>
                </div>
              </fieldset>
              
              {error && <p className="checkout-error-message form-level-error">{error}</p>} {/* Repetido para erros gerais do form */}

              <button type="submit" className="checkout-confirm-button" disabled={isSubmitting}>
                {isSubmitting ? 'Processando Pagamento...' : 'Finalizar e Pagar'}
              </button>
            </form>
          </div>

          {/* Coluna da Direita: Resumo do Pedido */}
          <div className="checkout-order-summary">
            <h3>Resumo do Pedido</h3>
            {cart.map((item, index) => (
              <div key={item.id || index} className="summary-item">
                <img src={item.image} alt={item.name} className="summary-item-image" onError={(e) => {e.target.onerror = null; e.target.src='/placeholder-image.png'}}/>
                <div className="summary-item-details">
                  <span className="summary-item-name">{item.name} (Qtd: {item.quantity || 1})</span>
                  <span className="summary-item-price">R$ {(Number(item.price) * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="summary-total">
              <span>Total do Pedido:</span>
              <span className="total-amount">R$ {total.toFixed(2)}</span>
            </div>
             <button onClick={() => navigate('/carrinho')} className="back-to-cart-button-checkout">
                Editar Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}