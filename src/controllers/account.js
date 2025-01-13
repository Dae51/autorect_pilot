// Se importa el useState de react
import { useState, useEffect } from "react";
// Se importa firebase
import firebaseApp from "../server/server_config";
// Se importan los modulos de autenticacion necesarios de firebase autentication
import { useAuth } from "./components/authContext.js"
//Se importan la iconografia a utilizar desde react-icons
import { FaHouseChimney, FaCircleUser, FaUserGroup, FaBookmark, FaClipboardUser, FaCarBattery, FaCartFlatbed, FaArrowRightFromBracket, FaAngleRight, FaAngleLeft } from "react-icons/fa6";
//Se importan los objetos a utilizar desde la libreria de bootstrap
import { Button, Dropdown } from "react-bootstrap"
//Se importan las notificaciones toast desde la libreria react-hot-toast
import toast from "react-hot-toast";

// Se importan los estilos css
import "../style/admin/menu.css";
import "../style/admin/admin.css";

// Se importa el contenido mostrado por defecto en el dashboard
import Dashboard from "./main.js";

import Admin from "./admin.js";

import Category from "./categories.js";

import Client from "./clientes.js";

import Managers from "./managers.js";

import Brands from "./brands.js";

import Models from "./models.js";

import User from "./users.js";

import Review from "./reviews.js";

import Cart from "./cart.js";

import Saved from "./savedProducts.js";

import Product from "./product.js";

import Orders from "./orders.js";

//Se importa el logo de la aplicacion 
import logo from "../images/logo_login.png";


