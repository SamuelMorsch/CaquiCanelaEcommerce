import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import OrdersPage from './OrdersPage';
import Input from '../components/Input';

export default function UserProfilePage() {
  const { isAuthenticated, user, updateUser } = useAuth();
  const [tab, setTab] = useState('dados'); // Abas: 'dados' ou 'pedidos'
  const [message, setMessage] = useState(null);

  // Tenta pegar o primeiro endereço do usuário (se existir)
  const currentAddress = user?.Addresses?.[0] || {};

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '', // Senha vazia por padrão
    // Endereço
    cep: currentAddress.zip || '',
    logradouro: currentAddress.street || '',
    numero: currentAddress.number || '',
    complemento: currentAddress.complement || '',
    bairro: currentAddress.neighborhood || '',
    cidade: currentAddress.city || '',
    estado: currentAddress.state || '',
  });

  // Atualiza o form quando o usuário é carregado (ex: ao dar F5 na página)
  useEffect(() => {
    if (user) {
        const addr = user.Addresses?.[0] || {};
        setFormData(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            cep: addr.zip || '',
            logradouro: addr.street || '',
            numero: addr.number || '',
            complemento: addr.complement || '',
            bairro: addr.neighborhood || '',
            cidade: addr.city || '',
            estado: addr.state || ''
        }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSaveData = async (e) => {
    e.preventDefault();
    setMessage({ type: 'info', text: 'Salvando...' });

    // Prepara o objeto para enviar ao backend
    const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password || undefined, // Só envia senha se o campo estiver preenchido
        address: {
            zip: formData.cep,
            street: formData.logradouro,
            number: formData.numero,
            complement: formData.complemento,
            neighborhood: formData.bairro,
            city: formData.cidade,
            state: formData.estado
        }
    };

    const result = await updateUser(payload);

    if (result.success) {
        setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
        setFormData(prev => ({ ...prev, password: '' })); // Limpa o campo de senha por segurança
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => setMessage(null), 3000);
    } else {
        setMessage({ type: 'error', text: 'Erro ao atualizar dados.' });
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h2 className="text-3xl font-bold text-brand-secondary font-serif text-center mb-12">
        Minha Conta
      </h2>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        {/* Navegação entre Abas */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setTab('dados')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  tab === 'dados' 
                  ? 'border-brand-primary text-brand-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meus Dados
            </button>
            <button
              onClick={() => setTab('pedidos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  tab === 'pedidos' 
                  ? 'border-brand-primary text-brand-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meus Pedidos
            </button>
          </nav>
        </div>

        {/* Conteúdo das Abas */}
        <div>
          {tab === 'pedidos' && <OrdersPage />}
          
          {tab === 'dados' && (
            <form onSubmit={handleSaveData} className="space-y-6">
              {message && (
                  <div className={`p-4 rounded text-sm mb-4 ${
                      message.type === 'success' ? 'bg-green-100 text-green-700' : 
                      message.type === 'error' ? 'bg-red-100 text-red-700' : 
                      'bg-blue-100 text-blue-700'
                  }`}>
                      {message.text}
                  </div>
              )}

              <h3 className="text-xl font-medium text-brand-secondary font-serif">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" placeholder="Nome Completo" value={formData.name} onChange={handleChange} />
                <Input name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} disabled className="bg-gray-100 cursor-not-allowed" />
                <Input name="phone" placeholder="Telefone" value={formData.phone} onChange={handleChange} />
                <Input name="password" type="password" placeholder="Nova Senha (deixe vazio para manter)" value={formData.password} onChange={handleChange} />
              </div>
              
              <hr className="my-6 border-gray-200" />
              <h3 className="text-xl font-medium text-brand-secondary font-serif">Endereço</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input name="cep" placeholder="CEP" value={formData.cep} onChange={handleChange} className="md:col-span-1" />
                <Input name="logradouro" placeholder="Logradouro" value={formData.logradouro} onChange={handleChange} className="md:col-span-2" />
                <Input name="numero" placeholder="Número" value={formData.numero} onChange={handleChange} />
                <Input name="complemento" placeholder="Complemento" value={formData.complemento} onChange={handleChange} />
                <Input name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange} />
                <Input name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} />
                <Input name="estado" placeholder="Estado (UF)" value={formData.estado} onChange={handleChange} />
              </div>
              
              <div className="pt-4 flex justify-end">
                <button type="submit" className="rounded-md bg-brand-primary py-2 px-6 text-sm font-medium text-white hover:bg-brand-primary-dark transition-colors shadow-sm">
                  Salvar Alterações
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}