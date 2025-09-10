// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Home.css'; // Certifique-se que o caminho para seu CSS está correto

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = async (term = '') => {
    setIsLoadingProducts(true);
    try {
      const response = await apiClient.get(`/products?searchTerm=${encodeURIComponent(term)}`);
      if (response.data && response.data.ok && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        console.error("Resposta da API de produtos não está no formato esperado:", response.data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await apiClient.get('/users/me');
      if (response.data && response.data.ok && response.data.user) {
        setUserPoints(response.data.user.pontos || 0);
      } else {
        console.error("Resposta da API de usuário não está no formato esperado:", response.data);
        setUserPoints(0);
      }
    } catch (err) {
      console.error("Erro ao buscar pontos do usuário:", err);
      setUserPoints(0);
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm);
    fetchUserPoints();
  }, [searchTerm, location.pathname]);

  const handleProductClick = (id) => {
    navigate(`/produto/${id}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="home-page-wrapper"> {/* Novo wrapper para controle de fundo e espaçamento */}
      <div className="home-container">
        {/* Top bar - Mantida */}
        <header className="top-bar">
          <input
            className="search-bar"
            type="text"
            placeholder="Buscar tesouros da Amazônia..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="top-bar-icons">
            <Link to="/carrinho" className="top-bar-icon" aria-label="Carrinho">🛒</Link>
            <Link to="/perfil" className="top-bar-icon" aria-label="Perfil">👤</Link>
          </div>
        </header>

        {/* Ecopontos - Estrutura alterada */}
        <section className="ecopoints-section">
          <div className="ecopoints-content">
            <h3>MEUS ECOPONTOS</h3>
            <p className="points-value">{userPoints} <span>pontos</span></p>
            <p className="points-cta">Continue comprando e troque por experiências incríveis!</p>
            <Link to="/usarmeuspontos" className="points-redeem-link">Ver Recompensas &rarr;</Link>
          </div>
          <div className="ecopoints-logo-container">
            <img src="/logo.png" alt="AmazôniaTrade EcoPontos" className="ecopoints-logo-main" />
          </div>
        </section>

        {/* Navegação - Mantida, mas pode ser estilizada de forma diferente */}
        <nav className="main-navigation">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/meusPedidos" className="nav-link">Meus Pedidos</Link>
          <Link to="/usarmeuspontos" className="nav-link">Usar EcoPontos</Link>
          <Link to="/perfil" className="nav-link">Meu Perfil</Link>
          {/* Adicionar link para Vendedores aqui se o usuário for vendedor */}
        </nav>

        {/* Categorias - Mantida, mas será estilizada */}
        <section className="categories-section">
          <h2>Explore por Categorias</h2>
          <div className="categories-slider">
            {['Cosméticos Naturais', 'Artesanato Indígena', 'Moda Sustentável', 'Sabores da Floresta', 'Biojoias', 'Decoração Ecológica', 'Bem-Estar Amazônico'].map((cat) => (
              <div className="category-chip" key={cat}>
                {cat}
              </div>
            ))}
          </div>
        </section>

        {/* Produtos */}
        <section className="products-section">
          <h2>Nossos Tesouros</h2>
          {isLoadingProducts ? (
            <p className="loading-message">Carregando produtos da Amazônia...</p>
          ) : products.length === 0 && searchTerm !== '' ? (
            <p className="no-results">Nenhum produto encontrado para "{searchTerm}".</p>
          ) : products.length === 0 ? (
            <p className="no-results">Nenhum produto disponível no momento. Explore nossas categorias!</p>
          ) : (
            <div className="produtos-grid"> {/* Alterado para grid para melhor layout */}
              {products.map((product) => (
                <div className="produto-card" key={product.id} onClick={() => handleProductClick(product.id)}>
                  <div className="produto-image-container">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="produto-image"
                      onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.png"; }}
                    />
                  </div>
                  <div className="produto-info">
                    <h4 className="produto-name">{product.name}</h4>
                    {/* <p className="produto-description-curta">{product.description.substring(0, 60)}...</p> */}
                    <strong className="produto-price">R$ {product.price ? product.price.toFixed(2) : '0.00'}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Rodapé - Estrutura e texto alterados */}
        <footer className="main-footer">
          <div className="footer-content">
            <img src="/logo.png" alt="AmazôniaTrade" className="footer-logo" />
            <div className="footer-text">
              <h4>Nossa História, Nossos Valores</h4>
              <p>A AmazôniaTrade nasceu da paixão pela imensa riqueza natural e cultural da Amazônia e do desejo de fortalecer suas comunidades. Iniciamos nossa jornada para intensificar o comércio justo de produtos autênticos, criando uma ponte entre a sabedoria ancestral, a biodiversidade da região e consumidores conscientes em todo o mundo.</p>
              <p>Nossos valores são a <strong>sustentabilidade</strong> em cada elo da cadeia, o profundo <strong>respeito às tradições</strong> e à diversidade dos povos da floresta, o <strong>fomento à economia local</strong> de forma ética e transparente, e a <strong>celebração da vida</strong> que pulsa no coração da Amazônia. Ao escolher a AmazôniaTrade, você não apenas adquire um produto único, mas também se torna um guardião da floresta e apoia diretamente artesãos, pequenos produtores e projetos de conservação.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} AmazôniaTrade. Todos os direitos reservados.</p>
            {/* Adicionar links para Termos de Uso, Política de Privacidade, etc. */}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;