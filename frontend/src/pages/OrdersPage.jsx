import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { toast } from 'react-toastify';

export default function OrdersPage() {
  const { token, isAuthenticated } = useAuth(); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/my-orders', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
          }
      });
      if (!response.ok) throw new Error('Falha ao buscar pedidos');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível carregar seus pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
        fetchOrders();
    } else {
        setLoading(false);
    }
  }, [isAuthenticated, token]);

  const handleCancelOrder = async (orderId) => {
      if(!window.confirm("Tem certeza que deseja cancelar este pedido?")) return;

      try {
          const response = await fetch(`/api/orders/${orderId}/cancel`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          
          const data = await response.json();
          
          if (response.ok) {
              toast.success("Pedido cancelado com sucesso.");
              fetchOrders(); // Recarrega a lista
          } else {
              toast.error(data.error || "Erro ao cancelar.");
          }
      } catch (err) {
          toast.error("Erro de conexão.");
      }
  };

  // Função auxiliar para verificar se pode cancelar (menos de 24h)
  const canCancel = (orderDateString, status) => {
      if (status === 'cancelled' || status === 'delivered' || status === 'shipped') return false;
      
      const orderDate = new Date(orderDateString);
      const now = new Date();
      const diffMs = now - orderDate;
      const diffHours = diffMs / (1000 * 60 * 60);
      
      return diffHours < 24;
  };

  if (loading) return <p className="text-center p-8">Carregando pedidos...</p>;
  
  if (orders.length === 0) {
    return (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
            <p className="text-brand-text mb-4">Você ainda não fez nenhum pedido.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map(order => (
        <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          
          {/* Cabeçalho do Pedido */}
          <div className="flex justify-between items-start mb-4 border-b pb-4">
            <div>
              <p className="text-lg font-bold text-brand-secondary">Pedido #{order.id}</p>
              <p className="text-sm text-gray-500">
                  Realizado em: {new Date(order.placed_at).toLocaleDateString('pt-BR')} às {new Date(order.placed_at).toLocaleTimeString('pt-BR')}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
                }`}>
                {/* Tradução de status */}
                {order.status === 'pending' ? 'Pendente' : 
                order.status === 'paid' ? 'Aprovado' : 
                order.status === 'processing' ? 'Em processamento' :
                order.status === 'shipped' ? 'Enviado' :
                order.status === 'delivered' ? 'Entregue' : 
                order.status === 'cancelled' ? 'Cancelado' : order.status}
                </span>
                
                {/* Botão de Cancelar (Só aparece se for elegível) */}
                {canCancel(order.placed_at, order.status) && (
                    <button 
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-xs text-red-600 hover:text-red-800 underline font-medium"
                    >
                        Cancelar Pedido
                    </button>
                )}
            </div>
          </div>

          {/* Lista de Itens do Pedido */}
          <div className="mb-4">
              <h4 className="text-sm font-medium text-brand-text mb-2">Itens:</h4>
              <ul className="space-y-2">
                  {order.OrderItems && order.OrderItems.map(item => (
                      <li key={item.id} className="flex justify-between text-sm text-gray-600 border-b border-dashed pb-1 last:border-0">
                          <span>
                              {item.quantity}x {item.Product ? item.Product.name : 'Produto Indisponível'}
                          </span>
                          <span>R$ {formatCurrency(item.unit_price)}</span>
                      </li>
                  ))}
              </ul>
          </div>

          {/* Rodapé do Pedido (Totais) */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
              <div className="text-right">
                  <p className="text-sm text-gray-500">Frete: R$ {formatCurrency(order.shipping_amount)}</p>
                  <p className="text-lg font-bold text-brand-secondary">
                      Total: R$ {(parseFloat(order.total_amount) + parseFloat(order.shipping_amount)).toFixed(2)}
                  </p>
              </div>
          </div>

        </div>
      ))}
    </div>
  );
}