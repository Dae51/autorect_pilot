import { useState, useEffect } from "react";

// Se importan los servicios a usar de firestore
import { getFirestore, collection, getDocs, updateDoc, addDoc, getDoc, doc, deleteDoc, where, query } from "firebase/firestore";

// Se importa la conexion con el servidor
import firebaseApp from '../server/server_config';

// Se importan los servicios de firebase storage
import { ref, uploadBytes, getDownloadURL, getStorage, deleteObject, listAll } from "firebase/storage";

// Se importan los componentes de react-bootstrap que utilizaremos para el menu y la interfaz
import { Button, Dropdown, Modal, Table, Alert } from "react-bootstrap"
// Se importan las notiificaciones 
import toast from "react-hot-toast";
// Se importa la iconografia de la libreria react-icons
import { FaMagnifyingGlass, FaCirclePlus, FaArrowUpRightFromSquare, FaPrint, FaFileCircleQuestion, FaFilePen, FaTrashCan, FaXmark, FaEyeSlash, FaEye, FaUser } from "react-icons/fa6"

// Se importa el validator
import { validateString } from "./validator";

import { useAuth } from "./components/authContext";


// Se importa el componente Select para los combobox en los formularios
import Select from 'react-select';

import DynamicImages from './components/dynamicFiles'

// Se importan las hojas de estilo css
import "../style/admin/menu.css"
import "../style/admin/main.css"

// Se inicializan las constantes de los servicios de firebase
const db = getFirestore(firebaseApp);

const storage = getStorage();


