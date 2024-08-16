// Se importa el estado inicial de react
import {useState} from "react";
import ReactDOM from 'react-dom/client';

import firebaseApp from "../server/server_config";
import { getAuth, signOut } from "firebase/auth";
import {user} from '../App';
import '../style/admin/main.css';

const auth = getAuth(firebaseApp);

function Dashboard(){

     return (
        <div>
            <h1>
                <button onClick={()=> signOut(auth)}> Cerrar sesion</button>
            </h1>
        </div>
     ); 

}

export default Dashboard ;