import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div>
            <Link to="/" className="text-2xl font-bold text-brand-secondary font-serif">
              CaquiCanela
            </Link>
            <p className="mt-4 text-brand-text text-sm">
              Elegância e conforto em peças feitas para você.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-secondary font-serif tracking-wider uppercase">Institucional</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/sobre" className="text-sm text-brand-text hover:text-brand-primary">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-sm text-brand-text hover:text-brand-primary">Contato</Link></li>
              <li><Link to="/politicas" className="text-sm text-brand-text hover:text-brand-primary">Política de Trocas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-secondary font-serif tracking-wider uppercase">Ajuda</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/minha-conta" className="text-sm text-brand-text hover:text-brand-primary">Minha Conta</Link></li>
              <li><Link to="/carrinho" className="text-sm text-brand-text hover:text-brand-primary">Carrinho</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-secondary font-serif tracking-wider uppercase">Contato</h3>
            <ul className="mt-4 space-y-2 text-sm text-brand-text">
              <li>Email: contato@caquicanela.com</li>
              <li>Telefone: (51) 99999-8888</li>
            </ul>
          </div>

        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-brand-text">&copy; {new Date().getFullYear()} CaquiCanela. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}