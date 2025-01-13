import { useState, useEffect } from "react";

// Se importan los servicios a usar de firestore
import { getFirestore, collection, getDocs, updateDoc, addDoc, getDoc, doc, deleteDoc, where, query } from "firebase/firestore";


//Se importan los servicios de firebase storage
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Se importa la conexion con el servidor
import firebaseApp from '../server/server_config';

// Se importan los componentes de react-bootstrap que utilizaremos para el menu y la interfaz
import { Button, Dropdown, Modal, Table, Alert } from "react-bootstrap"

// Se importan las notiificaciones 
import toast from "react-hot-toast";
// Se importa la iconografia de la libreria react-icons
import { FaMagnifyingGlass, FaCirclePlus, FaArrowUpRightFromSquare, FaPrint, FaFileCircleQuestion, FaFilePen, FaTrashCan, FaXmark, FaEyeSlash, FaEye, FaUser } from "react-icons/fa6"

// Se importa el validator
import { validateString } from "./validator";

import { useAuth } from "./components/authContext";

// Se importa la libreria para manejar los combobox de los formularios
import Select from 'react-select';



// Se importan las hojas de estilo css
import "../style/admin/menu.css"
import "../style/admin/main.css"

// Se inicializan las constantes de los servicios de firebase
const db = getFirestore(firebaseApp);

const storage = getStorage();


