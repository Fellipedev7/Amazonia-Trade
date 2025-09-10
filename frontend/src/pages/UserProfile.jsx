import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/apiClient'; // 1. Importar o apiClient
import './UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            // 2. Verificar apenas o 'authToken'. O userId para esta rota virá do backend via token.
            const token = localStorage.getItem('authToken');

            if (!token) {
                // Se não há token, o apiClient já lidaria com 401,
                // mas podemos redirecionar proativamente.
                navigate('/');
                return;
            }

            try {
                // 3. Usar apiClient e a rota '/users/me'
                // O apiClient automaticamente adiciona o header Authorization.
                const response = await apiClient.get('/users/me');

                if (response.data && response.data.ok) {
                    setUser(response.data.user);
                } else {
                    // Caso a resposta da API não seja como esperado, mesmo com status 200
                    setError(response.data.message || "Falha ao obter dados do usuário.");
                }
            } catch (err) {
                console.error("Erro ao carregar dados do usuário:", err);
                if (err.response) {
                    setError(err.response.data.message || "Não foi possível carregar os dados do perfil.");
                    if (err.response.status === 401) {
                        // O interceptor do apiClient já deve limpar o localStorage.
                        // Apenas navegamos para login.
                        navigate('/');
                    }
                } else {
                    setError("Erro de rede ou servidor indisponível.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remover apenas o token é suficiente se os outros dados não forem sensíveis
        localStorage.removeItem('userId');    // ou se o interceptor do apiClient já limpou
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        // Ou localStorage.clear(); para limpar tudo
        navigate('/');
    };

    if (loading) {
        return <div className="user-profile-container loading-state">Carregando perfil...</div>;
    }

    if (error) {
        return <div className="user-profile-container error-state">{error}</div>;
    }

    // 4. A verificação de 'user' e 'user.role' permanece a mesma,
    //    assumindo que o backend envia esses dados corretamente.
    if (!user || !user.role) { // Adicionada verificação para user.role
        return (
            <div className="user-profile-container no-user-state">
                Nenhum usuário encontrado ou dados incompletos.
                <button onClick={handleLogout} className="logout-button" style={{marginTop: '20px'}}>
                    Ir para Login
                </button>
            </div>
        );
    }

    return (
        <div className="user-profile-container">
            <header className="profile-header">
                <h1>Bem-vindo(a), {user.name || 'Usuário'}!</h1>
                <p className="user-role">
                    Tipo de Perfil: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
            </header>

            <section className="profile-info">
                <h2>Suas Informações</h2>
                <div className="info-item">
                    <strong>Nome:</strong> <span>{user.name}</span>
                </div>
                <div className="info-item">
                    <strong>Email:</strong> <span>{user.email}</span>
                </div>
                <div className="info-item">
                    <strong>Pontos:</strong> <span>{user.pontos || 0}</span>
                </div>
            </section>

            {user.role === 'vendedor' && (
                <section className="seller-dashboard">
                    <h2>Área do Vendedor</h2>
                    <div className="dashboard-actions">
                        <Link to="/minha-loja" className="action-button primary">Minha Loja</Link>
                        <Link to="/cadastrar-produto" className="action-button primary">Cadastrar Produto</Link>
                        {/* Adicione mais links/botões conforme necessário */}
                    </div>
                </section>
            )}

            {user.role === 'admin' && (
                <section className="admin-dashboard">
                    <h2>Área do Administrador</h2>
                    <div className="dashboard-actions">
                        <Link to="/cadastrar-recompensas" className="action-button secondary">Cadastrar Recompensas</Link>
                        <Link to="/gerenciar-usuarios" className="action-button secondary">Gerenciar Usuários</Link>
                        <Link to="/remover-produtos" className="action-button secondary">Remover Produtos</Link>
                        <Link to="/solict" className="action-button secondary">Solicitações de ONGS</Link>
                        {/* Adicione mais links/botões conforme necessário */}
                    </div>
                </section>
            )}
             {user.role === 'cliente' && (
                <section className="admin-dashboard">
                    <h2>Área do Cliente</h2>
                    <div className="dashboard-actions">
                        <Link to="/meusPedidos" className="action-button secondary">Minhas Compras</Link>
                        <Link to="/meus-pontos" className="action-button secondary">Meus Pontos</Link>
                        <Link to="/catalogo-recompensas" className="action-button secondary">Minhas trocas</Link>
                        {/* Mais funcionalidades de admin */}
                    </div>
                </section>
            )}

            <footer className="profile-footer">
                <button onClick={handleLogout} className="logout-button">
                    Sair da Conta
                </button>
            </footer>
        </div>
    );
};

export default UserProfile;