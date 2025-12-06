import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para buscar dados completos do perfil na API
  const fetchUserProfile = async (authToken) => {
    try {
      const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Atualiza o estado com os dados vindos do banco
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  };

  // Inicialização: Verifica se já existe um token salvo no navegador
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("caquicanela_token");
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          // Verifica se o token ainda é válido (não expirou)
          if (decodedToken.exp * 1000 > Date.now()) {
            setToken(storedToken);
            setRole(decodedToken.role);
            setIsAuthenticated(true);
            // Se o token é válido, busca os dados atualizados do usuário
            await fetchUserProfile(storedToken);
          } else {
            localStorage.removeItem("caquicanela_token");
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
        localStorage.removeItem("caquicanela_token");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Função de Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Credenciais inválidas');

      const decodedToken = jwtDecode(data.token);
      setToken(data.token);
      setRole(decodedToken.role);
      setIsAuthenticated(true);
      localStorage.setItem("caquicanela_token", data.token);
      
      // Busca os dados completos do usuário imediatamente após o login
      await fetchUserProfile(data.token);

      return { success: true, role: decodedToken.role };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Função de Registro (Atualizada para enviar endereço e telefone)
  const register = async (userData) => {
    setLoading(true);
    
    // Prepara o objeto com todos os dados para enviar ao backend
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,     // Enviando telefone
      address: userData.address  // Enviando objeto de endereço completo
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao registrar');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar dados do usuário (usada na página Minha Conta)
  const updateUser = async (updatedData) => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if(response.ok) {
          const newUser = await response.json();
          setUser(newUser); // Atualiza o estado local com os novos dados retornados
          return { success: true };
      } else {
          return { success: false, error: 'Falha ao atualizar' };
      }
    } catch (error) {
        return { success: false, error: error.message };
    }
  };

  // Função de Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("caquicanela_token");
  };

  const value = { user, token, role, isAuthenticated, loading, login, register, logout, updateUser };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth error");
  return context;
}