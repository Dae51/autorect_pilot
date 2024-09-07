import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import firebaseApp from '../server/server_config';

const AuthContext = createContext();
const auth = getAuth(firebaseApp);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/dashboard');  // Redirige al dashboard tras iniciar sesión
  };

  // Función para cerrar sesión
  const logout = async () => {
    await signOut(auth);
    navigate('/index');  // Redirige al inicio tras cerrar sesión
  };

  // Función para crear un nuevo usuario
  const signup = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
    navigate('/dashboard');  // Redirige al dashboard tras crear el usuario
  };

  const value = {
    currentUser,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Cargando...</div>}  {/* Mostrar un indicador de carga */}
    </AuthContext.Provider>
  );
}

export function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();
  
    if (!currentUser) {
      return <Navigate to="/index/" />;
    }
  
    return children;
  }