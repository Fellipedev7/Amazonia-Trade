import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const userId = localStorage.getItem('userId');
  // vv CORREÇÃO AQUI vv
  const userRoleFromStorage = localStorage.getItem('userRole'); // Use 'userRole'

  // Se não estiver logado (sem userId), redireciona para a página inicial/login
  if (!userId) {
    // console.log("ProtectedRoute: userId não encontrado, redirecionando para /");
    return <Navigate to="/" replace />; // 'replace' é uma boa prática para histórico de navegação
  }

  // Se uma 'role' específica é exigida pela rota E o papel do usuário não corresponde
  if (role && userRoleFromStorage !== role) {
    // console.log(`ProtectedRoute: Acesso negado. Exigido: ${role}, Usuário tem: ${userRoleFromStorage}. Redirecionando para /home`);
    return <Navigate to="/home" replace />;
  }

  // Se passou pelas verificações, renderiza o componente filho
  // console.log(`ProtectedRoute: Acesso permitido. Exigido: ${role}, Usuário tem: ${userRoleFromStorage}`);
  return children;
}