// Funcion que maneja todo el contenido principal
function Account() {

    const { logout } = useAuth();

    const { currentUser } = useAuth();


    useEffect(() => {
        if (currentUser.level == "administrador") {
            setHide(false);
            return;
        }
        else if (currentUser.level == "cliente") {
            setHide(true);
            return;
        }
        else {
            toast.error('No existe ninguna sesion.');
            logout();
            return;
        }
    }, [currentUser])

    //Se crea la variable de estado cuando el usuario desplaza el mouse por encima de un objeto
    const [Hovered, setHovered] = useState(null);
    // Se crea la variable encargada de manejar el esatado del sidebar
    const [navHidden, setnavHidden] = useState(null);
    // Se crea la variable que se encarga de mostrar el contenido seleccionado por el usuario
    const [contentHandler, setContentHandler] = useState(null);

    const [hide, setHide] = useState(null);

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

    /*   const handleAcces = () => {
          switch(currentUser.level) {
              case 'cliente':
  
              
          }
      } 
   */
    // Funcion encargada de mostrar el contenido de la pagina
    const handleContentChange = (e) => {
        switch (contentHandler) {
            case 'dashboard':
                return <Dashboard />;
            case 'administradores':
                if (currentUser.level == "administrador") {
                    return <Admin />;
                } else {
                    toast.error("No tienes permisos para acceder a esta sección");
                    setContentHandler('dashboard');
                    return null;
                }
            case 'category':
                if (currentUser.level == "administrador") {
                    return <Category />;
                } else {
                    toast.error("No tienes permisos para acceder a esta sección");
                    setContentHandler('dashboard');
                    return null;
                }
            case 'client':
                if (currentUser.level == "administrador") {
                    return <Client />;
                } else {
                    toast.error("No tienes permisos para acceder a esta sección");
                    setContentHandler('dashboard');
                    return null;
                }
            case 'manager':
                return <Managers />;
            case 'brand':
                if (currentUser.level == "administrador") {
                    return <Brands />;
                } else {
                    toast.error("No tienes permisos para acceder a esta sección");
                    setContentHandler('dashboard');
                    return null;
                }
            case 'model':
                if (currentUser.level == "administrador") {
                    return <Models />;
                } else {
                    toast.error("No tienes permisos para acceder a esta sección");
                    setContentHandler('dashboard');
                    return null;
                }
            case 'user':
                if (currentUser.level == "administrador") {
                    return <User />;
                } else {
                    toast.error("No tienes permisos para acceder a esta sección");
                    setContentHandler('dashboard');
                    return null;
                }
            case 'review':
                return <Review />;
            case 'cart':
                if (currentUser.level == "administrador") {
                    return <Cart />;
                } else {
                    toast.error("No tienes permisos para acceder a esta sección");
                    setContentHandler('dashboard');
                    return null;
                }
            case 'saved':
                if (currentUser.level == "administrador") {
                    return <Saved />;
                } else {
                    toast.error("No tienes permisos para acceder a esta sección");
                    setContentHandler('dashboard');
                    return null;
                }
            case 'product':
                return <Product />;
            case 'orders':
                return <Orders />;
            default:
                return <Dashboard />;
        }
    }

    // Funcion encargada de manejar el cambio de estado del sidebar
    const ToggleNav = () => {
        setnavHidden(!navHidden);
    }

    // Se carga el contenido del dashboard
    return (
        <div style={{ backgroundColor: "white" }}>
            <div style={{ display: "block" }}>
                {/* Se carga el menu del sistema (sidebar) */}
                <aside>
                    <div style={nav}>
                        <ul className="nav flex-column">
                            <div className="topnav">
                                <div className="image" >
                                    <img src={logo} alt="" />
                                </div>
                                <div className="btn">
                                    <Button onClick={ToggleNav} style={{ padding: "7px", borderRadius: "30px" }}>{navHidden ? <FaAngleRight /> : <FaAngleLeft />}</Button>
                                </div>
                            </div>

                            <div className="sidebar" style={{ display: "grid", justifyContent: "center", alignContent: "space-between" }}>
                                <Button title="Dashboard" type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Dashboard" onClick={() => setContentHandler('dashboard')} onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)} style={(Hovered === 1) ? navItemHover : navItem} >
                                    <div style={{ marginTop: "5px", marginBottom: "5px", display: "grid", justifyContent: "center" }} >
                                        <FaHouseChimney size={"1.5rem"} />
                                    </div>
                                </Button>
                                <Button title="Administradores" type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Users" onClick={() => setContentHandler('administradores')} onMouseOver={() => setHovered(2)} onMouseLeave={() => setHovered(null)} style={hide ? { display: "none" } : (Hovered === 2) ? navItemHover : navItem} >
                                    <div style={{ marginTop: "5px", marginBottom: "5px", justifyContent: "center" }}>
                                        <FaClipboardUser size={"1.75rem"} />
                                    </div>
                                </Button>
                                <Dropdown>
                                    <Dropdown.Toggle title="Clientes" onMouseOver={() => setHovered(3)} onMouseLeave={() => setHovered(null)} style={(Hovered === 3) ? navItemHover : navItem}>
                                        <FaCircleUser size={"1.5rem"} style={{ marginTop: "3px", marginBottom: "3px" }} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={dropdownStyle}>
                                        <Dropdown.Item style={hide ? { display: "none" } : dropdownItem} onClick={() => setContentHandler('client')}>Clientes</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem} onClick={() => setContentHandler('manager')}>Encargados</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem} onClick={() => setContentHandler('review')}>Valoraciones</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown style={hide ? { display: "none" } : {}}>
                                    <Dropdown.Toggle title="Usuarios" onMouseOver={() => setHovered(4)} onMouseLeave={() => setHovered(null)} style={(Hovered === 4) ? navItemHover : navItem}>
                                        <FaUserGroup size={"1.5rem"} style={{ marginTop: "3px", marginBottom: "3px" }} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={dropdownStyle}>
                                        <Dropdown.Item style={dropdownItem} onClick={() => setContentHandler('user')}>Usuarios</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem} onClick={() => setContentHandler('cart')}>Carritos</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem} onClick={() => setContentHandler('saved')}>Productos guardados</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown style={hide ? { display: "none" } : dropdownItem}>
                                    <Dropdown.Toggle title="Marcas" onMouseOver={() => setHovered(5)} onMouseLeave={() => setHovered(null)} style={(Hovered === 5) ? navItemHover : navItem}>
                                        <FaBookmark size={"1.5rem"} style={{ marginTop: "3px", marginBottom: "3px" }} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={dropdownStyle}>
                                        <Dropdown.Item style={dropdownItem} onClick={() => setContentHandler('brand')}>Marcas</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem} onClick={() => setContentHandler('model')}>Modelos</Dropdown.Item>
                                        <Dropdown.Item style={dropdownItem} onClick={() => setContentHandler("category")}>Categories</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Button title="pedidos" type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Users" onClick={() => setContentHandler('orders')} onMouseOver={() => setHovered(6)} onMouseLeave={() => setHovered(null)} style={hide ? { display: "none" } : (Hovered === 6) ? navItemHover : navItem} >
                                    <div style={{ marginTop: "5px", marginBottom: "5px", justifyContent: "center" }}>
                                        <FaCartFlatbed size={"1.75rem"} />
                                    </div>
                                </Button>
                                <Button title="Productos" onClick={() => setContentHandler('product')} type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Products" onMouseOver={() => setHovered(7)} onMouseLeave={() => setHovered(null)} style={(Hovered === 7) ? navItemHover : navItem} >
                                    <div style={{ marginTop: "5px", marginBottom: "5px", justifyContent: "center" }}>
                                        <FaCarBattery size={"1.5rem"} />
                                    </div>
                                </Button>
                            </div>
                            <div className="bottomnav">
                                <Button title="Cerrar sesión" type="button" className="btn" data-bs-toggle="tooltip" style={{ backgroundColor: "#822727", color: "white", border: "none" }} onClick={() => logout() && toast.success('Sesion cerrada exitosamente')} data-bs-placement="right" data-bs-title="Log-Out">
                                    <div style={{ marginTop: "7px", marginBottom: "7px" }}>
                                        <FaArrowRightFromBracket size={"1.5rem"} />
                                    </div>
                                </Button>
                            </div>
                        </ul>
                    </div>
                </aside>
                {/*  Se carga el contenido de la pagina dependiendo de la funcion handleContentChange  */}
                <main style={{ width: "auto", height: "100vh", marginLeft: "9%", overflowY: "scroll", overflowX: "hidden" }}>
                    {handleContentChange()}
                </main>
            </div>
        </div>
    );
}

export default Account;