import { useState, useEffect } from "react";

// Se importan los servicios a usar de firestore
import { getFirestore, collection, getDocs, updateDoc, addDoc, getDoc, doc, deleteDoc, where, query } from "firebase/firestore";

// Se importa la conexion con el servidor
import firebaseApp from '../server/server_config';

import { usePagination, useTable } from 'react-table';

// Se importan los componentes de react-bootstrap que utilizaremos para el menu y la interfaz
import { Button, Dropdown, Modal, Table, Alert, Container, Row, Col } from "react-bootstrap"

// Se importan las notiificaciones 
import toast from "react-hot-toast";
// Se importa la iconografia de la libreria react-icons
import { FaMagnifyingGlass, FaCirclePlus, FaFileCircleQuestion, FaFilePen, FaTrashCan, FaXmark, FaFilePdf } from "react-icons/fa6"

import { pdf } from "@react-pdf/renderer"

import Invoice from './components/docs/bill.js';

// Se importa el validator
import { validateString } from "./validator";

import { useAuth } from "./components/authContext";

// Se importa el componente Select para los combobox en los formularios
import Select from 'react-select';

import DynamicSelect from './components/dynamicSelect.js'

// Se importan las hojas de estilo css
import "../style/admin/menu.css"
import "../style/admin/main.css"

// Se inicializan las constantes de los servicios de firebase
const db = getFirestore(firebaseApp);


