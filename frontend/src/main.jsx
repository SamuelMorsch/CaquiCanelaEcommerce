import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; 

// Provedores Globais
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Principal
import App from './App';

// Páginas
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import UserProfilePage from './pages/UserProfilePage'; 
import AdminPage from './pages/AdminPage'; 
import GenericPage from './pages/GenericPage';
import OrdersPage from './pages/OrdersPage';
// NOVA IMPORTAÇÃO
import ForgotPasswordPage from './pages/ForgotPasswordPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/produto/:id', element: <ProductDetailPage /> }, 
      { path: '/login', element: <LoginPage /> },
      { path: '/registro', element: <RegisterPage /> },
      // NOVA ROTA
      { path: '/recuperar-senha', element: <ForgotPasswordPage /> }, 
      { path: '/carrinho', element: <CartPage /> },
      { path: '/minha-conta', element: <UserProfilePage /> }, 
      { path: '/admin', element: <AdminPage /> }, 
      { path: '/pedidos', element: <OrdersPage /> },
      
      { path: '/sobre', element: <GenericPage title="Sobre Nós" /> },
      { path: '/contato', element: <GenericPage title="Contato" /> },
      { path: '/politicas', element: <GenericPage title="Política de Trocas" /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);