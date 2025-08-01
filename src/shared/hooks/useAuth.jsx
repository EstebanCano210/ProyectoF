// src/shared/hooks/useAuth.jsx
import { useState, useEffect, createContext, useContext } from 'react';
import {
  login as loginApi,
  register as registerApi,
  definirRol as definirRolApi
} from '../../services/api.jsx';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  // Persiste en localStorage siempre que cambie `user`
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // LOGIN
  const login = async credentials => {
    const res = await loginApi(credentials);
    console.log('💡 login response:', res.data);
    if (!res.error && res.data) {
      // Backend devuelve { usuario, token }
      const { usuario: u, token } = res.data;
      console.log('💡 user from API:', u);
      // u tiene fields: uid, name, email, role, etc.
      setUser({ ...u, token });
    }
    return res;
  };

  // REGISTER
  const register = async data => {
    const res = await registerApi(data);
    console.log('💡 register response:', res.data);
    if (!res.error && res.data) {
      // Backend también devuelve { usuario, token }
      const { usuario: u, token } = res.data;
      console.log('💡 user from API (register):', u);
      setUser({ ...u, token });
    }
    return res;
  };

  // DEFINIR ROL (Choose Role)
  const definirRol = async formData => {
    const res = await definirRolApi(formData);
    console.log('💡 definirRol response:', res.data);
    if (!res.error && res.data) {
      // Backend devuelve { user: { ... } } en este caso usa `user`
      const { user: u } = res.data;
      console.log('💡 user from API (definirRol):', u);
      setUser(prev => ({ ...u, token: prev.token }));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, definirRol, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
