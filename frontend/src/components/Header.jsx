import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const { items } = useCart();

  const cartItemCount = items.reduce((sum, item) => sum + item.qty, 0);

  const navLinkClass = ({ isActive }) => 
    isActive ? "text-brand-primary font-bold" : "text-brand-text hover:text-brand-primary";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="text-3xl font-bold text-brand-secondary font-serif">
              CaquiCanela
            </Link>
            {/* Links de Navegação */}
            <div className="hidden md:flex md:items-center md:ml-10 md:space-x-6">
              <NavLink to="/" className={navLinkClass}>
                Catálogo
              </NavLink>
              <NavLink to="/sobre" className={navLinkClass}>
                Sobre Nós
              </NavLink>
              <NavLink to="/contato" className={navLinkClass}>
                Contato
              </NavLink>
            </div>
          </div>

          {/* Ícones da Direita (Auth e Carrinho) */}
          <div className="flex items-center space-x-4">
            
            {/* Links do Admin */}
            {isAuthenticated && (role === 'owner' || role === 'admin') && (
              <NavLink to="/admin" className={navLinkClass}>
                Painel Admin
              </NavLink>
            )}
            
            {/* Links do Usuário */}
            {isAuthenticated ? (
              <>
                <NavLink to="/minha-conta" className={navLinkClass}>
                  Minha Conta
                </NavLink>
                <button onClick={logout} className="text-sm text-brand-text hover:text-brand-primary">
                  Sair
                </button>
              </>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
            )}

            {/* Ícone do Carrinho */}
            <Link to="/carrinho" className="relative group p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-text group-hover:text-brand-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.669 0 1.189.578 1.12 1.243z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-brand-primary rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}