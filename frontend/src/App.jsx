
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProductForm from './pages/ProductForm'; 
import ProductDetail from './pages/ProductDetail'; 
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MeusPedidos from './pages/meusPedidos'
import ProtectedRoute from './routes/ProtectedRoute';
import UsePoints from './pages/UsePoints';
import UserProfile from './pages/UserProfile';

const App = () => (
  <Router>
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }

        
      />
      <Route
        path="/meusPedidos"
        element={
          <ProtectedRoute>
            <MeusPedidos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/usarmeuspontos"
        element={
          <ProtectedRoute>
            <UsePoints />
          </ProtectedRoute>
        }
/>
      <Route
        path="/produto/:id"
        element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/carrinho"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cadastrar-produto"
        element={
          <ProtectedRoute role="vendedor">
            <ProductForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute >
            <UserProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
