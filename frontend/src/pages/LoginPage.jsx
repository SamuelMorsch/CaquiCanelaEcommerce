import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {
      toast.success(`Bem-vindo de volta!`);
      if (result.role === 'owner' || result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/minha-conta');
      }
    } else {
      toast.error(result.error || 'Falha no login.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-brand-secondary font-serif">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-brand-text">
            Não tem uma conta?{' '}
            <Link to="/registro" className="font-medium text-brand-primary hover:text-brand-primary-dark">
              Crie uma gratuitamente
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 shadow-lg rounded-lg" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Input
                id="email-address" name="email" type="email" required
                placeholder="Endereço de e-mail"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="password" name="password" type="password" required
                placeholder="Senha"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              {/* ATUALIZADO: Agora é um Link para a página de recuperação */}
              <Link 
                to="/recuperar-senha" 
                className="font-medium text-brand-primary hover:text-brand-primary-dark"
              >
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-primary py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-75 transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}