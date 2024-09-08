// Se importan las utilidades de react a utilizar
import React, { createContext, useContext, useState, useEffect } from 'react';
// Se importan los servicios de firebase auth a utilizar
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
// Se importan las utilidades de react router dom
import { useNavigate, Navigate } from 'react-router-dom';
// Se importa la conexion con la base de datos
import firebaseApp from '../server/server_config';

// Se inicializan las constantes para interactuar con la base de datos
const AuthContext = createContext();
const auth = getAuth(firebaseApp);

// Funcion que se encarga de manejar todos los servicios de autenticacin disponibles
export function useAuth() {
  return useContext(AuthContext);
}

// Funcion child de useAuth
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
    navigate('/');  // Redirige al inicio tras cerrar sesión
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

// Función para manejar las rutas protegidas
export function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();
  
    if (!currentUser) {
      return <Navigate to="/" />;
    }
  
    return children;
  }