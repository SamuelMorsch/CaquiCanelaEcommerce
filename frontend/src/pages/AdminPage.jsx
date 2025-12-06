import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Input from '../components/Input';

const CATEGORIES = ["Vestidos", "Blusas", "Calças", "Saias", "Acessórios"];

// Mapeamento de tradução de status
const STATUS_TRANSLATIONS = {
  'pending': 'Pendente',
  'paid': 'Pago',
  'processing': 'Em processamento',
  'shipped': 'Enviado',
  'delivered': 'Entregue',
  'cancelled': 'Cancelado',
  'refunded': 'Reembolsado'
};

// Lista de chaves para uso no select
const ORDER_STATUSES = Object.keys(STATUS_TRANSLATIONS);

export default function AdminPage() {
  const { isAuthenticated, role, token } = useAuth();
  const [tab, setTab] = useState('add');

  // --- Estados Gerais ---
  const [stockItems, setStockItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // --- Estados de Edição (Estoque) ---
  const [editValues, setEditValues] = useState({});
  const [editFiles, setEditFiles] = useState({});

  // --- Estados para "Nova Variação" ---
  const [addingVariationTo, setAddingVariationTo] = useState(null);
  const [newVariation, setNewVariation] = useState({ color: '', size: '', quantity: 0 });

  // --- Estados para "Novo Produto" ---
  const [formData, setFormData] = useState({
    name: '', sku: '', slug: '', price: '', description: '',
    color: '', size: '', quantity: 0, category: 'Vestidos'
  });
  const [imageFile, setImageFile] = useState(null);

  if (!isAuthenticated || (role !== 'owner' && role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  // --- Helpers ---
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const uploadImage = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('productImage', file);
    const response = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
    if (!response.ok) throw new Error('Falha no upload.');
    const data = await response.json();
    return `http://localhost:3000${data.imageUrl}`;
  };

  // --- Lógica: Criar Produto ---
  const handleAddChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  const handleAddFile = (e) => setImageFile(e.target.files[0] || null);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const payload = { ...formData, imageUrl };
      const response = await fetch('/api/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Erro ao criar produto.');
      showMessage('success', 'Produto criado!');
      setFormData({ name: '', sku: '', slug: '', price: '', description: '', color: '', size: '', quantity: 0, category: 'Vestidos' });
      setImageFile(null);
      e.target.reset();
    } catch (err) { showMessage('error', err.message); } finally { setLoading(false); }
  };

  // --- Lógica: Listar Estoque ---
  const fetchStock = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      const items = products.flatMap(p => 
        p.Stocks.map(s => ({ ...s, parentId: p.id, productName: p.name, productDesc: p.description, productCat: p.category || 'Geral', productPrice: p.price }))
      );
      products.forEach(p => {
          if (!p.Stocks || p.Stocks.length === 0) {
              items.push({ id: `virtual-${p.id}`, parentId: p.id, productName: p.name, productDesc: p.description, productCat: p.category || 'Geral', productPrice: p.price, color: '-', size: '-', quantity: 0, isVirtual: true });
          }
      });
      setStockItems(items);
      setEditValues({}); setEditFiles({});
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // --- Lógica: Listar Pedidos ---
  const fetchOrders = async () => {
      setLoading(true);
      try {
          const response = await fetch('/api/orders/admin/all', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if(!response.ok) throw new Error("Falha ao buscar pedidos.");
          const data = await response.json();
          setOrders(data);
      } catch (err) {
          console.error(err);
          showMessage('error', "Erro ao carregar pedidos.");
      } finally {
          setLoading(false);
      }
  };

  // --- Lógica: Atualizar Status do Pedido ---
  const handleStatusChange = async (orderId, newStatus) => {
      try {
          const response = await fetch(`/api/orders/${orderId}/status`, {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ status: newStatus })
          });
          
          if(!response.ok) throw new Error("Erro ao atualizar status.");
          
          // Usa a tradução para mostrar a mensagem bonita
          showMessage('success', `Pedido #${orderId} atualizado para ${STATUS_TRANSLATIONS[newStatus]}`);
          fetchOrders(); 

      } catch (err) {
          showMessage('error', err.message);
      }
  };

  useEffect(() => {
    if (tab === 'stock') fetchStock();
    if (tab === 'orders') fetchOrders(); 
  }, [tab]);

  // --- Handlers de Estoque ---
  const handleAddVariation = async (productId) => {
    if (!newVariation.color || !newVariation.size) { alert("Preencha cor e tamanho."); return; }
    try {
        const response = await fetch('/api/stock', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, color: newVariation.color, size: newVariation.size, quantity: newVariation.quantity })
        });
        if (!response.ok) throw new Error("Erro ao adicionar.");
        showMessage('success', 'Variação adicionada!');
        setAddingVariationTo(null); setNewVariation({ color: '', size: '', quantity: 0 });
        fetchStock();
    } catch (err) { showMessage('error', err.message); }
  };

  const handleEditChange = (id, field, value) => { setEditValues(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } })); };
  const handleEditFile = (id, file) => setEditFiles(prev => ({ ...prev, [id]: file }));

  const handleSaveStock = async (id) => {
    const changes = editValues[id] || {};
    const file = editFiles[id];
    if (Object.keys(changes).length === 0 && !file) return;
    try {
        let newImageUrl = undefined;
        if (file) newImageUrl = await uploadImage(file);
        const payload = { quantity: changes.quantity, color: changes.color, size: changes.size, imageUrl: newImageUrl, name: changes.productName, description: changes.productDesc, category: changes.productCat };
        const response = await fetch(`/api/stock/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error('Erro ao salvar.');
        showMessage('success', 'Item atualizado!');
        fetchStock();
    } catch (err) { showMessage('error', err.message); }
  };

  const handleRemoveStock = async (id) => {
    if (!window.confirm("Remover este item?")) return;
    try {
        const res = await fetch(`/api/stock/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao remover.');
        showMessage('success', 'Removido.');
        fetchStock();
    } catch (err) { showMessage('error', err.message); }
  };

  // --- RENDER ---
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h2 className="text-3xl font-bold text-brand-secondary font-serif text-center mb-8">Painel Administrativo</h2>

      <div className="flex justify-center mb-8 border-b border-gray-200 gap-4">
        <button onClick={() => setTab('add')} className={`px-6 py-3 font-medium text-sm ${tab === 'add' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}>Criar Novo Produto</button>
        <button onClick={() => setTab('stock')} className={`px-6 py-3 font-medium text-sm ${tab === 'stock' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}>Gerenciar Produtos</button>
        <button onClick={() => setTab('orders')} className={`px-6 py-3 font-medium text-sm ${tab === 'orders' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}>Gerenciar Pedidos</button>
      </div>

      {message && <div className={`max-w-4xl mx-auto mb-6 p-4 rounded-md text-center ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message.text}</div>}

      {/* ABA ADICIONAR */}
      {tab === 'add' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-brand-secondary mb-6">Novo Produto Base</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
                <Input label="Nome" name="name" value={formData.name} onChange={handleAddChange} required />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="SKU" name="sku" value={formData.sku} onChange={handleAddChange} required />
                    <Input label="Slug" name="slug" value={formData.slug} onChange={handleAddChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <Input label="Preço" type="number" name="price" value={formData.price} onChange={handleAddChange} required step="0.01" />
                     <div>
                        <label className="block text-sm font-medium text-brand-secondary mb-1">Categoria</label>
                        <select name="category" value={formData.category} onChange={handleAddChange} className="w-full border-gray-300 rounded-md shadow-sm p-3 text-brand-text">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                </div>
                <textarea name="description" rows="2" value={formData.description} onChange={handleAddChange} className="w-full border-gray-300 rounded-md p-3" placeholder="Descrição"></textarea>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h4 className="font-bold text-sm mb-2">Primeira Variação (Obrigatória)</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Cor" name="color" value={formData.color} onChange={handleAddChange} />
                        <Input label="Tam" name="size" value={formData.size} onChange={handleAddChange} />
                        <Input label="Qtd" type="number" name="quantity" value={formData.quantity} onChange={handleAddChange} required />
                    </div>
                    <div className="mt-2"><label className="block text-xs font-bold mb-1">Imagem</label><input type="file" accept="image/*" onChange={handleAddFile} className="text-sm"/></div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-brand-primary text-white py-3 rounded-md font-bold hover:bg-brand-primary-dark disabled:opacity-50">
                    {loading ? 'Salvando...' : 'Criar Produto'}
                </button>
            </form>
        </div>
      )}

      {/* ABA ESTOQUE */}
      {tab === 'stock' && (
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Img</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/3">Produto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variação</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {stockItems.map(item => {
                        const isAdding = addingVariationTo === item.parentId;
                        return (
                        <React.Fragment key={item.id}>
                            <tr className={item.isVirtual ? "bg-yellow-50" : ""}>
                                <td className="px-4 py-4"><img src={item.imageUrl || 'https://placehold.co/50'} className="h-10 w-10 object-cover rounded" alt="" />{!item.isVirtual && (<label className="cursor-pointer block text-[10px] text-blue-600 hover:underline mt-1">Mudar<input type="file" className="hidden" onChange={(e) => handleEditFile(item.id, e.target.files[0])} /></label>)}</td>
                                <td className="px-4 py-4 align-top">
                                    <div className="space-y-1">
                                        <input className="block w-full text-sm border-gray-300 rounded p-1 font-bold" value={editValues[item.id]?.productName ?? item.productName} onChange={(e) => handleEditChange(item.id, 'productName', e.target.value)} />
                                        <select className="block w-full text-xs border-gray-300 rounded p-1" value={editValues[item.id]?.productCat ?? item.productCat} onChange={(e) => handleEditChange(item.id, 'productCat', e.target.value)}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                                        <textarea className="block w-full text-xs border-gray-300 rounded p-1 resize-y" rows="2" value={editValues[item.id]?.productDesc ?? item.productDesc} onChange={(e) => handleEditChange(item.id, 'productDesc', e.target.value)} />
                                        <div className="flex gap-1 mt-1"><button onClick={() => setAddingVariationTo(addingVariationTo === item.parentId ? null : item.parentId)} className="text-xs bg-brand-accent text-white px-2 py-1 rounded hover:bg-brand-secondary">+ Variação</button></div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">{item.isVirtual ? (<span className="text-xs text-gray-400">Sem estoque</span>) : (<div className="flex flex-col gap-1"><input className="w-20 text-sm border rounded p-1" value={editValues[item.id]?.color ?? item.color} onChange={(e) => handleEditChange(item.id, 'color', e.target.value)} placeholder="Cor" /><input className="w-20 text-sm border rounded p-1" value={editValues[item.id]?.size ?? item.size} onChange={(e) => handleEditChange(item.id, 'size', e.target.value)} placeholder="Tam" /></div>)}</td>
                                <td className="px-4 py-4">{!item.isVirtual && (<input type="number" className="w-16 text-sm border rounded p-1" value={editValues[item.id]?.quantity ?? item.quantity} onChange={(e) => handleEditChange(item.id, 'quantity', e.target.value)} />)}</td>
                                <td className="px-4 py-4 space-y-1">{!item.isVirtual && (<><button onClick={() => handleSaveStock(item.id)} className="text-green-600 text-xs block font-bold bg-green-50 px-2 py-1 rounded hover:bg-green-100">Salvar</button><button onClick={() => handleRemoveStock(item.id)} className="text-red-600 text-xs block bg-red-50 px-2 py-1 rounded hover:bg-red-100">Remover</button></>)}</td>
                            </tr>
                            {isAdding && (<tr className="bg-blue-50"><td colSpan="5" className="px-4 py-2 border-t border-blue-200"><div className="flex items-center gap-4 text-sm"><span className="font-bold text-brand-secondary">Nova Variação:</span><input placeholder="Cor" className="border p-1 rounded w-20" value={newVariation.color} onChange={e => setNewVariation({...newVariation, color: e.target.value})} /><input placeholder="Tam" className="border p-1 rounded w-16" value={newVariation.size} onChange={e => setNewVariation({...newVariation, size: e.target.value})} /><input type="number" placeholder="Qtd" className="border p-1 rounded w-16" value={newVariation.quantity} onChange={e => setNewVariation({...newVariation, quantity: e.target.value})} /><button onClick={() => handleAddVariation(item.parentId)} className="bg-green-600 text-white px-3 py-1 rounded font-bold text-xs">Confirmar</button></div></td></tr>)}
                        </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
      )}

      {/* --- ABA: PEDIDOS (Traduzida) --- */}
      {tab === 'orders' && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {orders.length === 0 ? (
                <div className="p-12 text-center text-gray-500">Nenhum pedido encontrado no sistema.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-secondary">#{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.placed_at).toLocaleDateString('pt-BR')} <br/>
                                        <span className="text-xs">{new Date(order.placed_at).toLocaleTimeString('pt-BR')}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{order.User ? order.User.name : 'Desconhecido'}</div>
                                        <div className="text-sm text-gray-500">{order.User ? order.User.email : ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                        R$ {(parseFloat(order.total_amount) + parseFloat(order.shipping_amount)).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                              'bg-yellow-100 text-yellow-800'}`}>
                                            {/* AQUI ESTÁ A TRADUÇÃO */}
                                            {STATUS_TRANSLATIONS[order.status] || order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select 
                                            className="border rounded p-1 text-xs bg-white"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {ORDER_STATUSES.map(s => (
                                                <option key={s} value={s}>
                                                    {STATUS_TRANSLATIONS[s]}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      )}
    </div>
  );
}