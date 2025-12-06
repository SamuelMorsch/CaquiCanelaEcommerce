import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // Calcula o estoque total somando todas as variações (tamanhos/cores)
  const totalStock = product.Stocks
    ? product.Stocks.reduce((sum, stock) => sum + stock.quantity, 0)
    : 0;
  
  // --- LÓGICA DA IMAGEM CORRIGIDA ---
  // 1. Tenta pegar a imagem do PRIMEIRO item de estoque
  const firstStockImage = product.Stocks?.[0]?.imageUrl;
  
  // 2. Se não achar, usa um placeholder
  const displayImage = firstStockImage || `https://placehold.co/400x400/FFE2C8/7C4A2D?text=${product.name.replace(' ', '+')}`;

  const handleAddToCart = () => {
    // Adiciona 1 unidade do produto.
    const firstStock = product.Stocks?.[0] || {};
    addToCart(product, 1, firstStock.color || 'Padrão', firstStock.size || 'Padrão'); 
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/produto/${product.id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
          <img
            src={displayImage} // <-- USA A IMAGEM CORRIGIDA
            alt={product.name}
            className="h-64 w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-serif font-bold text-brand-secondary h-14 truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-brand-text h-10 truncate">
            {product.description || ""}
          </p>
          
          <p className="mt-2 text-xs text-brand-accent">
            {totalStock > 0 ? `${totalStock} em estoque` : "Fora de estoque"}
          </p>
          
          <p className="mt-2 text-lg font-medium text-brand-secondary">
            R$ {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
      
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={totalStock === 0}
          className="w-full rounded-md border border-transparent bg-brand-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}