// frontend/src/pages/MeusPedidos.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import './MeusPedidos.css';

const MeusPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const fetchPedidos = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/compras/user');
        if (response.data && response.data.ok && Array.isArray(response.data.compras)) {
          setPedidos(response.data.compras);
        } else {
          setPedidos([]);
          console.error("Formato de resposta inesperado ao buscar pedidos:", response.data);
        }
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err.response || err);
        setError(err.response?.data?.message || err.message || "Não foi possível carregar seus pedidos.");
        setPedidos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const handleConfirmarEntrega = async (pedidoId) => {
    // LÓGICA DE FRONTEND: Atualiza o estado para mover o pedido
    // No futuro, aqui viria a chamada API para o backend:
    // try {
    //   await apiClient.put(`/compras/${pedidoId}/confirmar-entrega`); // Ou o endpoint correto
    //   // Re-buscar os pedidos ou atualizar apenas este pedido com a resposta
    //   setPedidos(prevPedidos =>
    //     prevPedidos.map(p =>
    //       p.id === pedidoId ? { ...p, status: 'Entregue' } : p // Assume que o backend retorna o pedido atualizado
    //     )
    //   );
    //   alert(`Entrega do pedido #${pedidoId} confirmada!`);
    // } catch (error) {
    //   console.error("Erro ao confirmar entrega:", error);
    //   alert("Não foi possível confirmar a entrega. Tente novamente.");
    // }

    // Simulação atual (como no seu código original, mas garantindo a mudança de status):
    setPedidos(prevPedidos =>
      prevPedidos.map(p =>
        p.id === pedidoId ? { ...p, status: 'Entregue' } : p // Mudando para 'Entregue'
      )
    );
    // alert(`Entrega do pedido #${pedidoId} confirmada (simulação frontend).`); // Opcional
  };

  const handleAvaliarPedido = (pedidoId) => {
    // Lógica para navegar para uma página de avaliação ou abrir um modal
    // Por enquanto, apenas um alerta.
    alert(`Funcionalidade de avaliação para o pedido #${pedidoId} em breve!`);
    // Exemplo de navegação: navigate(`/avaliar-pedido/${pedidoId}`);
  };

  if (isLoading) {
    return <div className="meus-pedidos-container loading-message">Carregando seus pedidos...</div>;
  }

  if (error) {
    return <div className="meus-pedidos-container error-message">Erro: {error}. <Link to="/home">Voltar para Home</Link></div>;
  }

  // Filtragem dos pedidos baseada no status atualizado
  const pedidosEmProcessamento = pedidos.filter(p => p.status && (p.status.toLowerCase() === 'em processamento' || p.status.toLowerCase() === 'a caminho'));
  const pedidosEntregues = pedidos.filter(p => p.status && (p.status.toLowerCase() === 'entregue' || p.status.toLowerCase() === 'finalizado'));

  return (
    <div className="meus-pedidos-container">
      <header className="meus-pedidos-page-header">
        <h1>Meus Pedidos</h1>
        <button onClick={() => navigate('/home')} className="btn-home-pedidos">
          Ir para Home
        </button>
      </header>

      {pedidos.length === 0 && !isLoading && (
        <div className="empty-pedidos-message">
          <p>Você ainda não fez nenhum pedido.</p>
          <Link to="/home" className="continue-shopping-button-pedidos">Comece a Comprar</Link>
        </div>
      )}

      {pedidosEmProcessamento.length > 0 && (
        <section className="pedidos-section">
          <h2>Em Processamento / A Caminho</h2>
          <div className="pedidos-grid"> {/* Mudado de pedidos-lista para grid para melhor layout */}
            {pedidosEmProcessamento.map((pedido) => (
              <div key={pedido.id} className="pedido-card em-processamento">
                <div className="pedido-card-header">
                  <h3>Pedido #{pedido.id}</h3>
                  <span className={`status-tag status-${pedido.status.toLowerCase().replace(' ', '-')}`}>{pedido.status}</span>
                </div>
                <p className="pedido-data">Data: {new Date(pedido.createdAt).toLocaleDateString()}</p>
                
                <div className="pedido-produtos-lista-scroll">
                  {pedido.produtos.map((produto, index) => (
                    <div key={produto.id || index} className="pedido-produto-item">
                      <img
                        src={produto.image}
                        alt={produto.name}
                        className="produto-imagem-pequena"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-image.png"; }}
                      />
                      <div className="produto-info">
                        <span className="produto-nome">{produto.name}</span>
                        <span className="produto-qtd-preco">(Qtd: {produto.quantity || 1}) - R$ {(Number(produto.price) || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pedido-card-footer">
                  <p><strong>Total:</strong> R$ {(Number(pedido.total) || 0).toFixed(2)}</p>
                  <p><strong>Endereço:</strong> {pedido.endereco}</p>
                  <p><strong>Pagamento:</strong> {pedido.pagamento}</p>
                  <button className="btn-confirmar-entrega" onClick={() => handleConfirmarEntrega(pedido.id)}>
                    Confirmar Recebimento
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {pedidosEntregues.length > 0 && (
        <section className="pedidos-section">
          <h2>Entregues / Finalizados</h2>
          <div className="pedidos-grid"> {/* Mudado de pedidos-lista para grid */}
            {pedidosEntregues.map((pedido) => (
              <div key={pedido.id} className="pedido-card entregue">
                <div className="pedido-card-header">
                  <h3>Pedido #{pedido.id}</h3>
                   <span className={`status-tag status-${pedido.status.toLowerCase().replace(' ', '-')}`}>{pedido.status}</span>
                </div>
                <p className="pedido-data">Data: {new Date(pedido.createdAt).toLocaleDateString()}</p>
                <div className="pedido-produtos-lista-scroll">
                  {pedido.produtos.map((produto, index) => (
                     <div key={produto.id || index} className="pedido-produto-item">
                      <img
                        src={produto.image}
                        alt={produto.name}
                        className="produto-imagem-pequena"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-image.png"; }}
                      />
                      <div className="produto-info">
                        <span className="produto-nome">{produto.name}</span>
                        <span className="produto-qtd-preco">(Qtd: {produto.quantity || 1}) - R$ {(Number(produto.price) || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pedido-card-footer">
                  <p><strong>Total:</strong> R$ {(Number(pedido.total) || 0).toFixed(2)}</p>
                  <p><strong>Endereço:</strong> {pedido.endereco}</p>
                  <p><strong>Pagamento:</strong> {pedido.pagamento}</p>
                  <button className="btn-avaliar-pedido" onClick={() => handleAvaliarPedido(pedido.id)}>
                    Avaliar Pedido
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MeusPedidos;



