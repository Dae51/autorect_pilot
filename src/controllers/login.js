// Se importa el estado incial de react
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Se importa el modulo que carga la conexion a firebase
import firebaseApp from "../server/server_config";
// Se importa el metodo de autenticacion de firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


// Se crea la constante donde se guarda la autenticacion del usuario
const auth = getAuth(firebaseApp);

// Se carga el modulp del login 
function Login() {
    // Constante navigate para navegar entre paginas
    const navigate = useNavigate();

    // Se declaran los estados para el email y la contraseña del usuario
    const [mail, setmail] = useState('');
    const [password, setpassword] = useState('');

    // Se crea el metodo para el evento de envio del formulario  del login
    function submitHandler(e) {
        e.preventDefault();
        // Metodo para validar campos vacios del login
        if (mail.trim() !== '' && password.trim() !== '') {
            // Se ejecuta el meto de autenticacion en correo y contraseña del usuario de firebase
            signInWithEmailAndPassword(auth, mail, password).then(() => {
                navigate('./views/dashboard');
                //Metodo que gestiona los errores del login
            }).catch(error => {
                console.log('Error al iniciar sesion:', error);
                if (error.code === 'auth/wrong-password') {
                    alert('Contraseña incorrecta.');
                } else if (error.code === 'auth/user-not-found') {
                    alert('El usuario no existe.');
                } else if (error.code === 'auth/invalid-email') {
                    alert('El correo no es válido.');
                } else if (error.code === 'auth/too-many-requests') {
                    alert('Demasiados intentos fallidos. Por favor intente más tarde.');
                } else if (error.code === 'auth/network-request-failed') {
                    alert('Error de red. Por favor intente más tarde.');
                } else if (error.code === 'auth/app-deleted') {
                    alert('La aplicación se ha eliminado. Por favor contacte con su proveedor');
                }
            });
        } else {
            alert('Todos los campos son obligatorios');
            return;
        }
    }
    return (
        <div className="textlogin">
            <div className="signup" id="contained-signup">
                <div className="top_signup">
                    <div className="logo">
                        <img src="./images/logo_login.png" alt="" />
                    </div>
                    <div className="text">
                        <h5>WELCOME TO <span>AUTORECT</span></h5>
                        <p>Let's login to your account <span>.</span></p>
                    </div>
                </div>
            </div>
            <form id="form_login" method="post" className="formlogin" onSubmit={submitHandler}>
                <div className="input-data">
                    <input type="text" name="Email" onChange={(e) => setmail(e.target.value)} required />
                    <div className="underline"></div>
                    <label>Email</label>
                </div>
                <div className="input-data" id="pass">
                    <input type="password" name="clave" onChange={(e) => setpassword(e.target.value)} required />
                    <div className="underline"></div>
                    <label>Password</label>
                </div>
                <div className="endlogin">
                    <div className="forget">
                        <a>Forgot password?</a>
                    </div>
                    <div className="buttons">
                        <button id="btnlogin" type="submit">Login</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login;