// Se importa el modulo que carga la conexion a firebase
import FirebaseApp from './server/server_config.js';
//Se importa el metodo de autenticacion de firebase
import {getAuth, onAuthStateChanged} from 'firebase/auth';
// Se importa el estado inicial de react
import { useState } from 'react';
// Se importa el modulo de bootstrap
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// Se importan los componentes 
import First from './controllers/first_user.js';
import Login from './controllers/login.js';

// Creamos el objeto de autenticacion y le pasamos de parametro la conexion
const auth = getAuth(FirebaseApp);


function App() {
  const [user, setuser] = useState(null);

  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setuser(firebaseUser);
    }else {
        setuser(null);
      }
    }
  )
  return (
   <div>
     {user? <Login/> : <First/>}
   </div>
  );
}

export default App;
