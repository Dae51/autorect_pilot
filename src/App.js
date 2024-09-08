// Se importa el modulo que carga la conexion a firebase
import FirebaseApp from './server/server_config.js';
// Se importa el el servicio para leer documentos de una coleccion en firebase
import { getFirestore, getDocs, collection } from 'firebase/firestore';
// Se importa el estado inicial de react
import React from 'react';
// Se importa el router de react-router-dom para navegar entre las paginas
import { useNavigate, BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Se importan los componentes protegidos y el contexto de autenticacion
import { ProtectedRoute, AuthProvider } from './controllers/authContext.js';

// Se importa el modulo Toaster de la libreria react-hot-toast donde se cargan las notificaciones
import { Toaster } from 'react-hot-toast';

// Se importan el componente del primer uso
import First from './controllers/first_user.js';
// Se importa el componente del login
import Login from './controllers/login.js';
// Se importa el componente del contenido que se muestra en la aplicacion
import Account from "./controllers/account.js";

// Se importa el modulo de bootstrap
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// Creamos el objeto que almacena la base de datos para interactuar con la base de datos
const firebase = getFirestore(FirebaseApp);

// Funcion para verificar que hay usuarios en la base de datos
const checkUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(firebase, 'administradores'));
    if (querySnapshot.empty) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking users existence:', error);
    return false; // Error en la consulta
  }
};

// Funcion que gestiona el contenido mostrado en el index(Primer uso || Login)
function LoginHandler() {
  // Constante use navigate para navegar entre diferentes paginas
  const Navigate = useNavigate();


  // Contenido JSX que se muestra en la aplicacion, se crea la ruta del dashboard y la del index
  return (
    <Routes>
      <Route path="/" element={
        checkUsers ? <Login /> : <First />
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>

      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// Funcion donde se guarda el codigo central de la app web
function App() {

  // Se carga el contenido jsx del Login si hay usuarios en la base de datos o se carga el primer usuario si no existen usuarios
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position='top-right'
          reverseOrder={false}
        />
        <LoginHandler />
      </AuthProvider>
    </Router>
  );

}

export default App;