// Funcion principal de la aplicacion
function Product() {

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

    const [imageSrc, setImageSrc] = useState(null);
    const [modalState, setModalState] = useState(null);
    const [imageFile, setImageFile] = useState(null);


    // Se inicializan las constantes de los datos del registro
    const [nombre, setNombre] = useState();
    const [precio, setPrecio] = useState();
    const [descripcion, setDescripcion] = useState();
    const [modelo, setModelo] = useState();
    const [modelos, setModelos] = useState();
    const [cliente, setCliente] = useState();
    const [clientes, setClientes] = useState();
    const [docId, setDocId] = useState();
    const [profileImage, setProfileImage] = useState();
    const [imageFiles, setImageFiles] = useState([]);

    const { currentUser } = useAuth();

    // Funcion que se encarga de cargar los usuarios para la tabla de contenido
    useEffect(() => {
        if (active == false) {
            fetchData('hidden')
        }
        else {
            fetchData();
        }
        fetchClientes();
        fetchModelos();
    }, [search, currentUser])

    // Funcion para cargar la tabla de contenido
    const fetchData = async (param) => {
        switch (param) {
            case 'hidden':
                if (currentUser.level == "administrador") {
                    try {
                        setTableDefaults(false)
                        const recordsRef = collection(db, "productos");
                        let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", true), where("productData.modelo", "==", search))
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
                        setTableDefaults(false)
                        const recordsRef = collection(db, "productos");
                        let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", true), where("productData.modelo", "==", search))
                            : query(recordsRef, where("estado", "==", true), where("productData.cliente", "==", currentUser.ClientData?.nombre_negocio));
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
                }
                break;
            default:
                if (currentUser.level == "administrador") {
                    try {
                        setTableDefaults(false)
                        const recordsRef = collection(db, "productos");
                        let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", true), where("productData.modelo", "==", search))
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
                        setTableDefaults(false)
                        const recordsRef = collection(db, "productos");
                        let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", true), where("productData.modelo", "==", search))
                            : query(recordsRef, where("estado", "==", true), where("productData.cliente", "==", currentUser.ClientData?.nombre_negocio));
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
                }
                break;
        }
    };

    // Funcion para cargar los datos de las marcas de carros
    const fetchClientes = async () => {
        try {
            const Ref = collection(db, "clientes");
            const querySnapshot = await getDocs(Ref);

            // Formatear los datos en el formato requerido por SearchableDropdown
            const formattedOptions = querySnapshot.docs.map((doc) => ({
                label: doc.data().ClientData?.nombre_negocio,
                value: doc.id // Cambia 'nombre' según tu estructura en Firestore
            }));

            setClientes(formattedOptions);
        } catch (error) {
            toast.error("Error al cargar los datos de Firestore");
        }
    };

    // Funcion para cargar los datos de las categorias de carros
    const fetchModelos = async () => {
        try {
            const Ref = collection(db, "modelos");
            const querySnapshot = await getDocs(Ref);

            // Formatear los datos en el formato requerido por SearchableDropdown
            const formattedOptions = querySnapshot.docs.map((doc) => ({
                label: doc.data().nombre,
                value: doc.id // Cambia 'nombre' según tu estructura en Firestore
            }));

            setModelos(formattedOptions);
        } catch (error) {
            toast.error("Error al cargar los datos de Firestore");
        }
    };

    //Funcion para guardar el valor del dropdown
    const handleModelos = (option) => {
        setModelo(option)
    };

    //Funcion para guardar el valor del dropdown
    const handleClientes = (option) => {
        setCliente(option)
    };

    // Funcion que se encarga de mostrar el modal
    const handleShow = (content) => {
        setModalState(content);
        setShowModal('true');
    }

    // Funcion que maneja el cambio de las imagenes
    const handleFilesChange = (files) => {
        setImageFiles(files);
    };

    // Funcion que se encarga de manejar el evento al momento de insertar datos 
    async function handleInsert(e) {
        e.preventDefault();
        if (validateString(nombre, {
            required: true,
            minLength: 5,
            maxLength: 15,
            pattern: /^[a-zA-Z0-9]*$/,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(descripcion, {
            required: true,
            minLength: 10,
            maxLength: 200,
            forbiddenChars: "!@#$%^&*()"
        }) && precio && modelo && cliente && imageFiles) {
            try {
                // Guardar los datos en Firestore
                const docRef = await addDoc(collection(db, 'productos'), {
                    productData: {
                        nombre: nombre,
                        descripcion: descripcion,
                        precio: precio,
                        modeloRef: `/modelos/${modelo.value}`,
                        modelo: modelo.label,
                        clienteRef: `/clientes/${cliente.value}`,
                        cliente: cliente.label,
                    },
                    estado: true
                });

                const productoId = docRef.id; // Captura el ID del documento creado
                const imageUrls = []; // Para almacenar las URLs de las imágenes

                // Subir imágenes al storage
                for (const [index, imageFile] of imageFiles.entries()) {
                    const imageRef = ref(storage, `productsPictures/${productoId}/${index}`);
                    await uploadBytes(imageRef, imageFile); // Subir cada imagen
                    const imageUrl = await getDownloadURL(imageRef); // Obtener URL pública
                    imageUrls.push(imageUrl); // Guardar URL
                }

                // Actualizar el documento con las URLs de las imágenes
                await updateDoc(docRef, {
                    imageUrls, // Guarda todas las URLs en el documento
                });

                // Mostrar mensaje de éxito
                toast.success("Producto agregado exitosamente");
                setShowModal(false);
                fetchData(); // Actualiza la vista o datos en la interfaz

            } catch (error) {
                console.error("Error al agregar el producto:", error);
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
        if (validateString(nombre, {
            required: true,
            minLength: 3,
            maxLength: 10,
            pattern: /^[a-zA-Z0-9]*$/,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(descripcion, {
            required: true,
            minLength: 1,
            maxLength: 8,
        } && precio && cliente && modelo)) {

            // Actualizar los datos del documento del usuario en Firestore
            try {
                const imageUrls = []; // Para almacenar las URLs de las imágenes
                const userDocRef = doc(db, "productos", docId);
                await updateDoc(userDocRef, {
                    productData: {
                        nombre: nombre,
                        descripcion: descripcion,
                        precio: precio,
                        modeloRef: `/modelos/${modelo.value}`,
                        modelo: modelo.label,
                        clienteRef: `/clientes/${cliente.value}`,
                        cliente: cliente.label,
                    },
                    estado: true,
                });

                // Si se ha seleccionado imágenes, se suben al storage y se actualizan en el documento
                if (imageFiles) {
                    try {
                        const folderRef = ref(storage, `productsPictures/${docId}`); // Crear referencia a la carpeta

                        // Listar todos los archivos dentro de la carpeta
                        const folderContents = await listAll(folderRef);

                        // Iterar y eliminar cada archivo dentro de la carpeta
                        for (const item of folderContents.items) {
                            await deleteObject(item);
                            console.log(item)

                        }

                        // Subir imágenes al storage
                        for (const [index, imageFile] of imageFiles.entries()) {
                            const imageRef = ref(storage, `productsPictures/${docId}/${index}`);
                            await uploadBytes(imageRef, imageFile); // Subir cada imagen
                            const imageUrl = await getDownloadURL(imageRef); // Obtener URL pública
                            imageUrls.push(imageUrl); // Guardar URL
                        }

                        // Actualizar el documento con las URLs de las imágenes
                        await updateDoc(userDocRef, {
                            imageUrls, // Guarda todas las URLs en el documento
                        });
                    } catch (error) {
                        toast.error("No se han podido actualizar las imagenes del producto")
                    }
                }

                // Se muestra un mensaje de éxito al actualizar el usuario y se cierra el modal
                toast.success('Producto actualizado con éxito.');
                setShowModal(false);
                fetchData();
            } catch (error) {
                toast.error('Error al actualizar el modelo.');
            }
        }
        else {
            toast.error('Ha ocurrido un error al actualizar los datos del modelo.');
        }
    }

    // Funcion para cargar los datos del documento en el form al abrir seleccionar actualizar 
    function LoadUpdate(id) {
        // Obtener la referencia al documento en la colección "encargados" usando el id
        const docRef = doc(db, "productos", id);
        // Obtener los datos del documento
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Asignar valores a los campos en el modal
                setNombre(data.productData?.nombre || "");
                setPrecio(data.productData?.precio || "");
                setDescripcion(data.productData?.descripcion || "")
                setCliente({ label: data.productData?.cliente || "", value: data.productData?.clienteRef || "" });
                setModelo({ label: data.productData?.modelo || "", value: data.productData?.modeloRef || "" });
                setDocId(docSnap.id || "");
                // Mostrar el modal para actualizar el documento
                handleShow('update');
            }
        }).catch((error) => {
            toast.error("Modelo no valido");
        });
    }

    // Funcion que se encarga de cargar los datos del usuario al seleccionar consultarlos
    function LoadData(id) {
        // Obtener la referencia al documento en la colección "administradores" usando el id
        const docRef = doc(db, "productos", id);

        // Obtener los datos del documento
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Asignar valores a los campos en el modal
                setNombre(data.productData?.nombre || "");
                setPrecio(data.productData?.precio || "");
                setDescripcion(data.productData?.descripcion || "")
                setCliente({ label: data.productData?.cliente || "", value: data.productData?.clienteRef || "" });
                setModelo({ label: data.productData?.modelo || "", value: data.productData?.modeloRef || "" });
                setDocId(docSnap.id || "");
                // Mostrar el modal para actualizar el documento
                handleShow('show');

            }
        }).catch((error) => {
            toast.error("Modelo no valido");
        });
    }

    // Funcion para limpiar los campos del formulario
    function clean() {
        if (docId == null) {
            try {
                document.getElementById('nombre').value = "";
                document.getElementById('precio').value = "";
                document.getElementById('descripcion').value = "";
                setModelo({ label: "", value: "" });
                setCliente({ label: "", value: "" });

            } catch (error) {
                toast.error("Ha ocurrido un error al limpiar los campos");
            };
        } else {
            try {
                setNombre("");
                setPrecio("");
                setDescripcion("");
                setModelo({ label: "", value: "" });
                setCliente({ label: "", value: "" });
            } catch (error) {
                toast.error("Ha ocurrido un error al limpiar los campos");
            };
        }

    };

    // Funcion para manejar la eliminación de documentos
    async function handleDelete() {
        try {
            // Obtener la referencia al documento en la colección "productos"
            const docRef = doc(db, "productos", docId);

            // Obtener los datos del documento
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Referencia a la carpeta en Firebase Storage
                const folderRef = ref(storage, `productsPictures/${docId}`);

                // Listar todos los archivos dentro de la carpeta
                const folderContents = await listAll(folderRef);

                // Iterar y eliminar cada archivo dentro de la carpeta
                for (const item of folderContents.items) {
                    await deleteObject(item);
                }

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
                                    <input type="text" id="nombre" name="nombre" onChange={(e) => setNombre(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Pieza</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="number" id="precio" name="precio" onChange={(e) => setPrecio(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Precio</label>
                                </div>
                            </div>
                            <div className="col" style={{ marginTop: "5px" }}>
                                <div className="combobox">
                                    <label>Carro</label>
                                    <Select
                                        className="dropdown"
                                        value={modelo}
                                        onChange={handleModelos}
                                        options={modelos}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col" style={{ marginTop: "5px" }}>
                                <div className="combobox">
                                    <label>Clientes</label>
                                    <Select
                                        className="dropdown"
                                        value={cliente}
                                        onChange={handleClientes}
                                        options={clientes}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="" style={{ width: "670px" }}>
                                <label>Descripcion</label>
                                <textarea style={{ maxHeight: "23vh" }} className="form-control" aria-label="With textarea" id="descripcion" name="descripcion" onChange={(e) => setDescripcion(e.target.value)} required></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginTop: "40px" }}>
                        <DynamicImages onFilesChange={handleFilesChange} />

                    </div>
                </div>;

            // Se carga el contenido del caso "update"
            case 'update':
                return <div style={{ display: "flex" }} >
                    <div className="section1">
                        <div className="row">
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Pieza</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="number" id="precio" name="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Precio</label>
                                </div>
                            </div>
                            <div className="col" style={{ marginTop: "5px" }}>
                                <div className="combobox">
                                    <label>Carro</label>
                                    <Select
                                        className="dropdown"
                                        value={modelo}
                                        onChange={handleModelos}
                                        options={modelos}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col" style={{ marginTop: "5px" }}>
                                <div className="combobox">
                                    <label>Clientes</label>
                                    <Select
                                        className="dropdown"
                                        value={cliente}
                                        onChange={handleClientes}
                                        options={clientes}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="" style={{ width: "670px" }}>
                                <label>Descripcion</label>
                                <textarea style={{ maxHeight: "23vh" }} className="form-control" value={descripcion} aria-label="With textarea" id="descripcion" name="descripcion" onChange={(e) => setDescripcion(e.target.value)} required></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginTop: "40px" }}>
                        <DynamicImages onFilesChange={handleFilesChange} />
                    </div>
                </div>;
            case 'show':
                return <div style={{ display: "flex" }} >
                    <div className="section1">
                        <div className="row">
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="nombre" disabled="true" value={nombre} name="nombre" onChange={(e) => setNombre(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label style={{ marginBottom: "5px" }}>Pieza</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="number" id="precio" disabled="true" value={precio} name="precio" onChange={(e) => setPrecio(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label style={{ marginBottom: "5px" }}>Precio</label>
                                </div>
                            </div>
                            <div className="col" style={{ marginTop: "5px" }}>
                                <div className="combobox">
                                    <label>Carro</label>
                                    <Select
                                        className="dropdown"
                                        value={modelo}
                                        onChange={handleModelos}
                                        options={modelos}
                                        required
                                        isDisabled
                                    />
                                </div>
                            </div>
                            <div className="col" style={{ marginTop: "5px" }}>
                                <div className="combobox">
                                    <label>Clientes</label>
                                    <Select
                                        className="dropdown"
                                        value={cliente}
                                        onChange={handleClientes}
                                        options={clientes}
                                        required
                                        isDisabled
                                    />
                                </div>
                            </div>
                            <div className="" style={{ width: "670px" }}>
                                <label>Descripcion</label>
                                <textarea style={{ maxHeight: "23vh" }} disabled="true" value={descripcion} className="form-control" aria-label="With textarea" id="descripcion" name="descripcion" onChange={(e) => setDescripcion(e.target.value)} required></textarea>
                            </div>
                        </div>
                    </div>
                </div>;

            default:
                return;
        }
    }

    // Funcion para ocultar los registros por medio de asignarle un valor de "false" al campo "estado"
    async function HideState(id) {
        const userDocRef = doc(db, "productos", id);
        await updateDoc(userDocRef, {
            estado: false
        });
        ToggleActive("all")
    }

    // Funcion para hacer visible un registro
    async function ShowState(id) {
        const userDocRef = doc(db, "productos", id);
        await updateDoc(userDocRef, {
            estado: true
        });
        ToggleActive("hidden")
    }

    //Funciones para cambiar el contenido mostrado en la tabla
    const ToggleActive = async (param) => {
        switch (param) {
            case "all":
                setActive(true);
                setActive2(false);
                fetchData();
                break;
            case "hidden":
                setActive(false);
                setActive2(true);
                fetchData('hidden');
                break;
            default:
                setActive(true);
                setActive2(false);
                return;
        }

    }



    // Se muestra el contenido del CRUD administradores
    return (
        <div>
            <div className="topmain" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="text">
                    <p>PRODUCTS</p>
                </div>
                <div className="buttonstop">
                    <Button className="stop" data-tooltip="btnprueba" style={filters}>Export  <FaArrowUpRightFromSquare style={{ marginLeft: "3px", marginRight: "3px", marginBottom: "3px" }} /></Button>
                    <Button className="stop" style={filters}>Print <FaPrint style={{ marginRight: "3px", marginLeft: "3px", marginBottom: "3px" }} /></Button>
                    <Button type="button" id="red" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleShow('insert')} style={{ width: "auto", marginLeft: "3px" }}>
                        <FaCirclePlus style={{ marginRight: "5px", marginBottom: "3px" }} />New product
                    </Button>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal('false')} backdrop="static" size='xl'>
                <Modal.Header style={{ display: "flex", justifyContent: "space-between" }}>
                    <Modal.Title>Manage products</Modal.Title>
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
            <div className="searchsection">
                <form className="search" id="form-search" method="post">
                    <button type="submit" className="button-search" style={{ marginLeft: "20px" }}><FaMagnifyingGlass size={"1.5rem"} style={{ marginTop: "10px" }} /></button>
                    <input type="text" name="search" placeholder="Search by business name" style={{ marginLeft: "23px" }} value={search} onChange={(e) => { setSearch(e.target.value); fetchData() }} />
                </form>
                <div className="buttonsearch">
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
                </div>
            </div>
            <div className="filtertable">
                <button className={active ? 'active' : ''} onClick={() => ToggleActive('all')}>All products</button>
                <button className={active2 ? 'active' : ''} onClick={() => ToggleActive('hidden')}>Hidden</button>
            </div>
            <div className="datatable">
                <div className="infodatatable">
                    <p>Showing {numDocs} of 10 results</p>
                </div>
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
                <div className="itemstable">
                    <p>Items per page <span>10</span></p>
                </div>
            </div>
            <div className="sectiontable">
                <div className=" table-responsive" style={{ marginRight: "10px" }}>
                    <Table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Product</th>
                                <th scope="col">Provider</th>
                                <th scope="col">Car</th>
                                <th scope="col">Price</th>
                                <th scope="col">Description</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            {/* Se carga la tabla */}
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.productData?.nombre}</td>
                                    <td>{item.productData?.cliente}</td>
                                    <td>{item.productData?.modelo}</td>
                                    <td>{`$ ${item.productData?.precio}`}</td>
                                    <td>{item.productData?.descripcion}</td>
                                    <td style={{ display: "flex", justifyContent: "space-evenly" }}>
                                        <Button variant='outline-success' title='Consultar datos'><FaFileCircleQuestion size={"1.3rem"} onClick={() => LoadData(item.id)} /></Button>
                                        <Button variant='outline-warning' title='Editar'><FaFilePen size={"1.3rem"} onClick={() => LoadUpdate(item.id)} /></Button>
                                        <Button variant='outline-danger' title='Bloquear'><FaTrashCan size={"1.3rem"} onClick={() => AlertShow(item.id)} /></Button>
                                        <Button variant='outline-secondary' style={TableDefaults ? { display: "none" } : {}} title='Ocultar'><FaEyeSlash size={"1.3rem"} onClick={() => HideState(item.id)} /></Button>
                                        <Button variant='outline-secondary' style={TableDefaults ? {} : { display: "none" }} title='Ocultar'><FaEye size={"1.3rem"} onClick={() => ShowState(item.id)} /></Button>
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
                </div>
            </div>
        </div>
    );
}

export default Product;
