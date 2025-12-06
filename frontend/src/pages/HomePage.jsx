import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
// IMPORTANTE: Se você ainda não tem a imagem, crie a pasta 'assets' e coloque uma lá.
// Se não tiver, comente a linha abaixo e use um fundo colorido.
import bannerImg from '../assets/banner2.png'; 

const CATEGORIES = ["Todos", "Vestidos", "Blusas", "Calças", "Saias", "Acessórios"];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Busca produtos do backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // A rota /api/products já retorna os produtos com a nova coluna 'category'
        // (se você já atualizou o backend e reiniciou)
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar produtos do backend.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lógica de Filtro
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filtro de Categoria
      // Se o produto não tiver categoria (antigo), assume "Geral"
      const productCat = product.category || "Geral"; 
      
      const matchesCategory = selectedCategory === "Todos" || productCat === selectedCategory;
      
      // Filtro de Busca (Nome)
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="bg-brand-background min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        
        {/* --- BANNER COM IMAGEM --- */}
        <div 
          className="relative my-8 md:my-50 flex items-center justify-center h-64 md:h-96 bg-cover bg-center"
          style={{ 
            // Se não tiver a imagem, vai usar o marrom de fundo
            backgroundImage: `url(${bannerImg})`,
            
          }}
        >

          
      </div>

        {/* Filtros */}
        <div id="products-section" className="mb-12 p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            
            {/* Campo de Busca */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-brand-secondary mb-2">Buscar Produto</label>
              <input
                type="text"
                placeholder="Ex: Vestido Floral..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Seletor de Categoria */}
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-brand-secondary mb-2">Categoria</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary cursor-pointer transition-shadow"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-brand-text text-lg animate-pulse">Carregando produtos...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative inline-block" role="alert">
              <strong className="font-bold">Erro: </strong>
              <span className="block sm:inline">{error}</span>
              <p className="text-sm mt-2">Verifique se o backend está rodando na porta 3000.</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div>
             <p className="mb-6 text-sm text-gray-500 font-medium">
                Mostrando {filteredProducts.length} produto(s)
             </p>
             
             <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-brand-text text-lg">Nenhum produto encontrado para "{selectedCategory}" com o termo "{searchTerm}".</p>
                    <button 
                        onClick={() => {setSearchTerm(""); setSelectedCategory("Todos")}}
                        className="mt-4 text-brand-primary hover:underline font-medium"
                    >
                        Limpar filtros
                    </button>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}