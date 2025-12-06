import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de envio de e-mail
    // Num projeto real, aqui você chamaria fetch('/api/auth/reset-password')
    setTimeout(() => {
      setLoading(false);
      toast.success(`Se o e-mail ${email} estiver cadastrado, você receberá um link de recuperação.`);
      
      // Redireciona para o login após 3 segundos
      setTimeout(() => navigate('/login'), 3000);
    }, 1500);
  };

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-secondary font-serif">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-sm text-brand-text">
            Digite seu e-mail para receber as instruções de redefinição.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="E-mail cadastrado"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="exemplo@email.com"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-70 transition-colors"
          >
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-brand-secondary hover:text-brand-primary">
            &larr; Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}