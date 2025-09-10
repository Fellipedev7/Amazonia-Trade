// frontend/src/pages/ProductDetail.jsx
import React from 'react'; // << React vem do pacote 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'; // << Componentes do react-router-dom
import { useEffect, useState } from 'react'; // Mantendo a importação de hooks do React
import axios from 'axios';
import './ProductDetail.css';

// Componente simples para renderizar estrelas
const StarRating = ({ rating }) => {
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    stars.push(
      <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
        &#9733;
      </span>
    );
  }
  return <div className="star-rating">{stars}</div>;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  // Não vamos mais buscar sellerName do backend
  // const [sellerName, setSellerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dados fictícios de avaliações (mantidos)
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Juliana M.', rating: 5, date: '20/05/2025', comment: 'Produto maravilhoso, superou minhas expectativas! A entrega foi rápida e o cheiro da floresta veio junto! Recomendo demais!' },
    { id: 2, author: 'Ricardo A.', rating: 4, date: '22/05/2025', comment: 'Muito bom e autêntico. Gostaria que a embalagem fosse um pouco mais resistente, mas o produto é ótimo.' },
    { id: 3, author: 'Beatriz S.', rating: 5, date: '18/05/2025', comment: 'Amei! Sente-se a energia da Amazônia. Com certeza comprarei novamente e apoiarei esses artesãos.' },
    { id: 4, author: 'Lucas P.', rating: 4, date: '12/05/2025', comment: 'Excelente iniciativa da AmazôniaTrade! Produto chegou conforme o esperado.'}
  ]);

  useEffect(() => {
    const fetchProductData = async () => { // Nome da função alterado para clareza
      setIsLoading(true);
      setError('');
      setProduct(null);

      try {
        // Buscar apenas dados do produto
        const productResponse = await axios.get(`http://localhost:3001/products/${id}`);
        let fetchedProductData = null;

        if (productResponse.data) {
          fetchedProductData = productResponse.data.ok && productResponse.data.product
                              ? productResponse.data.product
                              : productResponse.data;
        }

        if (fetchedProductData && fetchedProductData.id) {
          setProduct(fetchedProductData);
          // Não há mais busca por nome do vendedor aqui
        } else {
          console.error("Produto não encontrado ou formato de resposta inesperado:", productResponse.data);
          setError("Produto não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar detalhe do produto:", err);
        setError(err.response?.data?.message || err.message || "Erro ao carregar dados do produto.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
      alert("Este produto já está no seu carrinho! Você pode ajustar a quantidade lá.");
    } else {
      cart.push({ ...product, quantity: 1 });
      alert("Produto adicionado ao carrinho!");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate('/carrinho');
  };

  if (isLoading) return <div className="product-detail-loading">Carregando detalhes do produto...</div>;
  if (error) return <div className="product-detail-error">Erro: {error} <Link to="/home">Voltar</Link></div>;
  if (!product) return <div className="product-detail-error">Produto não encontrado. <Link to="/home">Voltar</Link></div>;

  const productImageUrl = product.image || "/placeholder-image.png"; // product.image já deve ser a URL completa

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Voltar
      </button>
      <div className="product-detail-container">
        <div className="product-image-section">
          <img
            src={productImageUrl}
            alt={product.name}
            className="product-main-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.png";
            }}
          />
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          {/* Texto do vendedor hardcoded aqui */}
          <p className="product-seller">Por: <span className="seller-name">Loja de Leticia Almeida</span></p>

          <div className="product-price-rating">
            <p className="product-price">R$ {product.price ? product.price.toFixed(2) : '0.00'}</p>
            <div className="product-overall-rating">
              <StarRating rating={Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length) || 4.5} />
              <span>({reviews.length} avaliações)</span>
            </div>
          </div>

          <p className="product-description-title">Sobre este Tesouro da Amazônia:</p>
          <p className="product-description-text">{product.description}</p>

          <button onClick={addToCart} className="add-to-cart-button">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>

      <div className="product-reviews-section">
        <h2>Avaliações de Clientes</h2>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                <span className="review-date">{review.date}</span>
              </div>
              <StarRating rating={review.rating} />
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        ) : (
          <p>Este produto ainda não possui avaliações. Seja o primeiro a avaliar!</p>
        )}
      </div>
    </div>
  );
}
