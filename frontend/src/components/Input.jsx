import React from 'react';

// Funções de máscara
const masks = {
  cep: (value) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não é dígito
      .replace(/^(\d{5})(\d)/, '$1-$2') // Adiciona o traço
      .slice(0, 9); // Limita o tamanho
  },
  phone: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2') // DDD
      .replace(/(\d)(\d{4})$/, '$1-$2') // Traço
      .slice(0, 15);
  },
  cpf: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  },
  date: (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 10);
  },
  // Nova máscara simples para e-mail
  email: (value) => {
    return value
      .toLowerCase() // Força minúsculas
      .replace(/\s/g, ''); // Remove espaços
  }
};

export default function Input({ label, name, mask, onChange, className, ...props }) {
  const handleChange = (e) => {
    // Se tiver uma máscara definida (ex: mask="phone"), aplica ela
    if (mask && masks[mask]) {
      e.target.value = masks[mask](e.target.value);
    }
    // Chama a função onChange original da página
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`w-full ${className || ''}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-brand-secondary mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        onChange={handleChange}
        {...props}
        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-brand-text placeholder-gray-400 focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm"
      />
    </div>
  );
}