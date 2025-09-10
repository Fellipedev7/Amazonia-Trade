// src/pages/UsePoints.jsx
import React, { useState, useEffect } from 'react';
import './UsePoints.css';
import apiClient from '../services/apiClient'; // Para buscar os pontos do usuário
import { useNavigate } from 'react-router-dom';

const UsePoints = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPointsAndActivities = async () => {
      setIsLoadingPoints(true);
      try {
        const response = await apiClient.get('/users/me'); // Rota para buscar dados do usuário logado
        if (response.data && response.data.ok && response.data.user) {
          setUserPoints(response.data.user.pontos || 0);
        } else {
          console.error("Não foi possível buscar os pontos do usuário:", response.data);
          setUserPoints(0); // Define como 0 em caso de erro ou resposta inesperada
        }
      } catch (error) {
        console.error("Erro ao buscar os pontos do usuário:", error);
        setUserPoints(0);
      } finally {
        setIsLoadingPoints(false);
      }

      // Definindo as atividades (poderia vir de uma API no futuro)
      setActivities([
        {
          id: 0,
          title: 'Boas-Vindas Sustentável: Suas Sementes de Girassol!',
          description: 'Como nosso presente de boas-vindas, retire um kit de sementes de girassol para cultivar e trazer mais vida para Manaus! Coleta organizada em parceria com a SEMMAS.',
          cost: 0, // Bônus de cadastro
          image: '/semente.jpg' , 
          buttonText: 'Pegar Meu Bônus!',
        },
        {
          id: 1,
          title: 'Vivência na Comunidade Baixote com ONG Vale da Amazônia',
          description: 'Um dia de imersão e voluntariado na Comunidade Baixote, participando de atividades locais e aprendendo com os moradores. Parceria com a ONG Vale da Amazônia.',
          cost: 350,
          image: '/volunt.jpg',
          buttonText: 'Usar EcoPontos',
        },
        {
          id: 2,
          title: 'Ingresso Setor Especial: Arena do Boi-Bumbá',
          description: 'Sinta a emoção do Festival Folclórico de Parintins diretamente da Arena! Ingresso para uma noite mágica de Caprichoso ou Garantido.',
          cost: 700,
          image: '/arenaboi.jpg',
          buttonText: 'Usar EcoPontos',
        },
        {
          id: 3,
          title: 'Kit 5 KM: Corrida da Bemol',
          description: 'Participe da tradicional Corrida da Bemol com um kit especial, incluindo camiseta e brindes exclusivos do evento.',
          cost: 250,
          image: '/bemol.jpg',
          buttonText: 'Usar EcoPontos',
        },
        {
          id: 4,
          title: 'Workshop de Biojoias com Mestre Artesão Local',
          description: 'Aprenda a criar suas próprias biojoias com sementes e fibras da Amazônia, diretamente com um mestre artesão de uma comunidade tradicional.',
          cost: 450,
          image: '/joias.jpg',
          buttonText: 'Usar EcoPontos',
        },
        {
          id: 5,
          title: 'Aula Show de Culinária Amazônica Sustentável',
          description: 'Descubra os segredos e sabores exóticos da culinária regional em uma aula interativa com um chef renomado, utilizando ingredientes locais e sustentáveis.',
          cost: 500,
          image: '/comida.jpg',
          buttonText: 'Usar EcoPontos',
        },
        {
          id: 6,
          title: 'Tour Guiado pelo MUSEU DA AMAZÔNIA',
          description: 'Explore a biodiversidade amazônica em um tour educativo pelo MUSA, guiado por especialistas locais.',
          cost: 300,
          image: '/musa.jpg',
          buttonText: 'Usar EcoPontos',
        },
        {
          id: 7,
          title: 'Vale-Doação: Projeto Quelônios da Amazônia',
          description: 'Contribua diretamente para a conservação das tartarugas da Amazônia. Seus pontos se transformam em apoio para este importante projeto.',
          cost: 150,
          image: '/quel.jpg',
          buttonText: 'Doar EcoPontos', 
        },
        {
          id: 8,
          title: 'Cupom de Desconto Dourado em Produtos Selecionados',
          description: 'Use seus EcoPontos para ganhar um super desconto em uma seleção especial de produtos de nossos vendedores parceiros na AmazôniaTrade.',
          cost: 100,
          image: '/cupom.jpg',
          buttonText: 'Usar EcoPontos',
        },
      ]);
    };

    fetchUserPointsAndActivities();
  }, []);

  const handleRedeem = (activity) => {
    if (activity.cost === 0 || userPoints >= activity.cost) {
      // Lógica de resgate (futuramente, chamada à API)
      // Ex: apiClient.post('/redeem-points', { activityId: activity.id, cost: activity.cost })
      //   .then(response => {
      //     if (response.data.success) {
      //       setUserPoints(prevPoints => prevPoints - activity.cost); // Atualiza pontos localmente
      //       alert("Parabéns pela sua troca! Em breve, você receberá um e-mail com todos os detalhes sobre como aproveitar sua nova experiência/recompensa.");
      //       // Talvez navegar para uma página de confirmação ou 'minhas recompensas'
      //     } else {
      //       alert(response.data.message || 'Não foi possível processar sua troca. Tente novamente.');
      //     }
      //   })
      //   .catch(error => {
      //     console.error("Erro ao tentar resgatar pontos:", error);
      //     alert("Ocorreu um problema ao conectar com o servidor. Tente mais tarde.");
      //   });

      // Simulação atual:
      const newPoints = userPoints - activity.cost;
      if (activity.cost > 0) { // Só deduz se não for o bônus gratuito que já foi "pago"
          setUserPoints(newPoints < 0 ? 0 : newPoints); // Garante que não fique negativo
      }
      alert(`Parabéns pela sua troca por "${activity.title}"! Em breve, você receberá um e-mail com todos os detalhes sobre como aproveitar sua nova experiência/recompensa.`);
      // Aqui você pode querer desabilitar o resgate do bônus se for único,
      // ou navegar para uma página de "meus resgates".
      // Por ora, não há navegação automática após o alerta.

    } else {
      alert('Você não tem EcoPontos suficientes para esta atividade.');
    }
  };

  if (isLoadingPoints) {
    return <div className="use-points-container loading-state">Carregando seus EcoPontos...</div>;
  }

  return (
    <div className="use-points-container">
      <header className="use-points-header">
        <img src="/logo.png" alt="AmazôniaTrade EcoPontos" className="use-points-logo" />
        <h1>Resgate Seus EcoPontos</h1>
        <p className="user-points-display">Você tem: <span>{userPoints}</span> EcoPontos</p>
        <p className="page-subtitle">Transforme seus pontos em experiências únicas e contribua para um futuro mais sustentável na Amazônia!</p>
      </header>

      <div className="activities-grid">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`activity-card ${userPoints < activity.cost && activity.cost > 0 ? 'disabled' : ''}`}
          >
            <div className="activity-image-container">
              <img 
                src={activity.image} 
                alt={activity.title} 
                className="activity-image" 
                onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.png'; }}
              />
            </div>
            <div className="activity-content">
              <h2 className="activity-title">{activity.title}</h2>
              <p className="activity-description">{activity.description}</p>
              <p className="activity-cost">
                {activity.cost > 0 ? `${activity.cost} EcoPontos` : "Gratuito!"}
              </p>
              <button
                onClick={() => handleRedeem(activity)}
                disabled={userPoints < activity.cost && activity.cost > 0}
                className="redeem-button"
              >
                {activity.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
       <div className="use-points-footer">
        <p>Continue comprando na AmazôniaTrade para ganhar mais EcoPontos!</p>
        <button onClick={() => navigate('/home')} className="back-to-home-button">
          Voltar para Home
        </button>
      </div>
    </div>
  );
};

export default UsePoints;