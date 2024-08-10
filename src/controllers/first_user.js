import React, { useState } from "react";

function First() {
    const [nombre, setNombreNegocio] = useState('');
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');

        function submitHandler(e) {
            e.preventDefault();
            const CLIENTEDATA = {
                nombre: nombre,
                correo: correo,
                clave: clave,
                telefono: telefono,
                direccion: direccion
              };
            console.log(CLIENTEDATA);
        }
    return (
        <div className="signup" id="contained-signup">
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
                        <input type="text" required id='correo' onChange={(e) => setCorreo(e.target.value)}/>
                        <div className="underline"></div>
                        <label>Correo</label>
                    </div>
                    <div className="input-data">
                        <input type="password" required id="clave" onChange={(e) => setClave(e.target.value)}/>
                        <div className="underline"></div>
                        <label>Password</label>
                    </div>
                    <div className="input-data">
                        <input type="text" required id="telefono" onChange={(e)=> setTelefono(e.target.value)}/>
                        <div className="underline"></div>
                        <label>Telefono</label>
                    </div>
                    <div className="input-data">
                        <textarea className="form-control" id='direccion' required onChange={(e)=> setDireccion(e.target.value)}></textarea>
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