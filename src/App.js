// Se importa el modulo que carga la conexion a firebase
import './server/server_config.js'
// Se importa el estado inicial de react
import { useState } from 'react';
// Se importa el modulo de bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Se importan los componentes 
import First from './controllers/first_user.js';
import Login from './controllers/login.js';



function App() {
  const [user, setuser] = useState(null);
  return (
   <div>
     {user? <Login/> : <First/>}
   </div>
  );
}

export default App;
