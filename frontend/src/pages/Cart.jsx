// frontend/src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Adicionando Link caso queira usá-lo em vez de button+navigate
import './Cart.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const loadCartFromLocalStorage = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  };

  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  const total = cartItems.reduce((sum, item) => {
    // Adiciona verificação para garantir que item.price é um número e item.quantity também (se usar)
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1; // Assume quantidade 1 se não especificado
    return sum + (price * quantity);
  }, 0);

  const handleRemoveItem = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const goToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra!");
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <header className="cart-header">
        <h1>Seu Carrinho de Compras</h1>
      </header>

      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p>Seu carrinho está vazio. Que tal explorar nossos produtos sustentáveis?</p>
          <button className="continue-shopping-button" onClick={() => navigate('/home')}>
            Continuar Comprando
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map((item, index) => (
              <div key={item.id || index} className="cart-item-card"> {/* Usar item.id se disponível e único */}
                <img
                  src={item.image} // Assumindo que item.image já é a URL completa ou o caminho correto
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-image.png"; }}
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  {/* Se você adicionar quantidade ao carrinho, exiba aqui */}
                  {/* <p>Quantidade: {item.quantity || 1}</p> */}
                  <p className="cart-item-price">R$ {(Number(item.price) || 0).toFixed(2)}</p>
                </div>
                <button
                  className="remove-item-button"
                  onClick={() => handleRemoveItem(index)}
                  title="Remover item"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Resumo da Compra</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            {/* Você pode adicionar Frete, Descontos aqui se necessário */}
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            {/* vv BOTÃO ADICIONADO ABAIXO vv */}
            <button 
              className="continue-shopping-button cart-action-button" // Usando a mesma classe do botão de carrinho vazio + uma classe adicional
              onClick={() => navigate('/home')}
            >
              Continuar Comprando
            </button>
            {/* ^^ BOTÃO ADICIONADO ACIMA ^^ */}

            <button className="checkout-button cart-action-button" onClick={goToCheckout}>
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}