// Funcion principal de la aplicacion
function Encargado() {

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
    const [apellido, setapellido] = useState();
    const [correo, setCorreo] = useState();
    const [direccion, setDireccion] = useState();
    const [dui, setDui] = useState();
    const [negocio, setNegocio] = useState();
    const [telefono, setTelefono] = useState();
    const [docId, setDocId] = useState();
    const [profileImage, setProfileImage] = useState();
    const [negocios, setNegocios] = useState(null);

    const {currentUser} = useAuth();


    // Funcion que se encarga de mostrar la imagen en el modal
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);  // Para mostrar la imagen en un `div`
                setImageFile(file);  // Guardar el archivo en el estado
            };
            reader.readAsDataURL(file);
        }
    };

    // Funcion que se encarga de cargar los usuarios para la tabla de contenido
    useEffect(() => {
        if (active == false) {
            fetchData('hidden') 
        }
        else {
            fetchData();
        }
        fetchClientesEncargados();
    }, [search])

    // Funcion para cargar la tabla de contenido
    const fetchData = async (param) => {
        switch (param) {
            case 'hidden':
                if (currentUser.level == "administrador") {
                    try {
                        setTableDefaults(true)
                        const recordsRef = collection(db, "clientes_encargados");
                        let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", false), where("managerData.cliente", "==", search))
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
                } else {
                    try {
                        setTableDefaults(true)
                        const recordsRef = collection(db, "clientes_encargados");
                        let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", false), where("managerData.cliente", "==", search))
                            : query(recordsRef, where("estado", "==", false), where("managerData.cliente", "==", currentUser.ClientData?.nombre_negocio));
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
                }
                break;
            default:
                if (currentUser.level == "administrador") {
                    try {
                        setTableDefaults(false)
                        const recordsRef = collection(db, "clientes_encargados");
                        let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", true), where("managerData.cliente", "==", search))
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
                        const recordsRef = collection(db, "clientes_encargados");
                        let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", true), where("managerData.cliente", "==", search))
                            : query(recordsRef, where("estado", "==", true), where("managerData.cliente", "==", currentUser.ClientData?.nombre_negocio));
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

    // Funcion para cargar los datos de los negocios clientes
    const fetchClientesEncargados = async () => {
        try {
            const clientesRef = collection(db, "clientes");
            const querySnapshot = await getDocs(clientesRef);

            // Formatear los datos en el formato requerido por SearchableDropdown
            const formattedOptions = querySnapshot.docs.map((doc) => ({
                label: doc.data().ClientData?.nombre_negocio,
                value: doc.id // Cambia 'nombre' según tu estructura en Firestore
            }));

            setNegocios(formattedOptions);
        } catch (error) {
            console.error("Error al cargar los datos de Firestore:", error);
        }
    };

    //Funcion para guardar el valor del dropdown
    const handleDropdown = (option) => {
        setNegocio(option)
    };

    // Funcion que se encarga de mostrar el modal
    const handleShow = (content) => {
        setModalState(content);
        setShowModal('true');
    }

    // Funcion que se encarga de manejar el evento al momento de insertar datos 
    async function handleInsert(e) {
        e.preventDefault();
        if (validateString(nombre, {
            required: true,
            minLength: 5,
            maxLength: 15,
            pattern: /^[a-zA-Z0-9]*$/,
            forbiddenChars: "!@#$%^&*()"
        })
            && validateString(apellido, {
                required: true,
                minLength: 5,
                maxLength: 15,
                pattern: /^[a-zA-Z0-9]*$/,
                forbiddenChars: "!@#$%^&*()"
            }) && validateString(correo, {
                required: true,
                minLength: 10,
                maxLength: 50,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                forbiddenChars: "!#$%^&*()"
            }) && validateString(telefono, {
                required: true,
                minLength: 7,
                maxLength: 15,
                pattern: /^\d{4}-[0-9]{4}$/,
                forbiddenChars: "!@#$%^&*()"
            }) && validateString(direccion, {
                required: true,
                minLength: 10,
                maxLength: 150,
                forbiddenChars: "!@#$%^&*()"
            }) && validateString(dui, {
                required: true,
                minLength: 10,
                maxLength: 10,
                pattern: /^\d{8}-\d$/,
                forbiddenChars: "!@#$%^&*()"
            }) && imageSrc && negocio) {
            try {

                // Se crea el objeto con los datos del encargado 
                let managerData = {
                    nombre: nombre,
                    apellido: apellido,
                    dui: dui,
                    clienteRef: `/clientes/${negocio.value}`,
                    cliente: negocio.label,
                    correo: correo,
                    direccion: direccion,
                    telefono: telefono
                }

                // Guardar los datos en Firestore
                const docRef = await addDoc(collection(db, 'clientes_encargados'), {
                    managerData,
                    estado: true
                });

                // Se guarda la imagen subida
                const id = docRef.id
                const imageStore = ref(storage, `DocPictures/${id}`);
                await uploadBytes(imageStore, imageFile);
                const url = await getDownloadURL(imageStore);

                // Se agrega al registro la direccion de la imagen 
                await updateDoc(docRef, {
                    "managerData.foto_documento": url
                });

                // Se muestra un mensaje de exito y se cierra el modal
                toast.success('Encargado agregado exitosamente');
                setShowModal(false);
                fetchData();
            } catch (error) {
                if (error.code === 'already-exists') {
                    toast.error('Ya existe un encargado con ese nombre.');
                }
            };
        } else {
            toast.error('No se ha podido agregar el registro.');
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
        }) && validateString(apellido, {
            required: true,
            minLength: 3,
            maxLength: 10,
            pattern: /^[a-zA-Z0-9]*$/,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(telefono, {
            required: true,
            minLength: 9,
            maxLength: 15,
            pattern: /^\d{4}-[0-9]{4}$/,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(direccion, {
            required: true,
            minLength: 10,
            maxLength: 150,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(dui, {
            required: true,
            minLength: 10,
            maxLength: 10,
            pattern: /^\d{8}-\d$/,
            forbiddenChars: "!@#$%^&*()"
        }) && negocio) {

            // Se inicializan la constante de la imagen de perfil
            const image = document.getElementById('file');
            const file = image.files[0];

            // En cacso de haber una imagen subida en el form
            if (file) {
                try {
                    // Subir imagen a Firebase Storage
                    const imageStore = ref(storage, `DocPicture/${docId}`); // Uid del usuario no autenticado
                    await uploadBytes(imageStore, file); // Subir la imagen

                    // Obtener la URL de descarga de la imagen subida
                    const downloadURL = await getDownloadURL(imageStore);

                    // Actualizar el estado con la URL obtenida
                    setImageSrc(downloadURL);
                    // Se muestra un mensaje que se ha subido la imagen
                    toast.success('Imagen actualizada con éxito.');
                } catch (error) {
                    // Se muestra  un mensaje de error que no se ha podido subir la imagen
                    toast.error('Ha ocurrido un error al subir la imagen');
                    return;
                }
            }

            // Actualizar los datos del documento del usuario en Firestore
            try {
                const userDocRef = doc(db, "clientes_encargados", docId);
                await updateDoc(userDocRef, {
                    managerData: {
                        nombre: nombre,
                        apellido: apellido,
                        dui: dui,
                        clienteRef: `/clientes/${negocio.value}`,
                        cliente: negocio.label,
                        correo: correo,
                        direccion: direccion,
                        telefono: telefono,
                        foto_documento: imageSrc
                    },
                });

                // Se muestra un mensaje de éxito al actualizar el usuario y se cierra el modal
                toast.success('Usuario actualizado con éxito.');
                setShowModal(false);
                fetchData();
            } catch (error) {
                toast.error('Error al actualizar el usuario.');
                console.error(error);
            }
        }
        else {
            toast.error('Ha ocurrido un error al actualizar los datos del encargado.');
        }
    }

    // Funcion para cargar los datos del documento en el form al abrir seleccionar actualizar 
    function LoadUpdate(id) {
        // Obtener la referencia al documento en la colección "encargados" usando el id
        const docRef = doc(db, "clientes_encargados", id);
        // Obtener los datos del documento
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Asignar valores a los campos en el modal
                setNombre(data.managerData?.nombre || "");
                setapellido(data.managerData?.apellido || "");
                setTelefono(data.managerData?.telefono || "");
                setCorreo(data.managerData?.correo || "");
                setDireccion(data.managerData?.direccion || "");
                setDui(data.managerData?.dui || "");
                setNegocio({ label: data.managerData?.cliente || "", value: data.managerData?.clienteRef || "" });
                setImageSrc(data.managerData?.foto_documento || ""); // Si tienes una imagen almacenada
                setDocId(docSnap.id || "");
                // Mostrar el modal para actualizar el documento
                handleShow('update');
            }
        }).catch((error) => {
            toast.error("Usuario no valido");
        });
    }

    // Funcion que se encarga de cargar los datos del usuario al seleccionar consultarlos
    function LoadData(id) {
        // Obtener la referencia al documento en la colección "administradores" usando el id
        const docRef = doc(db, "clientes_encargados", id);

        // Obtener los datos del documento
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Asignar valores a los campos en el modal
                setNombre(data.managerData?.nombre || "");
                setapellido(data.managerData?.apellido || "");
                setTelefono(data.managerData?.telefono || "");
                setCorreo(data.managerData?.correo || "");
                setDireccion(data.managerData?.direccion || "");
                setDui(data.managerData?.dui || "");
                setNegocio({ label: data.managerData?.cliente || "", value: data.managerData?.clienteRef || "" });
                setImageSrc(data.managerData?.foto_documento || ""); // Si tienes una imagen almacenada
                setDocId(docSnap.id || "");
                // Mostrar el modal para actualizar el documento
                handleShow('show');

            }
        }).catch((error) => {
            toast.error("Usuario no valido");
        });
    }

    // Funcion para limpiar los campos del formulario
    function clean() {
        if (docId == null) {
            try {
                document.getElementById('nombre').value = "";
                document.getElementById('apellido').value = "";
                document.getElementById('telefono').value = "";
                document.getElementById('dui').value = "";
                document.getElementById('correof').value = "";
                document.getElementById('direccion').value = "";
                setNegocio({ label: "", value: "" });
                setImageSrc(null);

            } catch (error) {
                toast.error("Ha ocurrido un error al limpiar los campos");
            };
        } else {
            try {
                setNombre("");
                setapellido("");
                setTelefono("");
                setDui("");
                setCorreo("");
                setDireccion("");
                setNegocio({ label: "", value: "" });
                setImageSrc(null);
            } catch (error) {
                toast.error("Ha ocurrido un error al limpiar los campos");
            };
        }

    };

    // Funcion para manejar la eliminación de documentos
    async function handleDelete() {
        try {
            // Obtener la referencia al documento en la colección "administradores"
            const docRef = doc(db, "clientes_encargados", docId);

            // Obtener los datos del documento
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Eliminar el documento en Firestore
                await deleteDoc(docRef);
                toast.success('Registro eliminado con éxito.');
                setAlert(false);
                fetchData();
                setDocId(null);
            } else {
                toast.error('El registro que se esta tratando de eliminar no existe');
            }
        } catch (error) {
            toast.error("Ha ocurrido un error al eliminar el registro");
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
                                    <label>Nombre</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="apellido" name="apellido" onChange={(e) => setapellido(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Apellido</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="dui" name="dui" onChange={(e) => setDui(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Dui</label>
                                </div>

                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="mail" id="correof" name="correo" onChange={(e) => setCorreo(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Correo</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="telefono" name="telefono" onChange={(e) => setTelefono(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Numero de telefono</label>
                                </div>
                            </div>
                            <div className="col" style={{marginTop:"2px"}}>
                                <div className="combobox">
                                    <label>Cliente</label>
                                    <Select
                                        className="dropdown"
                                        value={negocio}
                                        onChange={handleDropdown}
                                        options={negocios}
                                        required
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginRight: "30px" }}>
                        <p>Foto DUI</p>
                        <img src={(document.getElementById('file') === null) ? null : imageSrc} className="imagen"></img>
                        <div className="btns">
                            <input type="file" name="imageUser" id="file" accept="image/*" onChange={handleImageChange}></input>
                        </div>
                        <div className="row" style={{ marginTop: "50px" }}>
                            <div className="col">
                                <div className="input-group">
                                    <label>Direccion</label>
                                    <textarea style={{ maxHeight: "23vh", marginLeft: "10px" }} className="form-control" aria-label="With textarea" id="direccion" name="direccion" onChange={(e) => setDireccion(e.target.value)} required></textarea>
                                </div>
                            </div>
                        </div>
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
                                    <label>Nombre</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="apellido" name="apellido" value={apellido} onChange={(e) => setapellido(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Apellido</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="dui" name="dui" value={dui} onChange={(e) => setDui(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Dui</label>
                                </div>

                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="mail" id="correof" name="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Correo</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="telefono" name="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Numero de telefono</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="combobox">
                                    <label>Cliente</label>
                                    <Select
                                        className="dropdown"
                                        value={negocio}
                                        onChange={handleDropdown}
                                        options={negocios}
                                        required
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginRight: "30px" }}>
                        <p>Foto DUI</p>
                        <img src={imageSrc} className="imagen"></img>
                        <div className="btns">
                            <input type="file" name="imageUser" id="file" accept="image/*" onChange={handleImageChange}></input>
                        </div>
                        <div className="row" style={{ marginTop: "50px" }}>
                            <div className="col">
                                <div className="input-group">
                                    <label>Direccion</label>
                                    <textarea style={{ maxHeight: "23vh", marginLeft: "10px" }} value={direccion} className="form-control" aria-label="With textarea" id="direccion" name="direccion" onChange={(e) => setDireccion(e.target.value)} required></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
            case 'show':
                return <div style={{ display: "flex" }} >
                    <div className="section1">
                        <div className="row">
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="nombre" name="nombre" disabled="true" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Nombre</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="apellido" name="apellido" disabled="true" value={apellido} onChange={(e) => setapellido(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Apellido</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="dui" name="dui" disabled="true" value={dui} onChange={(e) => setDui(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Dui</label>
                                </div>

                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="mail" id="correof" name="correo" disabled="true" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Correo</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="telefono" name="telefono" disabled="true" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Numero de telefono</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="combobox">
                                    <label>Cliente</label>
                                    <Select
                                        className="dropdown"
                                        value={negocio}
                                        onChange={handleDropdown}
                                        options={negocios}
                                        required
                                        isDisabled="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginRight: "30px" }}>
                        <p>Foto DUI</p>
                        <img src={imageSrc} className="imagen"></img>
                        <div className="row" style={{ marginTop: "50px" }}>
                            <div className="col">
                                <div className="input-group">
                                    <label>Direccion</label>
                                    <textarea style={{ maxHeight: "23vh", marginLeft: "10px" }} disabled="true" value={direccion} className="form-control" aria-label="With textarea" id="direccion" name="direccion" onChange={(e) => setDireccion(e.target.value)} required></textarea>
                                </div>
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
        const userDocRef = doc(db, "clientes_encargados", id);
        await updateDoc(userDocRef, {
            estado: false
        });
        ToggleActive("all")
    }

    // Funcion para hacer visible un registro
    async function ShowState(id) {
        const userDocRef = doc(db, "clientes_encargados", id);
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
                    <p>CLIENTS | MANAGERS</p>
                </div>
                <div className="buttonstop">
                    <Button className="stop" data-tooltip="btnprueba" style={filters}>Export  <FaArrowUpRightFromSquare style={{ marginLeft: "3px", marginRight: "3px", marginBottom: "3px" }} /></Button>
                    <Button className="stop" style={filters}>Print <FaPrint style={{ marginRight: "3px", marginLeft: "3px", marginBottom: "3px" }} /></Button>
                    <Button type="button" id="red" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleShow('insert')} style={{ width: "auto", marginLeft: "3px" }}>
                        <FaCirclePlus style={{ marginRight: "5px", marginBottom: "3px" }} />New business manager
                    </Button>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal('false')} backdrop="static" size='lg'>
                <Modal.Header style={{ display: "flex", justifyContent: "space-between" }}>
                    <Modal.Title>Manage business managers</Modal.Title>
                    <Button onClick={() => setShowModal(false)} style={{ backgroundColor: "white", color: "#636363", border: "none" }}>
                        <FaXmark size={"1.3rem"} />
                    </Button>
                </Modal.Header>
                <Modal.Body style={{ height: "auto" }}>
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
                <button className={active ? 'active' : ''} onClick={() => ToggleActive('all')}>All business managers</button>
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
                                <th scope="col">Name</th>
                                <th scope="col">Phone number</th>
                                <th scope="col">Email</th>
                                <th scope="col">Business name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            {/* Se carga la tabla */}
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.managerData?.nombre}</td>
                                    <td>{item.managerData?.telefono}</td>
                                    <td>{item.managerData?.correo}</td>
                                    <td>{item.managerData?.cliente}</td>
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
                        <Alert.Heading>Bloquear</Alert.Heading>
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

export default Encargado;
