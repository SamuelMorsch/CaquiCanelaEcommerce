import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify'; // Importa o toast

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('caquicanela_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Falha ao carregar carrinho do localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('caquicanela_cart', JSON.stringify(items));
  }, [items]);

  // Adiciona item
  const addToCart = (product, quantity = 1, color = 'N/A', size = 'N/A') => {
    setItems(prevItems => {
      const variationId = `${product.id}-${color}-${size}`;
      
      const existingIndex = prevItems.findIndex(i => 
        (i.variationId && i.variationId === variationId) || (!i.variationId && i.id === product.id)
      );
      
      if (existingIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingIndex].qty += quantity;
        return newItems;
      }
      
      return [...prevItems, { ...product, qty: quantity, color, size, variationId }];
    });
    
    // NOTIFICAÇÃO DE SUCESSO!
    toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`);
  };

  // Remove item
  const removeFromCart = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.info("Item removido do carrinho.");
  };

  // Atualiza quantidade
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) {
        removeFromCart(id);
        return;
    }
    setItems(prevItems => 
        prevItems.map(item => item.id === id ? { ...item, qty: newQty } : item)
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('caquicanela_cart');
  };

  const total = useMemo(() =>
    items.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0),
  [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}