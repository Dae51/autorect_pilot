// Se el estado inicial de react
import React, { useState } from "react";
/* import {nullHandler} from './validator.js';
 */

// Se importa el modulo que carga la conexion a firebase
import firebaseApp from "../server/server_config";
// Se importa el servicio de autenticacion y de agregar usuarios de firebase authentication
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// Se importa el el servicio para agregar documentos a una coleccion en firebase
import { getFirestore, addDoc, collection } from 'firebase/firestore';

//Se importa el diseño del login 
/* import '../style/admin/login.css';
 */
// Se inicializa la constante de firestore
const firestore = getFirestore(firebaseApp);
// Se incializa la constante de autenticacion de firebase authentication
const auth = getAuth(firebaseApp);

function First() {
    // Se declaran los datos del usuario
    const [nombre, setNombreNegocio] = useState('');
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');

    //Funcion que maneja la insercion del primer usuario 'admin'
    async function NewUser(ADMINDATA) {
        // Crea un nuevo usuario con la dirección de correo y la contraseña
        createUserWithEmailAndPassword(auth, ADMINDATA['correo'], ADMINDATA['clave']).then((FirebaseUser) => {
            // Se guarda el uid del usuario de firebase en una constante
            const user = FirebaseUser.user.uid;
            // Se agrega un nuevo documento en la colección administradores con los datos del usuario
            return addDoc(collection(firestore, 'administradores'), { ADMINDATA, usuario: user }).then((docRef) => {
                console.log('Documento añadido');
                //Metodo para manejar los errores de insercion de los datos del usuario
            }).catch((error) => {
                console.log('Error al crear el usuario:', error);
                if (error.code === 'auth/email-already-in-use') {
                    alert('El correo ya está en uso.');
                } else if (error.code === 'auth/invalid-email') {
                    alert('El correo no es válido.');
                } else if (error.code === 'auth/weak-password') {
                    alert('La contraseña es muy débil.');
                }
            });
        });
        console.log('Usuario creado correctamente');
    }



    // Funcion que se encarga de manejar el evento cuendo se envia el formulario
    function submitHandler(e) {
        //validacion que evita que se recargue la pagina cuando se manda
        e.preventDefault();
        //Funcion para validar todo los campos vacios 
        if (nombre.trim() !== '' && correo.trim() !== '' && clave.trim() !== '' && telefono.trim() !== '' && direccion.trim() !== '') {
            // Se gurdan los datos del cliente en un objeto anidado
            const ADMINDATA = {
                nombre: nombre,
                correo: correo,
                clave: clave,
                telefono: telefono,
                direccion: direccion
            };
            console.log(ADMINDATA);
            // Se crea el nuevo usuario con los datos del cliente
            NewUser(ADMINDATA);
        } else {
            alert('Todos los campos son obligatorios');
            return;
        }
    }
    // Se muestra la interfaz del primer uso
    return (
        <div className="signup" id="contained-signup">
            <div className="signup" id="contained-signup">
                <div className="top_signup">
                    <div className="logo">
                        <img src="./images/logo_login.png" alt="" />
                    </div>
                    <div className="text">
                        <h5>WELCOME TO <span>AUTORECT</span></h5>
                        <p>Let's create the first admin user ! <span>.</span></p>
                    </div>
                </div>
            </div>
            <form action="" className="first_user" id="sign_up" onSubmit={submitHandler}>
                <div className="image_user">
                    <div className="foto_user"></div>
                    <button id="pull_image">Pull photo</button>
                </div>
                <div className="datas_info">
                    <div className="input-data">
                        <input type="text" required id='nombre_negocio' onChange={(e) => setNombreNegocio(e.target.value)} />
                        <div className="underline"></div>
                        <label>Username</label>
                    </div>
                    <div className="input-data">
                        <input type="text" required id='correo' onChange={(e) => setCorreo(e.target.value)} />
                        <div className="underline"></div>
                        <label>Correo</label>
                    </div>
                    <div className="input-data">
                        <input type="password" required id="clave" onChange={(e) => setClave(e.target.value)} />
                        <div className="underline"></div>
                        <label>Password</label>
                    </div>
                    <div className="input-data">
                        <input type="text" required id="telefono" onChange={(e) => setTelefono(e.target.value)} />
                        <div className="underline"></div>
                        <label>Telefono</label>
                    </div>
                    <div className="input-data">
                        <textarea className="form-control" id='direccion' required onChange={(e) => setDireccion(e.target.value)}></textarea>
                        <div className="underline"></div>
                        <label>Direccion</label>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Lenguaje
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">ENGLISH</a></li>
                            <li><a className="dropdown-item" href="#">SPANISH LA</a></li>
                            <li><a className="dropdown-item" href="#">SPANISH ESP</a></li>
                        </ul>
                    </div>
                </div>
                <button id="save_first">Save</button>
            </form>
        </div>
    );
}

export default First;