// Funcion principal de la aplicacion
function Orders() {

    // Se establecen los estilos de los filtros
    const filters = {
        borderRadius: "30px",
        backgroundColor: "white",
        color: "black",
        border: "2px solid #D2D2D2",
        marginLeft: "3px"
    }

    // Se establecen las constantes encargadas de manejer estados importantes
    const [data, setData] = useState([]);
    const [numDocs, setNumDocs] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState(false);
    const [search, setSearch] = useState('');
    const [active, setActive] = useState(true);
    const [active2, setActive2] = useState(false);
    const [TableDefaults, setTableDefaults] = useState(false);

    const [modalState, setModalState] = useState(null);


    // Se inicializan las constantes de los datos del registro
    const [fecha, setFecha] = useState();
    const [monto, setMonto] = useState();
    const [direccion, setDireccion] = useState();
    const [usuario, setUsuario] = useState();
    const [usuarios, setUsuarios] = useState();
    const [docId, setDocId] = useState();
    const [productos, setProductos] = useState([]);

    const { currentUser } = useAuth();

    // Funcion que se encarga de cargar los usuarios para la tabla de contenido
    useEffect(() => {
        if (active == false) {
            fetchData('hidden')
        }
        else {
            fetchData();
            console.log(data);
        }
        fetchUsuarios();
    }, [search])

    // Funcion para cargar la tabla de contenido
    const fetchData = async (param) => {
        switch (param) {
            case 'hidden':
                try {
                    setTableDefaults(true)
                    const recordsRef = collection(db, "pedidos");
                    let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", false), where("usuario", "==", search))
                        : query(recordsRef, where("estado", "==", false));
                    const querySnapshot = await getDocs(q);
                    const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setNumDocs(querySnapshot.size);
                    setData(docsData);
                    if (numDocs < 10) {
                        setNumDocs(`0${querySnapshot.size}`);
                    } else if (numDocs > 10) {
                        setNumDocs(querySnapshot.size);
                    };
                } catch (error) {
                    toast.error("No se han podido cargar los datos de la tabla:", error);
                };
                break;
            default:
                if (currentUser.level == "administrador") {
                    try {
                        setTableDefaults(false)
                        const recordsRef = collection(db, "pedidos");
                        let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", true), where("usuario", "==", search))
                            : query(recordsRef, where("estado", "==", true));
                        const querySnapshot = await getDocs(q);
                        const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                        setNumDocs(querySnapshot.size);
                        setData(docsData);
                        if (numDocs < 10) {
                            setNumDocs(`0${querySnapshot.size}`);
                        } else if (numDocs >= 10) {
                            setNumDocs(querySnapshot.size);
                        };
                    } catch (error) {
                        toast.error("No se han podido cargar los datos de la tabla:", error);
                    };
                } else {
                    try {
                        setTableDefaults(false);
                        const recordsRef = collection(db, "pedidos");

                        // Construir la consulta básica
                        let q = search.trim() !== ""
                            ? query(recordsRef, where("estado", "==", true), where("usuario", "==", search))
                            : query(recordsRef, where("estado", "==", true));

                        const querySnapshot = await getDocs(q);

                        // Filtrar los documentos que contengan 'productos.tienda == "nombre_negocio"'
                        const docsData = querySnapshot.docs
                            .map((doc) => ({ id: doc.id, ...doc.data() })) // Extraer datos de los documentos
                            .filter((doc) =>
                                doc.productos?.some((producto) => producto.tienda === `${currentUser.ClientData?.nombre_negocio}`)
                            );

                        // Actualizar estado con los documentos filtrados
                        setNumDocs(docsData.length);
                        setData(docsData);

                        if (docsData.length < 10) {
                            setNumDocs(`0${docsData.length}`);
                        } else if (docsData.length >= 10) {
                            setNumDocs(docsData.length);
                        }
                    } catch (error) {
                        toast.error("No se han podido cargar los datos de la tabla:", error);
                    }
                }
                break;
        }
    };

    // Funcion para cargar los datos de las marcas de carros
    const fetchUsuarios = async () => {
        try {
            const Ref = collection(db, "usuarios");
            const querySnapshot = await getDocs(Ref);

            // Formatear los datos en el formato requerido por SearchableDropdown
            const formattedOptions = querySnapshot.docs.map((doc) => ({
                label: doc.data().userData?.alias,
                value: doc.id // Cambia 'nombre' según tu estructura en Firestore
            }));

            setUsuarios(formattedOptions);
        } catch (error) {
            toast.error("Error al cargar los datos de Firestore");
        }
    };

    const fetchPedidoById = async (docId) => {
        try {
            const docRef = doc(db, "pedidos", docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const items = Array.isArray(data.productos) ? data.productos.map(producto => ({
                    nombre: producto.producto || '',
                    tienda: producto.tienda || '',
                    cantidad: parseInt(producto.cantidad, 10) || 0,
                    precioUnitario: parseFloat(producto.precio) || 0.00
                })) : [];

                const subtotal = items.reduce((sum, item) => sum + (item.precioUnitario + item.precioUnitario), 0);
                const impuestos = subtotal * 0.13
                const total = subtotal + impuestos

                return {
                    usuario: data.usuario || '',
                    direccion: data.direccion || '',
                    fecha: data.fecha || '',
                    subtotal: subtotal,
                    impuestos: impuestos,
                    total: total,
                    items: items
                };
            } else {
                console.error("No such document!");
                toast.error("No se encontró el pedido en Firestore");
                return null;
            }
        } catch (error) {
            console.error("Error fetching pedido: ", error);
            toast.error("Error al cargar el pedido de Firestore");
            return null;
        }
    };

    //Funcion para guardar el valor del combobox
    const handleUsuarios = (option) => {
        setUsuario(option)
    };

    // Funcion que se encarga de mostrar el modal
    const handleShow = (content) => {
        setModalState(content);
        setShowModal('true');
    }

    // Funcion que maneja el cambio de las imagenes
    const handleSelections = (selections) => {
        setProductos(selections);
        console.log(productos);
    };

    // Funcion que se encarga de manejar el evento al momento de insertar datos 
    async function handleInsert(e) {
        e.preventDefault();
        if (validateString(direccion, {
            required: true,
            minLength: 10,
            maxLength: 100,
            forbiddenChars: "!@#$%^&*()"
        }) && fecha && monto && usuario && productos) {
            try {
                // Guardar los datos en Firestore
                const docRef = await addDoc(collection(db, 'pedidos'), {
                    fecha: fecha,
                    direccion: direccion,
                    monto_final: monto,
                    usuarioRef: `/usuarios/${usuario.value}`,
                    usuario: usuario.label,
                    productos: productos,
                    estado: true
                });

                // Mostrar mensaje de éxito
                toast.success("Pedido agregado exitosamente");
                setShowModal(false);
                fetchData(); // Actualiza la vista o datos en la interfaz

            } catch (error) {
                toast.error("No se pudo agregar el producto. Intente de nuevo.");
            }
        } else {
            toast.error("Asegurese de que todos los campos sean validos.");
        };
    };

    // Funcion que maneja la actualización de datos
    const handleUpdate = async (e) => {
        e.preventDefault();
        // Se validan los campos del form
        if (validateString(direccion, {
            required: true,
            minLength: 10,
            maxLength: 100,
            forbiddenChars: "!@#$%^&*()"
        }) && fecha && monto && usuario && productos) {

            // Actualizar los datos del documento del usuario en Firestore
            try {
                const userDocRef = doc(db, "pedidos", docId);
                await updateDoc(userDocRef, {
                    fecha: fecha,
                    direccion: direccion,
                    monto_final: monto,
                    usuarioRef: `/usuarios/${usuario.value}`,
                    usuario: usuario.label,
                    productos: productos,
                    estado: true
                });

                // Se muestra un mensaje de éxito al actualizar el usuario y se cierra el modal
                toast.success('Pedido actualizado con éxito.');
                setShowModal(false);
                fetchData();
            } catch (error) {
                toast.error('Error al actualizar el pedido.');
            }
        }
        else {
            toast.error('Ha ocurrido un error al actualizar los datos del pedido.');
        }
    }

    // Funcion para cargar los datos del documento en el form al abrir seleccionar actualizar 
    function LoadUpdate(id) {
        // Obtener la referencia al documento en la colección "encargados" usando el id
        const docRef = doc(db, "pedidos", id);
        // Obtener los datos del documento
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Asignar valores a los campos en el modal
                setMonto(data.monto_final || "");
                setFecha(data.fecha || "");
                setDireccion(data.direccion || "")
                setUsuario({ label: data.usuario || "", value: data.usuarioRef || "" });
                setDocId(docSnap.id || "");
                // Mostrar el modal para actualizar el documento
                handleShow('update');
            }
        }).catch((error) => {
            toast.error("Pedido no valido");
        });
    }

    // Funcion que se encarga de cargar los datos del usuario al seleccionar consultarlos
    function LoadData(id) {
        // Obtener la referencia al documento en la colección "productos" usando el id
        const docRef = doc(db, "pedidos", id);

        // Obtener los datos del documento
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Asignar valores a los campos en el modal
                setMonto(data.monto_final || "");
                setFecha(data.fecha || "");
                setDireccion(data.direccion || "");
                setUsuario({ label: data.usuario || "", value: data.usuarioRef || "" });
                setDocId(docSnap.id || "");

                // Cargar los productos en el array
                setProductos(data.productos || []);

                // Mostrar el modal para actualizar el documento
                handleShow('show');
            }
        }).catch((error) => {
            toast.error("Pedido no valido");
        });
    }


    // Funcion para limpiar los campos del formulario
    function clean() {
        if (docId == null) {
            try {
                document.getElementById('fecha').value = "";
                document.getElementById('monto').value = "";
                document.getElementById('direccion').value = "";
                setUsuario({ label: "", value: "" });
            } catch (error) {
                toast.error("Ha ocurrido un error al limpiar los campos");
            };
        } else {
            try {
                setFecha("");
                setMonto("");
                setDireccion("");
                setUsuario({ label: "", value: "" });
            } catch (error) {
                toast.error("Ha ocurrido un error al limpiar los campos");
            };
        }

    };

    // Funcion para manejar la eliminación de documentos
    async function handleDelete() {
        try {
            // Obtener la referencia al documento en la colección "productos"
            const docRef = doc(db, "pedidos", docId);

            // Obtener los datos del documento
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Eliminar el documento en Firestore
                await deleteDoc(docRef);

                toast.success('Producto eliminado con éxito.');
                setAlert(false);
                fetchData();
                setDocId(null);
            } else {
                toast.error('El registro que se está tratando de eliminar no existe');
            }
        } catch (error) {
            toast.error('Error al eliminar el registro o archivos relacionados.');
        }

    }

    // Funcion para mostrar la alerta
    async function AlertShow(id) {
        setAlert(true)
        setDocId(id);
    }

    const handleDownloadClick = async (docId) => {
        const pedidoData = await fetchPedidoById(docId);
        if (pedidoData) {
            const blob = await pdf(<Invoice invoiceData={pedidoData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'factura.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // Funcion que se encarga de cargar el contenido del modal dependiendo del evento 
    const handleModal = () => {
        switch (modalState) {
            // Se carga el contenido del caso "insert"
            case 'insert':
                return <div style={{ display: "flex" }} >
                    <div className="section1">
                        <div className="row">
                            <div className="col">
                                <div className="input-data">
                                    <input type="date" id="fecha" name="fecha" onChange={(e) => setFecha(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>fecha</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="number" id="monto" name="monto" onChange={(e) => setMonto(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Monto</label>
                                </div>
                            </div>
                            <div className="col" style={{ marginTop: "5px" }}>
                                <div className="combobox">
                                    <label>Usuario</label>
                                    <Select
                                        className="dropdown"
                                        value={usuario}
                                        onChange={handleUsuarios}
                                        options={usuarios}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="" style={{ width: "670px" }}>
                                <label>Direccion</label>
                                <textarea style={{ maxHeight: "23vh" }} className="form-control" aria-label="With textarea" id="direccion" name="direccion" onChange={(e) => setDireccion(e.target.value)} required></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginTop: "40px" }}>
                        <DynamicSelect onSelectionChange={handleSelections} />

                    </div>
                </div>;

            // Se carga el contenido del caso "update"
            case 'update':
                return <div style={{ display: "flex" }} >
                    <div className="section1">
                        <div className="row">
                            <div className="col">
                                <div className="input-data">
                                    <input type="date" id="fecha" name="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>fecha</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="number" id="monto" name="monto" value={monto} onChange={(e) => setMonto(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Monto</label>
                                </div>
                            </div>
                            <div className="col" style={{ marginTop: "5px" }}>
                                <div className="combobox">
                                    <label>Usuario</label>
                                    <Select
                                        className="dropdown"
                                        value={usuario}
                                        onChange={handleUsuarios}
                                        options={usuarios}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="" style={{ width: "670px" }}>
                                <label>Direccion</label>
                                <textarea style={{ maxHeight: "23vh" }} className="form-control" value={direccion} aria-label="With textarea" id="direccion" name="direccion" onChange={(e) => setDireccion(e.target.value)} required></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginTop: "40px" }}>
                        <DynamicSelect onSelectionChange={handleSelections} />

                    </div>
                </div>;
            case 'show':
                return <div style={{ display: "flex" }} >
                    <div className="section1">
                        <div className="row">
                            <div className="col">
                                <div className="input-data">
                                    <input type="date" id="fecha" name="fecha" disabled="true" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label style={{ marginBottom: "10px" }}>fecha</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="number" id="monto" name="monto" disabled="true" value={monto} onChange={(e) => setMonto(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label style={{ marginBottom: "10px" }}>Monto</label>
                                </div>
                            </div>
                            <div className="col" style={{ marginTop: "5px" }}>
                                <div className="combobox">
                                    <label>Usuario</label>
                                    <Select
                                        className="dropdown"
                                        value={usuario}
                                        onChange={handleUsuarios}
                                        options={usuarios}
                                        required
                                        isDisabled
                                    />
                                </div>
                            </div>
                            <div className="" style={{ width: "670px" }}>
                                <label>Direccion</label>
                                <textarea style={{ maxHeight: "23vh" }} value={direccion} disabled="true" className="form-control" aria-label="With textarea" id="direccion" name="direccion" onChange={(e) => setDireccion(e.target.value)} required></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginTop: "40px" }}>
                        {productos.map((producto, index) => (
                            <div key={index} className="input-data">
                                <input
                                    type="text"
                                    value={producto.producto}
                                    required
                                    disabled="true"
                                />
                                <div className="underline"></div>
                                <label style={{ marginBottom: "10px" }}>Producto {index + 1}</label>
                            </div>
                        ))}
                    </div>
                </div>;

            default:
                return;
        }
    }


    // Se muestra el contenido del CRUD administradores
    return (
        <Container fluid style={{ paddingTop: "10px" }}>
            <Row className="topmain" style={{ display: "flex", justifyContent: "space-between" }}>
                <Col className="text">
                    <p>ORDERS</p>
                </Col>
                <Col className="buttonstop" xs="auto">
                    <Button className="stop" style={filters}>Report <FaFilePdf style={{ marginRight: "3px", marginLeft: "3px", marginBottom: "3px" }} /></Button>
                    <Button type="button" id="red" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleShow('insert')} style={(currentUser.level == "administrador") ? {width: "auto", marginLeft: "3px" } : {display: "none"}}>
                        <FaCirclePlus style={{ marginRight: "5px", marginBottom: "3px" }} />New order
                    </Button>
                </Col>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal('false')} backdrop="static" size='xl'>
                <Modal.Header style={{ display: "flex", justifyContent: "space-between" }}>
                    <Modal.Title>Manage orders</Modal.Title>
                    <Button onClick={() => setShowModal(false)} style={{ backgroundColor: "white", color: "#636363", border: "none" }}>
                        <FaXmark size={"1.3rem"} />
                    </Button>
                </Modal.Header>
                <Modal.Body style={{ height: "auto", }}>
                    <form id='adminInfo' onSubmit={docId ? handleUpdate : handleInsert}>
                        {handleModal()}
                        <Modal.Footer style={{ marginTop: "1.5rem" }}>
                            <Button type='submit' id='save' variant="secondary">
                                Save Changes
                            </Button>
                            <Button onClick={() => clean()} variant="info" id='clean' style={{ color: "white" }}>
                                Clean up
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
            <Row className="searchsection">
                <Col>
                    <form className="search" id="form-search" method="post">
                        <button type="submit" className="button-search" style={{ marginLeft: "20px" }}><FaMagnifyingGlass size={"1.5rem"} style={{ marginTop: "10px" }} /></button>
                        <input type="text" name="search" placeholder="Search by username" style={{ marginLeft: "23px", height: "40px" }} value={search} onChange={(e) => { setSearch(e.target.value); fetchData() }} />
                    </form>
                </Col>
                <Col className="buttonsearch" xs="auto">
                    <input type="date" className="btnfilter sm-disable" />
                    <Dropdown>
                        <Dropdown.Toggle style={filters}>
                            Status
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle style={filters}>
                            Address
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle style={filters}>
                            Date
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button style={filters}>Save filters</Button>
                </Col>
            </Row>
            <Row className="filtertable">
                <Col>
                    <button className='active'>All orders</button>
                </Col>
            </Row>
            <Row className="datatable d-flex mt-3">
                <Col>
                    <div className="infodatatable d-inline">
                        <p>Showing {numDocs} of 10 results</p>
                    </div>
                </Col>
                <Col>
                    <div className="numbersdata">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                <li className="page-item">
                                    <a className="page-link" href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">1</a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">2</a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">3</a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </Col>
                <Col>
                    <div className="itemstable d-inline">
                        <p>Items per page <span>10</span></p>
                    </div>
                </Col>
            </Row>
            <Row className="sectiontable">
                <Col className="table-responsive" style={{ marginRight: "10px" }}>
                    <Table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">User</th>
                                <th scope="col">Final amount</th>
                                <th scope="col">Address</th>
                                <th scope="col">Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            {/* Se carga la tabla */}
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.usuario}</td>
                                    <td>{`$ ${item.monto_final}`}</td>
                                    <td>{item.direccion}</td>
                                    <td>{item.fecha}</td>
                                    <td style={{ display: "flex", justifyContent: "space-evenly" }}>
                                        <Button variant='outline-success' title='Consultar datos'><FaFileCircleQuestion size={"1.3rem"} onClick={() => LoadData(item.id)} /></Button>
                                        <Button variant='outline-warning' title='Editar' style={(currentUser.level == "administrador") ? {display:"block"} : {display:"none"}}><FaFilePen size={"1.3rem"} onClick={() => LoadUpdate(item.id)} /></Button>
                                        <Button variant='outline-danger' title='Bloquear' style={(currentUser.level == "administrador") ? {display:"block"} : {display:"none"}}><FaTrashCan size={"1.3rem"} onClick={() => AlertShow(item.id)} /></Button>
                                        <Button variant='outline-secondary' title='Generar factura' style={(currentUser.level == "administrador") ? {display:"block"} : {display:"none"}} onClick={() => handleDownloadClick(item.id)}>
                                            <FaFilePdf size={"1.3rem"} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Alert show={alert} variant="danger">
                        <Alert.Heading>Eliminar</Alert.Heading>
                        <p>
                            Desea eliminar de forma permanente este registro?
                        </p>
                        <hr />
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => handleDelete()} variant="outline-danger">
                                Eliminar
                            </Button>
                            <Button onClick={() => setAlert(false)} variant="danger">
                                Cancelar
                            </Button>
                        </div>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
}

export default Orders;
