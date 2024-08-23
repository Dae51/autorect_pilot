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

import style from '../style/admin/login.module.css';

import { Button } from "react-bootstrap";
import { buttonStyle, logoStyle, title } from '../controllers/login'
import toast from "react-hot-toast";

import { validateString } from "./validator";

import logo from '../images/logo_login.png';

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
                toast.success('Usuario creado exitosamente');
            });
            //Metodo para manejar los errores de firebase auth
        }).catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                toast.error('El correo ya está en uso.');
            } else if (error.code === 'auth/invalid-email') {
                toast.error('El correo no es válido.');
            } else if (error.code === 'auth/weak-password') {
                toast.error('La contraseña es muy débil.');
            }
        });
    }



    // Funcion que se encarga de manejar el evento cuendo se envia el formulario
    function submitHandler(e) {
        //validacion que evita que se recargue la pagina cuando se manda
        e.preventDefault();
        //Funcion para validar cada campo del formulario por medio de la funcion "validateString" del validator
        if (validateString(nombre, {
            minLength: 3,
            maxLength: 20,
            pattern: /^[a-zA-Z0-9]*$/,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(correo, {
            minLength: 3,
            maxLength: 50,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(clave, {
            minLength: 8,
            maxLength: 20,
            pattern: null,
            forbiddenChars: "!#$%@^&*()",
        }) && validateString(telefono, {
            minLength: 3,
            maxLength: 15,
            pattern: /^\d{4}-[0-9]{4}$/,
            forbiddenChars: "!#$%@^&*()"
        }) && validateString(direccion, {
            minLength: 10,
            maxLength: 150,
            pattern: /^[a-zA-Z0-9.,-]*$/,
            forbiddenChars: "!#$%@^&*()"
        }) !== null) {
            // Se guardan los datos del usuario en un objeto anidado
            const ADMINDATA = {
                nombre: nombre,
                correo: correo,
                clave: clave,
                telefono: telefono,
                direccion: direccion
            };
            // Se crea el nuevo usuario con los datos del cliente
            NewUser(ADMINDATA);
        } else {
            toast.error('Los datos del usuario no son validos')
        }
    }

    // Se muestra la interfaz del primer uso
    return (
        <div>
            <div className={style.signup} id="contained-signup">
                <div className={style.top_signup}>
                    <div className={style.logo}>
                        <img src={logo} alt="" style={logoStyle} />
                    </div>
                    <div className={style.text}>
                        <h5 style={{ color: '#A3A3A3', marginLeft: '3rem' }}>WELCOME TO <span style={{ color: '#822727' }}>AUTORECT</span></h5>
                        <p style={title}>Let's create the first user <span style={{ color: '#822727' }}>.</span></p>
                    </div>
                </div>
            </div>
            <div className={style.signup} style={{ marginLeft: '7rem' }} id="contained-signup">
                <form action="" className={style.first_user} id="sign_up" onSubmit={submitHandler}>
                    <div className={style.datas_info}>
                        <div className={style.input_data}>
                            <input type="text" required id='nombre_negocio' onChange={(e) => setNombreNegocio(e.target.value)} />
                            <div className={style.underline}></div>
                            <label>Username</label>
                        </div>
                        <div className={style.input_data} style={{ marginTop: '0.75rem' }}>
                            <input type="text" required id='correo' onChange={(e) => setCorreo(e.target.value)} />
                            <div className={style.underline}></div>
                            <label>Mail</label>
                        </div>
                        <div className={style.input_data} style={{ marginTop: '0.75rem' }}>
                            <input type="password" required id="clave" onChange={(e) => setClave(e.target.value)} />
                            <div className={style.underline}></div>
                            <label>Password</label>
                        </div>
                        <div className={style.input_data} style={{ marginTop: '0.75rem' }}>
                            <input type="text" required id="telefono" onChange={(e) => setTelefono(e.target.value)} />
                            <div className={style.underline}></div>
                            <label>Phone</label>
                        </div>
                        <div className={style.input_data} style={{ marginTop: '0.75rem', height: '5rem' }}>
                            <label>Home address</label>
                            <input type="text" className="form-control" id='direccion' required onChange={(e) => setDireccion(e.target.value)}></input>
                        </div>
                    </div>
                    <Button type="submit" id="save_first" style={buttonStyle}>Save</Button>
                </form>
            </div>
        </div>
    );
}

export default First;