import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import { toast } from 'react-toastify'; // Importa o sistema de notificações

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', cep: '', logradouro: '', numero: '',
    complemento: '', bairro: '', cidade: '', estado: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }));
          toast.info("Endereço encontrado!");
        } else {
            toast.warning("CEP não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar CEP");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação de Senhas
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    // Monta o pacote de dados
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: {
        cep: formData.cep,
        logradouro: formData.logradouro,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado
      }
    };

    try {
      const result = await register(payload);

      if (result.success) {
        // --- NOTIFICAÇÃO DE SUCESSO ---
        toast.success('Cadastro realizado com sucesso! Redirecionando para o login...');
        
        // Redireciona após 2 segundos para o usuário ler a mensagem
        setTimeout(() => navigate('/login'), 2500);
      } else {
        toast.error(result.error || 'Falha ao registrar. Verifique os dados.');
      }
    } catch (err) {
      toast.error('Erro inesperado ao tentar registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-brand-secondary font-serif">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-brand-text">
          Já tem uma?{' '}
          <Link to="/login" className="font-medium text-brand-primary hover:text-brand-primary-dark">
            Faça login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>

            <fieldset>
              <legend className="text-lg font-medium text-brand-secondary mb-4 border-b border-gray-200 pb-2 w-full font-serif">Dados de Acesso</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome Completo" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="E-mail" name="email" type="email" mask="email" value={formData.email} onChange={handleChange} required />
                <Input label="Senha" name="password" type="password" value={formData.password} onChange={handleChange} required />
                <Input label="Confirmar Senha" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                <Input label="Telefone/Celular" name="phone" mask="phone" value={formData.phone} onChange={handleChange} required placeholder="(XX) XXXXX-XXXX" />
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-lg font-medium text-brand-secondary mb-4 border-b border-gray-200 pb-2 w-full mt-6 font-serif">Endereço de Entrega</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Input label="CEP" name="cep" mask="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} required />
                </div>
                <div className="md:col-span-2">
                  <Input label="Logradouro (Rua, Av.)" name="logradouro" value={formData.logradouro} onChange={handleChange} required />
                </div>
                <Input label="Número" name="numero" value={formData.numero} onChange={handleChange} required />
                <Input label="Complemento" name="complemento" value={formData.complemento} onChange={handleChange} />
                <Input label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} required />
                <Input label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} required />
                <Input label="Estado (UF)" name="estado" value={formData.estado} onChange={handleChange} required maxLength="2" />
              </div>
            </fieldset>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-primary py-3 px-4 text-sm font-medium text-white hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}