import { useState, useEffect } from "react";

// Se importan los servicios a usar de firestore
import { getFirestore, collection, getDocs, updateDoc, addDoc, getDoc, doc, deleteDoc, where, query } from "firebase/firestore";

// Se importan los servicios de firebase auth
import { getAuth, createUserWithEmailAndPassword, updateCurrentUser } from "firebase/auth";
//Se importan los servicios de firebase storage
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Se importa la conexion con el servidor
import firebaseApp from '../server/server_config';

// Se importan los componentes de react-bootstrap que utilizaremos para el menu y la interfaz
import { Button, Dropdown, Modal, Table, Alert } from "react-bootstrap"
// Se importan las notiificaciones 
import toast from "react-hot-toast";
// Se importa la iconografia de la libreria react-icons
import { FaMagnifyingGlass, FaCirclePlus, FaArrowUpRightFromSquare, FaPrint, FaFileCircleQuestion, FaFilePen, FaUserLock, FaXmark, FaEyeSlash, FaEye, FaUser } from "react-icons/fa6"

// Se importa el validator
import { validateString } from "./validator";

// Se importan las hojas de estilo css
import "../style/admin/menu.css"
import "../style/admin/main.css"

// Se inicializan las constantes de los servicios de firebase
const db = getFirestore(firebaseApp);

const auth = getAuth();

const storage = getStorage();


