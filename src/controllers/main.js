// Se importa el estado inicial de react
import { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';

import firebaseApp from "../server/server_config";
import { getAuth, signOut } from "firebase/auth";
import { user } from '../App';
import Account from "./account";

import toast from 'react-hot-toast';
import {Button} from "react-bootstrap";
import {FaEllipsisVertical, FaUserLarge, FaStar, FaStarHalfStroke, FaStarHalf} from "react-icons/fa6";

import '../style/admin/admin.css';
import '../style/admin/menu.css';
 

const auth = getAuth(firebaseApp);

function Dashboard() {

    return (
        <div style={{ backgroundColor: 'white' }}>
            <div className="allinfo">
                <aside id="mainsidebar">
                    <Account/>
                </aside>
                <main className="datasection-main">
                    <section>
                        <div className="topmain">
                            <div className="text">
                                <p>DASHBOARD</p>
                            </div>
                            <div className="btnmain">
                                <Button className="btndashboard">Daily</Button>
                                <Button className="btndashboard">Weekly</Button>
                                <Button className="btndashboard">Monthly</Button>
                                <Button className="user" style={{display:'flex', justifyContent: 'space-between'}}>
                                    <div>
                                        <FaUserLarge/><FaEllipsisVertical/>
                                    </div>
                                </Button>
                            </div>
                        </div>
                        <div className="datainfo">
                            <div className="row">
                                <div className="col">
                                    <p>STORE RATING</p>
                                    <p className="number">4.5<span>/5</span></p>
                                    <div className="stars">
                                        <FaStar/>
                                        <FaStar/>
                                        <FaStar/>
                                        <FaStar/>
                                        <FaStarHalf/>
                                    </div>
                                </div>
                                <div className="col">
                                    <p>TOTAL INCOME</p>
                                    <p className="number">4,540.98 <span>USD</span></p>
                                    <p className="green">+5% <i className="bx bxs-up-arrow"></i></p>
                                </div>
                                <div className="col">
                                    <p>TOTAL ORDERS</p>
                                    <p className="number">4,120</p>
                                    <p className="green">+3% <i className="bx bxs-up-arrow"></i></p>
                                </div>
                                <div className="col">
                                    <p>NEW CLIENTS</p>
                                    <p className="number">516</p>
                                    <p className="red">-2% <i className="bx bxs-down-arrow"></i></p>
                                </div>
                            </div>
                        </div>
                        <div className="bottommain">
                            <div className="grafics1">
                                <div className="container-grafic">
                                    <h3>Usuarios por tipo</h3>
                                    <div className="grafic">
                                        <canvas id="chart1P"></canvas>
                                    </div>
                                </div>
                                <div className="container-grafic">
                                    <h3>Modelos por marcas</h3>
                                    <div className="grafic">
                                        <canvas id="chart3P"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div className="grafics2">
                                <div className="container-grafic">
                                    <h3>Pedidos por estado</h3>
                                    <div className="grafic">
                                        <canvas id="chart2P"></canvas>
                                    </div>
                                </div>
                                <div className="container-grafic">
                                    <h3>Estado de los clientes</h3>
                                    <div className="grafic">
                                        <canvas id="chart4P"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div className="grafics3">
                                <div className="big-grafic">
                                    <h3>Pedidos finalizados en la semana</h3>
                                    <div className="lineGraph">
                                        <canvas id="chartLine"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <h1>
                <button onClick={() => signOut(auth) && toast.success('Sesion cerrada exitosamente')}> Cerrar sesion</button>
            </h1>
        </div>
    );

}

export default Dashboard;