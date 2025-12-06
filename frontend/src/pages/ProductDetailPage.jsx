import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Estados de seleção
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  // Busca o produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Falha ao buscar produto.');
        
        const products = await response.json();
        const foundProduct = products.find(p => p.id.toString() === id);

        if (foundProduct) {
          setProduct(foundProduct);
          
          // Define a seleção inicial com base no primeiro item de estoque disponível
          if(foundProduct.Stocks && foundProduct.Stocks.length > 0) {
             const firstAvailable = foundProduct.Stocks.find(s => s.quantity > 0) || foundProduct.Stocks[0];
             setSelectedColor(firstAvailable.color || '');
             setSelectedSize(firstAvailable.size || '');
          }
        } else {
          throw new Error('Produto não encontrado.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- LÓGICA DE FILTRAGEM DE VARIAÇÕES ---

  // 1. Lista única de todas as cores disponíveis para este produto
  const allColors = useMemo(() => {
    if (!product || !product.Stocks) return [];
    return [...new Set(product.Stocks.map(s => s.color).filter(Boolean))];
  }, [product]);

  // 2. Lista de tamanhos disponíveis APENAS para a cor selecionada
  const availableSizes = useMemo(() => {
    if (!product || !product.Stocks || !selectedColor) return [];
    return product.Stocks
        .filter(s => s.color === selectedColor)
        .map(s => s.size)
        .filter(Boolean);
  }, [product, selectedColor]);

  // 3. Encontra o item de estoque exato
  const currentStockItem = useMemo(() => {
    if (!product || !product.Stocks) return null;
    return product.Stocks.find(s => s.color === selectedColor && s.size === selectedSize);
  }, [product, selectedColor, selectedSize]);

  // 4. Handler para mudança de cor
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);

    const validSizesForNewColor = product.Stocks
        .filter(s => s.color === newColor)
        .map(s => s.size);

    if (!validSizesForNewColor.includes(selectedSize)) {
        if (validSizesForNewColor.length > 0) {
            setSelectedSize(validSizesForNewColor[0]);
        } else {
            setSelectedSize('');
        }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // --- LÓGICA DE IMAGEM E CARRINHO ---

  const displayImage = currentStockItem?.imageUrl || 
                       product?.Stocks?.[0]?.imageUrl || 
                       `https://placehold.co/600x800/FFE2C8/7C4A2D?text=${product ? product.name.replace(' ', '+') : 'Produto'}`;

  const stockQuantity = currentStockItem ? currentStockItem.quantity : 0;

  const handleAddToCart = () => {
    if (currentStockItem && stockQuantity > 0) {
        addToCart(product, quantity, selectedColor, selectedSize);
    } else {
        alert("Esta variação está indisponível.");
    }
  };

  if (loading) return <div className="text-center p-12">Carregando...</div>;
  if (error) return <div className="text-center p-12 text-red-600">Erro: {error}</div>;
  if (!product) return <div className="text-center p-12">Produto não encontrado.</div>;

  return (
    <div className="container mx-auto max-w-6xl p-4 py-12"> {/* Aumentei max-w para dar mais espaço */}
      <div className="mb-6">
        <Link to="/" className="text-sm font-medium text-brand-primary hover:text-brand-primary-dark">
          &larr; Voltar ao catálogo
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex min-h-[600px]"> {/* Altura mínima para o card */}
        
        {/* --- ÁREA DA IMAGEM (Ajustada) --- */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-8 border-r border-gray-100">
          <div className="relative w-full h-full max-h-[550px] flex items-center justify-center">
             <img 
                src={displayImage} 
                alt={product.name} 
                // 'object-contain' garante que a imagem inteira apareça sem cortes
                // 'max-h-full' limita a altura ao container pai
                className="object-contain max-w-full max-h-full rounded-md shadow-sm"
              />
          </div>
        </div>

        {/* --- ÁREA DE DETALHES --- */}
        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-brand-secondary font-serif mb-2">
            {product.name}
          </h1>
          <p className="text-sm text-gray-500 mb-6 font-medium uppercase tracking-wide border-b pb-4">
            {product.category || 'Geral'}
          </p>
          
          <div className="flex items-baseline gap-4 mb-6">
             <p className="text-3xl font-bold text-brand-secondary">
                R$ {formatCurrency(product.price)}
             </p>
             {/* Exemplo de preço antigo riscado para promoção (opcional) */}
             {/* <p className="text-lg text-gray-400 line-through">R$ {(parseFloat(product.price) * 1.2).toFixed(2)}</p> */}
          </div>
          
          <p className="text-brand-text text-lg mb-8 leading-relaxed text-gray-600">
            {product.description || product.short_description || "Sem descrição detalhada."}
          </p>
          
          {/* Seletor de Cor */}
          {allColors.length > 0 && (
            <div className="mb-5">
              <label className="block text-sm font-bold text-brand-secondary mb-2 uppercase tracking-wide">Cor</label>
              <select 
                value={selectedColor} 
                onChange={handleColorChange} 
                className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-shadow cursor-pointer"
              >
                {allColors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
          
          {/* Seletor de Tamanho */}
          {availableSizes.length > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-brand-secondary mb-2 uppercase tracking-wide">Tamanho</label>
              <div className="relative">
                <select 
                    value={selectedSize} 
                    onChange={(e) => setSelectedSize(e.target.value)} 
                    className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-shadow disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
                    disabled={!selectedColor}
                >
                    {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {!selectedColor && <span className="absolute right-8 top-3 text-xs text-red-500 font-medium">Selecione uma cor</span>}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-bold flex items-center gap-2 ${stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className={`w-2 h-2 rounded-full ${stockQuantity > 0 ? 'bg-green-600' : 'bg-red-600'}`}></span>
                {stockQuantity > 0 ? 'Disponível' : 'Indisponível'}
              </span>
              {stockQuantity > 0 && <span className="text-xs text-gray-500 font-medium">({stockQuantity} itens em estoque)</span>}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-24">
                <label htmlFor="quantity" className="sr-only">Quantidade</label>
                <input
                type="number" id="quantity" name="quantity" min="1" max={stockQuantity}
                value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                className="w-full text-center rounded-md border border-gray-300 px-3 py-3 focus:ring-brand-primary focus:border-brand-primary text-lg font-medium"
                disabled={stockQuantity === 0}
                />
            </div>

            <button
                onClick={handleAddToCart}
                disabled={stockQuantity === 0 || quantity > stockQuantity || !selectedSize}
                className="flex-1 rounded-md border border-transparent bg-brand-primary py-3 px-8 text-lg font-bold text-white shadow-md hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
                {stockQuantity === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}