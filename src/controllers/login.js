// Se importa el estado incial de react
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "./authContext.js"

// Se importa el modulo que carga la conexion a firebase
import firebaseApp from "../server/server_config";

// Sr importan las notificaciones de la libreria react-hot-toast
import toast from 'react-hot-toast';
// Se importan los componentes de react bootstrap
import Button from "react-bootstrap/Button";

// Se importan los estilos css del login
import style from '../style/admin/login.module.css';
import logo from '../images/logo_login.png';

// Se crean las constantes que guardan estilos css del login
export const buttonStyle = {
    backgroundColor: '#822727',
    color: 'white',
    width: '150px',
    height: '60px',
    borderRadius: '20px',
    marginTop: '1rem',
    marginLeft: '5rem',
    border: "transparent"
};
export const title = {
    color: 'white',
    fontSize: '46pt',
    fontWeight: '700',
    marginLeft: '3rem',
    marginBottom: '3rem'
};
export const logoStyle = {
    marginTop: '3rem',
    marginLeft: '1rem',
    width: '30px',
    height: '30px',
    marginBottom: '3rem'
};


// Se carga el modulp del login 
function Login() {
    // Constante navigate para navegar entre paginas
    const navigate = useNavigate();

    // Constante para interactuar con el auth context
    const {login} = useAuth();

    // Se declaran los estados para el email y la contraseña del usuario
    const [mail, setmail] = useState('');
    const [password, setpassword] = useState('');

    // Se crea el metodo para el evento de envio del formulario  del login
    const submitHandler = async (e) => {
        e.preventDefault();
        // Metodo para validar campos vacios del login
        if (mail.trim() !== '' && password.trim() !== '') {
            // Se ejecuta el meto de autenticacion en correo y contraseña del usuario de firebase
            try {
                await login(mail, password);
                toast.success('Iniciaste sesión correctamente');
                navigate('/dashboard');
            } catch(error) {
                if (error.code === 'auth/wrong-password') {
                    toast.error('Contraseña incorrecta.');
                } else if (error.code === 'auth/user-not-found') {
                    toast.error('El usuario no existe.');
                } else if (error.code === 'auth/invalid-email') {
                    toast.error('El correo no es válido.');
                } else if (error.code === 'auth/too-many-requests') {
                    toast.error('Demasiados intentos fallidos. Por favor intente más tarde.');
                } else if (error.code === 'auth/network-request-failed') {
                    toast.error('Error de red. Por favor intente más tarde.');
                } else if (error.code === 'auth/app-deleted') {
                    toast.error('La aplicación se ha eliminado. Por favor contacte con su proveedor');
                }
            };
        } else {
            toast.error('Debe llenar todos los campos vacios');
            return;
        }
    }
    return (
        <div>
            <div className={style.signup} id="contained-signup">
                <div className={style.top_signup}>
                    <div className={style.logo}>
                        <img src={logo} style={logoStyle} alt="" />
                    </div>
                    <div className={style.text}>
                        <h4 style={{ color: '#A3A3A3', marginLeft: '3rem' }}>WELCOME TO <span style={{ color: '#822727' }}>AUTORECT</span></h4>
                        <p style={title}>Let's login to your account <span style={{ color: '#822727' }}>.</span></p>
                    </div>
                </div>
            </div>
            <div className={style.textlogin} >
                <form id="form_login" method="post" className={style.formlogin} onSubmit={submitHandler}>
                    <div className={style.input_data}>
                        <input type="text" name="Email" onChange={(e) => setmail(e.target.value)} required />
                        <div className={style.underline}></div>
                        <label>Email</label>
                    </div>
                    <div className={style.input_data} id="pass" style={{ marginTop: '2rem' }}>
                        <input type="password" name="clave" onChange={(e) => setpassword(e.target.value)} required />
                        <div className={style.underline}></div>
                        <label>Password</label>
                    </div>
                    <div className={style.endlogin}>
                        <div className={style.forget} style={{ color: '#A3A3A3', marginTop: '0.75rem', marginLeft: '14rem' }}>
                            <a>Forgot password?</a>
                        </div>
                        <div className={style.buttons}>
                            <Button id="btnlogin" type="submit" size="xxl" style={buttonStyle}>Login</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;