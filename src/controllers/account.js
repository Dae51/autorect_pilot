import { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import firebaseApp from "../server/server_config";
import { signOut, getAuth } from "firebase/auth";

import { FaSquare, FaCircleUser, FaUserGroup, FaChild, FaCarBattery, FaCartFlatbed, FaBookBookmark, FaInbox, FaArrowRightToBracket, FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { Button } from "react-bootstrap"
import toast from "react-hot-toast";

import style from "../style/admin/menu.css";
import logo from "../images/logo_login.png";
import { BsTransparency } from "react-icons/bs";
const auth = getAuth(firebaseApp);

function Account() {

    const navItem = {
        color: "white",
        border: "none",
        backgroundColor: "transparent"
    }
    
    return (
        <div style={{ height: "100%" }}>
            <div className="btnback" style={{ padding: "3.75rem", display: "none" }}>
                <Button onclick=""><FaAngleLeft /></Button>
            </div>
            <ul className="nav flex-column">
                <div className="topnav">
                    <div className="image" >
                        <img src={logo} alt=""/>
                    </div>
                    <div className="btn">
                        <Button onclick="" style={{padding: "7px", borderRadius: "30px"}}><FaAngleRight /></Button>
                    </div>
                </div>

                <div className="sidebar" style={{ display: "grid", justifyContent: "space-between" }}>
                    <Button type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Dashboard" style={navItem}>
                        <div style={{marginTop: "5px", marginBottom: "5px"}}>
                            <FaSquare size={"1.5rem"}/>
                        </div>
                    </Button>
                    <Button type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Users" style={navItem}>
                        <div style={{marginTop: "5px", marginBottom: "5px"}}>
                            <FaCircleUser size={"1.5rem"}/>
                        </div>
                    </Button>
                    <Button type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Employees" style={navItem}>
                        <div style={{marginTop: "5px", marginBottom: "5px"}}>
                            <FaUserGroup size={"1.5rem"}/>
                        </div>
                    </Button>
                    <Button type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Clients" style={navItem}>
                        <div style={{marginTop: "5px", marginBottom: "5px"}}>
                            <FaChild size={"1.5rem"}/>
                        </div>
                    </Button>
                    <Button type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Products" style={navItem}>
                        <div style={{marginTop: "5px", marginBottom: "5px"}}>  
                            <FaCarBattery size={"1.5rem"}/>
                        </div>
                    </Button>
                    <Button type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Orders" style={navItem}>
                        <div style={{marginTop: "5px", marginBottom: "5px"}}>  
                            <FaCartFlatbed size={"1.5rem"}/>
                        </div>
                    </Button>
                    <Button type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Categories" style={navItem}>
                        <div style={{marginTop: "5px", marginBottom: "5px"}}>
                            <FaBookBookmark size={"1.5rem"}/>
                        </div>
                    </Button>
                    <Button type="button" className="btn" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Brands" style={navItem}>
                        <div style={{marginTop: "5px", marginBottom: "5px"}}>
                            <FaInbox size={"1.5rem"}/>
                        </div>
                    </Button>
                </div>
                <div className="bottomnav">
                    <Button type="button" className="btn" data-bs-toggle="tooltip" style={{ backgroundColor: "#822727", color: "white", border: "none" }} onClick={() => signOut(auth) && toast.success('Sesion cerrada exitosamente')} data-bs-placement="right" data-bs-title="Log-Out">
                        <div style={{ marginTop: "7px", marginBottom: "7px" }}>
                            <FaArrowRightToBracket  size={"1.5rem"}/>
                        </div>
                    </Button>
                </div>
            </ul>
        </div>

    );
}

export default Account;