// Se importa el useState de react
import { useState } from "react";
// Se importa firebase
import firebaseApp from "../server/server_config";
// Se importan los modulos de autenticacion necesarios de firebase autentication
import { signOut, getAuth } from "firebase/auth";

//Se importan la iconografia a utilizar desde react-icons
import { FaHouseChimney, FaCircleUser, FaUserGroup, FaBookmark, FaClipboardUser, FaCarBattery, FaCartFlatbed, FaArrowRightToBracket, FaAngleRight, FaAngleLeft } from "react-icons/fa6";
//Se importan los objetos a utilizar desde la libreria de bootstrap
import { Button, Dropdown } from "react-bootstrap"
//Se importan las notificaciones toast desde la libreria react-hot-toast
import toast from "react-hot-toast";

// Se importan los estilos css
import "../style/admin/menu.css";
import "../style/admin/admin.css";

// Se importa el contenido mostrado por defecto en el dashboard
import Dashboard from "./main.js";
//Se importa el logo de la aplicacion 
import logo from "../images/logo_login.png";

//Se crea la constante encargada de interactuar con la base de datos
const auth = getAuth(firebaseApp);

// Funcion que maneja todo el contenido principal
function Account() {

    //Se crea la variable de estado cuando el usuario desplaza el mouse por encima de un objeto
    const [Hovered, setHovered] = useState(null);
    // Se crea la variable encargada de manejar el esatado del sidebar
    const [navHidden, setnavHidden] = useState(null);
    // Se crea la variable que se encarga de mostrar el contenido seleccionado por el usuario
    const [contentHandler, setContentHandler] = useState(null);

    //Se crean las variables de estilos a utilizar
    const navItem = {
        color: "white",
        border: "none",
        backgroundColor: "transparent",
        marginLeft: "5px",
        marginRight: "5px",

    }

    const navItemHover = {
        color: "#1F1F1F",
        border: "none",
        backgroundColor: "white",
        marginLeft: "5px",
        marginRight: "5px",
    }

    const nav = {
        transform: navHidden ? "translateX(-80%)" : "translateX(0)",
        height: "100vh",
        transition: "transform 0.5s ease-in-out",
    }

    const dropdownStyle = {
        backgroundColor: "#1F1F1F",
        color: "white",
        width: "auto",
        height: "auto",
        fontSize: "1rem"
    }

    const dropdownItem = {
        fontSize: "1rem"
    }


    // Funcion encargada de mostrar el contenido de la pagina
    const handleContentChange = (e) => {
        switch (contentHandler) {
            case 'dashboard': 
                return <Dashboard />;
            case 'administradores':
                return <h1>Administradores</h1>;
            case 'usuarios':
                return <h1>Usuarios</h1>;
            default:
                return <Dashboard />;
        }
    }

    // Funcion encargada de manejar el cambio de estado del sidebar
    const ToggleNav = () => {
        setnavHidden(!navHidden);
        console.log(navHidden);
    }

    // Se carga el contenido del dashboard
    return (
        <div style={{ backgroundColor: "white" }}>
            <div style={{ display: "inline-flex" }}>
    {/* Se carga el menu del sistema (sidebar) */}
                <aside>
                    <div style={nav}>
                        <ul className="nav flex-column">
                            <div className="topnav">
                                <div className="image" >
                                    <img src={logo} alt="" />
                                </div>
                                <div className="btn">
                                    <Button onClick={ToggleNav} style={{ padding: "7px", borderRadius: "30px" }}>{navHidden ? <FaAngleRight/> : <FaAngleLeft/>}</Button>
                                </div>
                            </div>

                            <div className="sidebar" style={{ display: "grid", justifyContent: "center", alignContent: "space-between" }}>
                                <Button title="Dashboard" type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Dashboard" onClick={() => setContentHandler('dashboard')} onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)} style={(Hovered === 1) ? navItemHover : navItem} >
                                    <div style={{ marginTop: "5px", marginBottom: "5px", display: "grid", justifyContent: "center" }} >
                                        <FaHouseChimney size={"1.5rem"} />
                                    </div>
                                </Button>
                                <Button title="Administradores" type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Users" onClick={() => setContentHandler('administradores')} onMouseOver={() => setHovered(2)} onMouseLeave={() => setHovered(null)} style={(Hovered === 2) ? navItemHover : navItem} >
                                    <div style={{ marginTop: "5px", marginBottom: "5px", justifyContent: "center" }}>
                                        <FaClipboardUser size={"1.75rem"} />
                                    </div>
                                </Button>
                                <Dropdown>
                                    <Dropdown.Toggle title="Clientes" onMouseOver={() => setHovered(3)} onMouseLeave={() => setHovered(null)} style={(Hovered === 3) ? navItemHover : navItem}>
                                        <FaCircleUser size={"1.5rem"} style={{ marginTop: "3px", marginBottom: "3px" }} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={dropdownStyle}>
                                        <Dropdown.Item style={dropdownItem}>Clientes</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem}>Encargados</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem}>Valoraciones</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown>
                                    <Dropdown.Toggle title="Usuarios" onMouseOver={() => setHovered(4)} onMouseLeave={() => setHovered(null)} style={(Hovered === 4) ? navItemHover : navItem}>
                                        <FaUserGroup size={"1.5rem"} style={{ marginTop: "3px", marginBottom: "3px" }} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={dropdownStyle}>
                                        <Dropdown.Item style={dropdownItem}>Usuarios</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem}>Carritos</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem}>Productos guardados</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown>
                                    <Dropdown.Toggle title="Marcas" onMouseOver={() => setHovered(5)} onMouseLeave={() => setHovered(null)} style={(Hovered === 5) ? navItemHover : navItem}>
                                        <FaBookmark size={"1.5rem"} style={{ marginTop: "3px", marginBottom: "3px" }} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={dropdownStyle}>
                                        <Dropdown.Item style={dropdownItem}>Marcas</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem}>Modelos</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown>
                                    <Dropdown.Toggle title="Pedidos" onMouseOver={() => setHovered(6)} onMouseLeave={() => setHovered(null)} style={(Hovered === 6) ? navItemHover : navItem}>
                                        <FaCartFlatbed size={"1.5rem"} style={{ marginTop: "3px", marginBottom: "3px" }} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={dropdownStyle}>
                                        <Dropdown.Item style={dropdownItem}>Pedidos</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem}>Detalle pedidos</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Button title="Productos" type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Products" onMouseOver={() => setHovered(7)} onMouseLeave={() => setHovered(null)} style={(Hovered === 7) ? navItemHover : navItem} >
                                    <div style={{ marginTop: "5px", marginBottom: "5px", justifyContent: "center" }}>
                                        <FaCarBattery size={"1.5rem"} />
                                    </div>
                                </Button>
                            </div>
                            <div className="bottomnav">
                                <Button title="Cerrar sesión" type="button" className="btn" data-bs-toggle="tooltip" style={{ backgroundColor: "#822727", color: "white", border: "none" }} onClick={() => signOut(auth) && toast.success('Sesion cerrada exitosamente')} data-bs-placement="right" data-bs-title="Log-Out">
                                    <div style={{ marginTop: "7px", marginBottom: "7px" }}>
                                        <FaArrowRightToBracket size={"1.5rem"} />
                                    </div>
                                </Button>
                            </div>
                        </ul>
                    </div>
                </aside>
    {/*  Se carga el contenido de la pagina dependiendo de la funcion handleContentChange  */}               
                 <main style={{marginLeft: "5vh", width: "auto"}}>
                    {handleContentChange()}
                </main>
            </div>
        </div>
    );
}

export default Account;