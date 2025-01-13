// Se importan las utilidades de React
import React, { createContext, useContext, useState, useEffect } from 'react';
// Se importan los servicios de Firebase Auth y Firestore
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// Se importan las utilidades de React Router DOM
import { useNavigate, Navigate } from 'react-router-dom';
// Se importa la conexión con Firebase
import firebaseApp from '../../server/server_config';

// Inicialización de Firebase
const AuthContext = createContext();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Función que se encarga de manejar todos los servicios de autenticación
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verificar y asignar datos adicionales del usuario desde Firestore
          const userData = await fetchUserRole(user.uid);
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error al verificar el rol del usuario:', error);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Función para obtener el rol y datos del usuario desde Firestore
  const fetchUserRole = async (uid) => {
    // Colecciones a buscar
    const collections = [
      { name: 'administradores', role: 'administrador' },
      { name: 'clientes', role: 'cliente' },
    ];

    try {
      for (const collectionItem of collections) {
        const q = query(
          collection(db, collectionItem.name),
          where('uid', '==', uid) // Buscar por el campo `uid`
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]; // Obtener el primer documento encontrado
          return { ...userDoc.data(), level: collectionItem.role }; // Devolver datos del usuario y rol
        }
      }

      // Si no se encuentra en ninguna colección, retornar datos básicos
      return { uid, email: auth.currentUser.email, level: 'null' };
    } catch (error) {
      console.error('Error al obtener el usuario de Firestore:', error);
      throw error;
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Verificar y asignar datos adicionales del usuario
      const userData = await fetchUserRole(uid);
      setCurrentUser(userData);

      navigate('/dashboard'); // Redirigir al dashboard tras iniciar sesión
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate('/'); // Redirigir al inicio tras cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para crear un nuevo usuario
  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Opcional: guardar el nuevo usuario en una colección específica
      setCurrentUser({ uid, email, level: 'nuevo' });

      navigate('/dashboard'); // Redirigir al dashboard tras crear el usuario
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Cargando...</div>} {/* Mostrar un indicador de carga */}
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
