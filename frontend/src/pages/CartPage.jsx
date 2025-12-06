import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';

export default function CartPage() {
  const { items, total, clearCart, removeFromCart } = useCart();
  const { isAuthenticated, user, token } = useAuth(); 
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Estados
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError] = useState(null);

  // --- Função 1: Calcular Frete ---
  const handleCalcFrete = async (e) => {
    e.preventDefault(); 
    if (cep.replace(/\D/g, '').length !== 8) {
      setError("Digite um CEP válido (8 números).");
      return;
    }
    
    setLoadingShipping(true);
    setError(null);
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cepDestination: cep })
      });
      
      const data = await response.json();
      
      if (response.ok && Array.isArray(data)) {
        const validOptions = data.filter(opt => !opt.MsgErro);
        if (validOptions.length > 0) {
           setShippingOptions(validOptions);
        } else {
           setError("Erro na API dos Correios. Usando frete simulado.");
           setShippingOptions([
             { Codigo: '04510', Valor: '25,00', PrazoEntrega: '5' },
             { Codigo: '04014', Valor: '40,00', PrazoEntrega: '2' }
           ]);
        }
      } else {
        setError("Erro ao calcular frete.");
      }
    } catch (err) {
      setError("Erro de conexão ao calcular frete.");
    } finally {
      setLoadingShipping(false);
    }
  };

  // --- Função 2: Finalizar Compra ---
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para finalizar.");
      navigate('/login');
      return;
    }
    
    if (!selectedShipping) {
      alert("Por favor, calcule e selecione uma opção de frete antes de continuar.");
      return;
    }

    setLoadingCheckout(true);

    try {
      const shippingCost = parseFloat(selectedShipping.Valor.replace(',', '.'));
      
      // 1. Salvar Pedido no Banco de Dados
      const orderPayload = {
        items: items.map(item => ({
            product_id: item.id,
            quantity: item.qty,
            unit_price: parseFloat(item.price)
        })),
        shipping_amount: shippingCost
      };

      const dbResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (!dbResponse.ok) throw new Error("Erro ao salvar pedido.");

      // 2. Criar Preferência no Mercado Pago
      const mpItems = [
        ...items.map(item => ({
            name: item.name,
            qty: item.qty,
            price: parseFloat(item.price)
        })),
        {
          name: `Frete (${selectedShipping.Codigo === '04014' ? 'SEDEX' : 'PAC'})`,
          qty: 1,
          price: shippingCost
        }
      ];

      const mpResponse = await fetch('/api/payment/create_preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: mpItems })
      });

      const mpData = await mpResponse.json();

      if (mpData.init_point) {
        clearCart(); 
        window.location.href = mpData.init_point; 
      } else {
        alert("Erro ao conectar com Mercado Pago.");
      }

    } catch (err) {
      console.error(err);
      alert("Erro ao processar pagamento.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  // --- Renderização: Carrinho Vazio ---
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg text-center">
          <h2 className="text-3xl font-bold text-brand-secondary font-serif mb-4">
            Seu carrinho está vazio
          </h2>
          <p className="text-brand-text mb-8">
            Adicione produtos para continuar.
          </p>
          <Link 
            to="/" 
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-brand-primary py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors"
          >
            Voltar para a Loja
          </Link>
        </div>
      </div>
    );
  }

  const shippingCostValue = selectedShipping 
    ? parseFloat(selectedShipping.Valor.replace(',', '.')) 
    : 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-brand-secondary font-serif">
          Meu Carrinho
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* CARD: Lista de Produtos */}
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-xl font-medium text-brand-secondary font-serif mb-6 border-b pb-2">Itens</h2>
            <ul className="divide-y divide-gray-200">
              {items.map((item, index) => {
                // --- LÓGICA DE IMAGEM CORRIGIDA (Variação Específica) ---
                let displayImage = "https://placehold.co/100";

                // 1. Se o item já tem 'imageUrl' salva (ideal), usa ela.
                if (item.imageUrl) {
                    displayImage = item.imageUrl;
                } 
                // 2. Se não, tenta encontrar no array de Stocks a imagem que bate com a Cor e Tamanho do item
                else if (item.Stocks && item.Stocks.length > 0) {
                    const variationStock = item.Stocks.find(s => s.color === item.color && s.size === item.size);
                    if (variationStock && variationStock.imageUrl) {
                        displayImage = variationStock.imageUrl;
                    } else {
                        // 3. Se não achar exato, pega a primeira imagem disponível
                        displayImage = item.Stocks[0].imageUrl || displayImage;
                    }
                }

                return (
                  <li key={index} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img 
                          src={displayImage} 
                          alt={item.name} 
                          className="h-full w-full object-cover object-center" 
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-medium text-brand-secondary">
                          <h3 className="text-lg">{item.name}</h3>
                          <p className="ml-4">R$ {formatCurrency(parseFloat(item.price) * item.qty)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            {item.color !== 'N/A' ? `${item.color} / ` : ''}{item.size !== 'N/A' ? item.size : ''}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-brand-text font-medium">Qtd: {item.qty}</p>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)} 
                          className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          Remover
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-xl font-medium text-brand-secondary font-serif mb-6 border-b pb-2">Entrega</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <Input 
                    label="CEP para entrega"
                    name="cep" 
                    placeholder="00000-000" 
                    value={cep} 
                    onChange={e => setCep(e.target.value)}
                    mask='cep'
                />
              </div>
              <button 
                onClick={handleCalcFrete} 
                disabled={loadingShipping}
                className="w-full sm:w-auto mb-[2px] inline-flex justify-center rounded-md border border-transparent bg-brand-accent py-3 px-6 text-base font-medium text-white shadow-sm hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {loadingShipping ? '...' : 'Calcular'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-4 font-medium">{error}</p>}
            {shippingOptions.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium text-brand-secondary">Selecione uma opção:</p>
                {shippingOptions.map((opt, idx) => (
                  <label key={idx} className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition-all ${selectedShipping === opt ? 'border-brand-primary bg-orange-50 ring-1 ring-brand-primary' : 'border-gray-200 hover:border-brand-accent'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={selectedShipping === opt} onChange={() => setSelectedShipping(opt)} className="h-4 w-4 text-brand-primary border-gray-300 focus:ring-brand-primary"/>
                      <div>
                        <span className="font-bold block text-brand-secondary">{opt.Codigo === '04014' ? 'SEDEX' : 'PAC'}</span>
                        <span className="text-xs text-gray-500 font-medium">Prazo: {opt.PrazoEntrega} dias úteis</span>
                      </div>
                    </div>
                    <span className="font-bold text-brand-secondary text-lg">R$ {opt.Valor}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 shadow-lg rounded-lg sticky top-24">
            <h2 className="text-xl font-medium text-brand-secondary font-serif mb-6 border-b pb-2">Resumo do Pedido</h2>
            <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
              <div className="flex justify-between text-brand-text"><span>Subtotal</span><span>R$ {formatCurrency(total)}</span></div>
              <div className="flex justify-between text-brand-text"><span>Frete</span><span className={selectedShipping ? "font-bold text-brand-secondary" : "text-gray-400"}>{selectedShipping ? `R$ ${shippingCostValue.toFixed(2).replace('.', ',')}` : '--'}</span></div>
            </div>
            <div className="flex justify-between text-2xl font-bold text-brand-secondary mb-8 font-serif"><span>Total</span><span>R$ {formatCurrency(total + shippingCostValue)}</span></div>
            <button onClick={handleCheckout} disabled={loadingCheckout} className="w-full py-4 bg-brand-primary text-white font-bold rounded-md shadow-lg hover:bg-brand-primary-dark disabled:opacity-70 transition-colors">
              {loadingCheckout ? 'Processando...' : 'Pagar com Mercado Pago'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}