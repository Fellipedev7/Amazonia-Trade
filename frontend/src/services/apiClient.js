import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // URL base da sua API
});

// Interceptor para adicionar o token JWT a todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Você pode adicionar interceptors de resposta também, por exemplo, para lidar com erros 401 globalmente
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Ex: deslogar o usuário, redirecionar para login
      console.error("Não autorizado ou token expirado. Redirecionando para login...");
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      // window.location.href = '/login'; // Ou use o sistema de roteamento do React
    }
    return Promise.reject(error);
  }
);


export default apiClient;