// Funcion principal de la aplicacion
function Client() {

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


    // Se inicializan las constantes de los datos del 
    const [nombre, setNombre] = useState();
    const [clave, setClave] = useState();
    const [correo, setCorreo] = useState();
    const [direccion, setDireccion] = useState();
    const [estado, setEstado] = useState();
    const [telefono, setTelefono] = useState();
    const [uid, setUid] = useState();
    const [docId, setDocId] = useState();
    const [profileImage, setProfileImage] = useState();




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
    }, [search])

    // Funcion para cargar la tabla de contenido
    const fetchData = async (param) => {
        switch (param) {
            case 'hidden':
                try {
                    setTableDefaults(true)
                    const recordsRef = collection(db, "clientes");
                    let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", false), where("ClientData.nombre_negocio", "==", search))
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
                try {
                    setTableDefaults(false)
                    const recordsRef = collection(db, "clientes");
                    let q = (search.trim() !== "") ? query(recordsRef, where("estado", "==", true), where("ClientData.nombre_negocio", "==", search))
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
                break;
        }
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
            && validateString(clave, {
                required: true,
                minLength: 8,
                maxLength: 10,
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
            }) && imageSrc) {
            try {
                // Se crea el usuario en firebase auth
                const createUser = await createUserWithEmailAndPassword(auth, correo, clave);
                const uid = createUser.user.uid;

                // Se sube la imagen de perfil a firebase storage con el uid del usuario
                const imageStore = ref(storage, `profilePictures/${uid}`);
                await uploadBytes(imageStore, imageFile);
                const url = await getDownloadURL(imageStore);

                // Se crea el objeto con los datos del cliente 
                let ClientData = {
                    nombre_negocio: nombre,
                    correo: correo,
                    direccion: direccion,
                    profileImage: url,
                    telefono: telefono
                }

                // Se crea el objeto con las credenciales del cliente
                let Clientcredentials = {
                    correo: correo,
                    clave: clave
                }

                // Guardar los datos en Firestore
                await addDoc(collection(db, 'clientes'), {
                    Clientcredentials,
                    ClientData,
                    estado: true,
                    uid: uid
                });

                // Se muestra un mensaje de exito y se cierra el modal
                toast.success('Cliente agregada exitosamente');
                setShowModal(false);
                fetchData();
            } catch (error) {
                if (error.code === 'already-exists') {
                    toast.error('Ya existe un cliente con ese nombre.');
                }
            };
        } else {
            toast.error('No se ha podido agregar el cliente.');
        };
    };

    // Funcion que maneja la actualización de datos
    const handleUpdate = async (e) => {
        e.preventDefault();
        // Se validan los campos del form
        if (validateString(nombre, {
            required: true,
            minLength: 2,
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
        })) {
            // Se inicializan la constante de la imagen de perfil
            const image = document.getElementById('file');
            const file = image.files[0];

            // En cacso de haber una imagen subida en el form
            if (file) {
                try {
                    // Subir imagen a Firebase Storage
                    const imageStore = ref(storage, `profilePictures/${uid}`); // Uid del usuario no autenticado
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
                const userDocRef = doc(db, "clientes", docId);
                await updateDoc(userDocRef, {
                    ClientData: {
                        nombre_negocio: nombre,
                        telefono: telefono,
                        direccion: direccion,
                        profileImage: imageSrc
                    },
                });
                // Se muestra un mensaje de éxito al actualizar el usuario y se cierra el modal
                toast.success('Usuario actualizado con éxito.');
                setShowModal(false);
                fetchData();
            } catch (error) {
                toast.error('Error al actualizar el usuario.');
            }
        }
        else {
            toast.error('Ha ocurrido un error al actualizar los datos el cliente.');
        }
    }

    // Funcion para cargar los datos del documento en el form al abrir seleccionar actualizar 
    function LoadUpdate(id) {
        // Obtener la referencia al documento en la colección "clientes" usando el id
        const docRef = doc(db, "clientes", id);
        // Obtener los datos del documento
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Asignar valores a los campos en el modal
                setNombre(data.ClientData?.nombre_negocio || "");
                setClave(data.Clientcredentials?.clave || "");
                setTelefono(data.ClientData?.telefono || "");
                setDireccion(data.ClientData?.direccion || "");
                setImageSrc(data.ClientData?.profileImage || ""); // Si tienes una imagen de perfil almacenada
                setDocId(docSnap.id || "");
                setUid(data.uid || "");
                // Mostrar el modal para actualizar el documento
                handleShow('update');
            }
        }).catch((error) => {
            toast.error("cliente no valido");
        });
    }

    // Funcion que se encarga de cargar los datos del usuario al seleccionar consultarlos
    function LoadData(id) {
        // Obtener la referencia al documento en la colección "administradores" usando el id
        const docRef = doc(db, "clientes", id);

        // Obtener los datos del documento
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Asignar valores a los campos en el modal
                setNombre(data.ClientData?.nombre_negocio || "");
                setClave(data.Clientcredentials?.clave || "");
                setTelefono(data.ClientData?.telefono || "");
                setDireccion(data.ClientData?.direccion || "");
                setImageSrc(data.ClientData?.profileImage || ""); // Si tienes una imagen de perfil almacenada
                setDocId(docSnap.id || "");
                setUid(data.uid || "");
                // Mostrar el modal para actualizar el documento
                handleShow('show');

            }
        }).catch((error) => {
            toast.error("cliente no valido");
        });
    }

    // Funcion para limpiar los campos del formulario
    function clean() {
        if (docId == null) {
            try {
                document.getElementById('nombre').value = "";
                document.getElementById('clave').value = "";
                document.getElementById('correof').value = "";
                document.getElementById('direccion').value = "";
                document.getElementById('telefono').value = "";
                document.getElementById('file').value = "";
                setImageSrc(null);
            } catch (error) {
                toast.error("Ha ocurrido un error al limpiar los campos");
            };
        } else {
            try {
                setNombre("");
                setDireccion("");
                setTelefono("");
                setImageSrc(null);
            } catch (error) {
                toast.error("Ha ocurrido un error al limpiar los campos");
            };
        }

    };

    // Funcion para manejar la eliminación de documentos
    async function hanldeBlock() {
        try {
            const docRef = doc(db, "clientes", docId);
            await updateDoc(docRef, {
                estado: false
            });
            toast.success("El usuario fue inhabilitado exitosamente")
            fetchData();
            setAlert(false)
        } catch {
            toast.error("No fue posible inhabilitar el usuario")
        }

        try {
            // Actualizar el estado de la cuenta
            await auth.updateCurrentUser(uid, { disabled: true });
            toast.success("Cuenta inhabilitada exitosamente.");
        } catch (error) {
            toast.error("No se ha podido inhabilitar la cuanta");
            console.log(error);
        }
    }

    // Funcion para mostrar la alerta
    async function AlertShow(uid, id) {
        setAlert(true)
        setUid(uid);
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
                                    <label>Nombre del negocio</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="password" id="clave" name="clave" onChange={(e) => setClave(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Contraseña</label>
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
                        </div>
                    </div>
                    <div className="section2" style={{ marginRight: "30px" }}>
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
                                    <label>Nombre del negocio</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="telefono" name="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Numero de telefono</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginRight: "30px" }}>
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
                                    <input type="text" id="nombre" name="nombre" disabled={true} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label style={{ marginBottom: "15px" }}>Nombre del negocio</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="mail" id="correof" name="correo" disabled={true} value={direccion} onChange={(e) => setCorreo(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label style={{ marginBottom: "15px" }}>Correo</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="telefono" name="telefono" disabled={true} value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label style={{ marginBottom: "15px" }}>Numero de telefono</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginRight: "30px" }}>
                        <div className="btns">
                            <p>Imagen del negocio</p>
                        </div>
                        <img src={imageSrc} className="imagen"></img>
                        <div className="row" style={{ marginTop: "50px" }}>
                            <div className="col">
                                <div className="input-group">
                                    <label>Direccion</label>
                                    <textarea style={{ maxHeight: "23vh", marginLeft: "10px" }} disabled={true} value={direccion} className="form-control" aria-label="With textarea" id="direccion" name="direccion" onChange={(e) => setDireccion(e.target.value)} required></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            default:
                return;
        }
    }

    // Funcion para ocultar los registros por medio de asignarle un valor de "false" al campo "estado"
    async function HideState(id) {
        const userDocRef = doc(db, "clientes", id);
        await updateDoc(userDocRef, {
            estado: false
        });
        ToggleActive("all")
    }

    // Funcion para hacer visible un registro
    async function ShowState(id) {
        const userDocRef = doc(db, "clientes", id);
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
                    <p>USERS | CLIENTS</p>
                </div>
                <div className="buttonstop">
                    <Button className="stop" data-tooltip="btnprueba" style={filters}>Export  <FaArrowUpRightFromSquare style={{ marginLeft: "3px", marginRight: "3px", marginBottom: "3px" }} /></Button>
                    <Button className="stop" style={filters}>Print <FaPrint style={{ marginRight: "3px", marginLeft: "3px", marginBottom: "3px" }} /></Button>
                    <Button type="button" id="red" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleShow('insert')} style={{ width: "auto", marginLeft: "3px" }}>
                        <FaCirclePlus style={{ marginRight: "5px", marginBottom: "3px" }} />New Client
                    </Button>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal('false')} backdrop="static" size='lg'>
                <Modal.Header style={{ display: "flex", justifyContent: "space-between" }}>
                    <Modal.Title>Manage clients</Modal.Title>
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
                    <input type="text" name="search" placeholder="Serch by business name" style={{ marginLeft: "23px" }} value={search} onChange={(e) => { setSearch(e.target.value); fetchData() }} />
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
                <button className={active ? 'active' : ''} onClick={() => ToggleActive('all')}>All client business</button>
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
                                <th scope="col">Negocio</th>
                                <th scope="col">Phone number</th>
                                <th scope="col">Email</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            {/* Se carga la tabla */}
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.ClientData?.nombre_negocio}</td>
                                    <td>{item.ClientData?.telefono}</td>
                                    <td>{item.ClientData?.correo}</td>
                                    <td style={{ display: "flex", justifyContent: "space-evenly" }}>
                                        <Button variant='outline-success' title='Consultar datos'><FaFileCircleQuestion size={"1.3rem"} onClick={() => LoadData(item.id)} /></Button>
                                        <Button variant='outline-warning' title='Editar'><FaFilePen size={"1.3rem"} onClick={() => LoadUpdate(item.id)} /></Button>
                                        {/*                                         <Button variant='outline-danger' title='Bloquear'><FaUserLock size={"1.3rem"} onClick={() => AlertShow(item.uid, item.id)} /></Button>
 */}                                        <Button variant='outline-secondary' style={TableDefaults ? { display: "none" } : {}} title='Ocultar'><FaEyeSlash size={"1.3rem"} onClick={() => HideState(item.id)} /></Button>
                                        <Button variant='outline-secondary' style={TableDefaults ? {} : { display: "none" }} title='Ocultar'><FaEye size={"1.3rem"} onClick={() => ShowState(item.id)} /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Alert show={alert} variant="danger">
                        <Alert.Heading>Bloquear</Alert.Heading>
                        <p>
                            Desea bloquear a este cliente?
                        </p>
                        <hr />
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => hanldeBlock()} variant="outline-danger">
                                Bloquear
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

export default Client;
