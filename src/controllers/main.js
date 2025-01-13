// Se importa el estado inicial de react
import { useState, useEffect } from "react";

//Se importa la conexion con firebase
import firebaseApp from "../server/server_config";
//Se importan los modulos para interactuar con los servicios de firebase authentication
import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";

// Se importan el objeto de bootstrap a utilizar
import { Button } from "react-bootstrap";

import { ResponsiveBar } from "@nivo/bar";

import { ResponsivePie } from "@nivo/pie";

import toast from "react-hot-toast";

// Se importa la iconografia a utilizar de la libreria react-icons
import { FaEllipsisVertical, FaUserLarge, FaStar, FaStarHalf } from "react-icons/fa6";

import { useAuth } from "./components/authContext";

// Se crea el objeto con el cual se interactua con firebase authetication
const auth = getAuth(firebaseApp);

// Funcion encargada de manejar todo el contenido mostrado en el dashboard
function Dashboard() {

    const { logout } = useAuth();

    const { currentUser } = useAuth();

    const [level, setLevel] = useState()

    const Navigate = useNavigate();

    useEffect(() => {
        if (currentUser == null) {
            toast.error('No existe ninguna sesion.');
            logout();
            return;
        } else if (currentUser.level === 'cliente') {
            setLevel(false);
            toast('Usted ha iniciado sesion como cliente', {
                icon: 'ℹ️'
            });
        } else if (currentUser.level === 'administrador') {
            setLevel(true);
            toast('Usted ha iniciado sesion como administrador', {
                icon: 'ℹ️'
            });
            return;
        } else {
            return null;
        }
    }, [currentUser]);

    const data = [
        { country: "USA", value: 120 },
        { country: "Germany", value: 90 },
        { country: "Japan", value: 150 },
        { country: "France", value: 80 },
    ];

    const data2 = [
        { id: "JavaScript", label: "JavaScript", value: 55, color: "#f4d03f" },
        { id: "Python", label: "Python", value: 25, color: "#45b39d" },
        { id: "Java", label: "Java", value: 15, color: "#eb984e" },
        { id: "C++", label: "C++", value: 5, color: "#5d6d7e" },
      ];

    const handleButtonClick = () => {
        Navigate('/settings');
    };

    return (
        <div>
            <section>
                <div className="topmain">
                    <div className="text">
                        <p>DASHBOARD</p>
                    </div>
                    <div className="btnmain">
                        <Button className="btndashboard">Daily</Button>
                        <Button className="btndashboard">Weekly</Button>
                        <Button className="btndashboard">Monthly</Button>
                        <Button className="user" style={{ display: 'flex', justifyContent: 'space-between' }} onClick={handleButtonClick}>
                            <div>
                                <FaEllipsisVertical /> <FaUserLarge />
                            </div>
                        </Button>
                        <p>{level ? currentUser.adminData?.alias : currentUser.ClientData?.nombre_negocio}</p>

                    </div>
                </div>
                <div className="datainfo">
                    <div className="row">
                        <div className="col">
                            <p>STORE RATING</p>
                            <p className="number">4.5<span>/5</span></p>
                            <div className="stars">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStarHalf />
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
                            <div className="">
                                <div style={{ height: "350px", width: "fit" }}>
                                    <ResponsiveBar
                                        data={data}
                                        keys={["value"]}
                                        indexBy="country"
                                        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                                        padding={0.3}
                                        valueScale={{ type: "linear" }}
                                        colors={{ scheme: "nivo" }}
                                        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                                        axisTop={null}
                                        axisRight={null}
                                        axisBottom={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: "País",
                                            legendPosition: "middle",
                                            legendOffset: 32,
                                        }}
                                        axisLeft={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: "Valor",
                                            legendPosition: "middle",
                                            legendOffset: -40,
                                        }}
                                        labelSkipWidth={12}
                                        labelSkipHeight={12}
                                        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                                        legends={[
                                            {
                                                dataFrom: "keys",
                                                anchor: "bottom-right",
                                                direction: "column",
                                                justify: false,
                                                translateX: 120,
                                                translateY: 0,
                                                itemsSpacing: 2,
                                                itemWidth: 100,
                                                itemHeight: 20,
                                                itemDirection: "left-to-right",
                                                itemOpacity: 0.85,
                                                symbolSize: 20,
                                            },
                                        ]}
                                        role="application"
                                        ariaLabel="Gráfico de barras interactivo"
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="container-grafic">
                            <h3>Modelos por marcas</h3>
                            <div className="">
                                <div style={{ height: "350px", width: "fit" }}>
                                    <ResponsivePie
                                        data={data2}
                                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                        innerRadius={0.5} // Tamaño del hueco en el centro
                                        padAngle={0.7} // Espaciado entre sectores
                                        cornerRadius={3} // Bordes redondeados
                                        activeOuterRadiusOffset={8} // Agrandar al pasar el mouse
                                        colors={{ datum: "data.color" }} // Usa colores definidos en los datos
                                        borderWidth={1}
                                        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                                        arcLinkLabelsSkipAngle={10} // Ángulo mínimo para mostrar la etiqueta del arco
                                        arcLinkLabelsTextColor="#333333"
                                        arcLinkLabelsThickness={2}
                                        arcLinkLabelsColor={{ from: "color" }}
                                        arcLabelsSkipAngle={10}
                                        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                                        legends={[
                                            {
                                                anchor: "bottom",
                                                direction: "row",
                                                justify: false,
                                                translateX: 0,
                                                translateY: 56,
                                                itemsSpacing: 0,
                                                itemWidth: 100,
                                                itemHeight: 18,
                                                itemTextColor: "#999",
                                                itemDirection: "left-to-right",
                                                itemOpacity: 1,
                                                symbolSize: 18,
                                                symbolShape: "circle",
                                                effects: [
                                                    {
                                                        on: "hover",
                                                        style: {
                                                            itemTextColor: "#000",
                                                        },
                                                    },
                                                ],
                                            },
                                        ]}
                                    />
                                </div>
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
        </div>
    );
}

export default Dashboard;