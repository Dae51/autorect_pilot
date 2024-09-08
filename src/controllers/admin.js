// Se importan los estados de react y react
import { useState, useEffect } from 'react';
//Se importan los servicios de firebase storage
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Se importa la conexion con el servidor
import firebaseApp from '../server/server_config';

// Se importan los componentes de react-bootstrap que utilizaremos para el menu y la interfaz
import { Button, Dropdown, Modal, Table } from "react-bootstrap"
// Se importan las notiificaciones 
import toast from "react-hot-toast";
// Se importa la iconografia de la libreria react-icons
import { FaMagnifyingGlass, FaCirclePlus, FaArrowUpRightFromSquare, FaPrint, FaFilePen, FaFileCircleMinus, FaFileCircleQuestion, FaXmark } from "react-icons/fa6"

// Se importa el validator
import { validateString } from "./validator";

// Se importan las hojas de estilo css
import "../style/admin/menu.css"
import "../style/admin/main.css"

// Se inicializan las constantes de los servicios de firebase
const db = getFirestore(firebaseApp);
const storage = getStorage();
const auth = getAuth();

// Funcion principal de la aplicacion
function Admin() {

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
    const [numDocs, setNumDocs] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [modalState, setModalState] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    // Se inicializan las constantes de los datos del usuario
    const [username, setUsernamme] = useState();
    const [nombre, setNombre] = useState();
    const [apellido, setApellido] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [telefono, setTelefono] = useState();
    const [direccion, setDireccion] = useState();
    const [Dui, setDui] = useState();
    const [birthDate, setBirthDate] = useState();
    const [docId, setDocId] = useState();
    const [Uid, setUid] = useState();
    /*     const [imageURL, setImageURL] = useState();
     */

    // Funcion que se encarga de cargar los usuarios para la tabla de contenido
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "administradores"));
                const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setData(docsData);
                setNumDocs(querySnapshot.size);
                if (numDocs < 10) {
                    setNumDocs(`0${querySnapshot.size}`);
                } else {
                    setNumDocs(querySnapshot.size);
                };
            } catch (error) {
                toast.error("No se han podido cargar los datos de la tabla:", error);
            };
        };


        fetchData();
    }, [])

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

    // Funcion que se encarga de mostarr el modal
    const handleShow = (content) => {
        setModalState(content);
        setShowModal('true');
    }

    // Funcion que se encarga de manejar el evento al momento de insertar usuarios 
    async function handleInsert(e) {
        e.preventDefault();
        // Se validan los campos y que haya una imagen subida
        if (validateString(username, {
            required: true,
            minLength: 5,
            maxLength: 15,
            pattern: /^[a-zA-Z0-9]*$/,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(nombre, {
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
        }) && validateString(password, {
            required: true,
            minLength: 8,
            maxLength: 10,
            pattern: null,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(email, {
            required: true,
            minLength: 5,
            maxLength: 50,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(telefono, {
            required: true,
            minLength: 7,
            maxLength: 15,
            pattern: /^\d{4}-[0-9]{4}$/,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(direccion, {
            required: true,
            minLength: 10,
            maxLength: 150,
            pattern: null,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(Dui, {
            required: true,
            minLength: 10,
            maxLength: 10,
            pattern: /^\d{8}-\d$/,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(birthDate, {
            required: true,
            minLength: 10,
            maxLength: 10,
            pattern: null,
            forbiddenChars: null
        }) && imageSrc) {
            try {
                // Se crea el usuario en firebase auth
                const createUser = await createUserWithEmailAndPassword(auth, email, password);
                const uid = createUser.user.uid;

                // Se sube la imagen de perfil a firebase storage con el uid del usuario
                const imageStore = ref(storage, `profilePictures/${uid}`);
                await uploadBytes(imageStore, imageFile);
                const url = await getDownloadURL(imageStore);

                // Se guardan los datos personales del usuario en un objeto anidado
                let adminData = {
                    alias: username,
                    nombre: nombre,
                    apellido: apellido,
                    telefono: telefono,
                    direccion: direccion,
                    dui: Dui,
                    birthDate: birthDate,
                    profileImage: url
                };

                // Se guardan las credenciales de firebase auth en otro objeto anidado
                let adminCredentials = {
                    correo: email,
                    clave: password,
                };

                // Guardar los datos del usuario en Firestore
                await addDoc(collection(db, 'administradores'), {
                    adminData,
                    adminCredentials,
                    uid: uid
                });

                // Se muestra un mensaje de exito y se cierra el modal
                toast.success('Usuario creado exitosamente');
                setShowModal(false);
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    toast.error('El correo ya está en uso.');
                } else if (error.code === 'auth/invalid-email') {
                    toast.error('El correo no es válido.');
                } else if (error.code === 'auth/weak-password') {
                    toast.error('La contraseña es muy débil.');
                }
            };
        } else {
            toast.error('No se ha podido crear el usuario.');
        };
    };

    // Funcion que maneja la actualización de datos
    const handleUpdate = async (e) => {
        e.preventDefault();
        // Se validan los campos del form
        if (validateString(username, {
            required: true,
            minLength: 5,
            maxLength: 15,
            pattern: /^[a-zA-Z0-9]*$/,
            forbiddenChars: "!@#$%^&*()"
        }) && validateString(nombre, {
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
            minLength: 7,
            maxLength: 15,
            pattern: /^\d{4}-[0-9]{4}$/,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(direccion, {
            required: true,
            minLength: 10,
            maxLength: 150,
            pattern: null,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(Dui, {
            required: true,
            minLength: 10,
            maxLength: 10,
            pattern: /^\d{8}-\d$/,
            forbiddenChars: "!#$%^&*()"
        }) && validateString(birthDate, {
            required: true,
            minLength: 10,
            maxLength: 10,
            pattern: null,
            forbiddenChars: null
        })) {
            // Se inicializan la constante de la imagen de perfil
            const image = document.getElementById('file');
            const file = image.files[0];

            // En cacso de haber una imagen subida en el form
            if (file) {
                try {
                    // Subir imagen a Firebase Storage
                    const imageStore = ref(storage, `profilePictures/${Uid}`); // Uid del usuario no autenticado
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
                const userDocRef = doc(db, "administradores", docId);
                await updateDoc(userDocRef, {
                    adminData: {
                        alias: username,
                        nombre: nombre,
                        apellido: apellido,
                        telefono: telefono,
                        direccion: direccion,
                        dui: Dui,
                        birthDate: birthDate,
                        profileImage: imageSrc
                    },
                });
                // Se muestra un mensaje de éxito al actualizar el usuario y se cierra el modal
                toast.success('Usuario actualizado con éxito.');
                setShowModal(false);
            } catch (error) {
                toast.error('Error al actualizar el usuario.');
            }
        }
        else {
            toast.error('Ha ocurrido un error al actualizar el usuario.');
        }
    }

    // Funcion para cargar los datos del usuario en el form al abrir seleccionar actualizar un usuario
    function LoadUpdate(id) {
        // Obtener la referencia al documento en la colección "administradores" usando el id
        const docRef = doc(db, "administradores", id);
        // Obtener los datos del documento
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Asignar valores a los campos en el modal
                setUsernamme(data.adminData?.alias || "");
                setNombre(data.adminData?.nombre || "");
                setApellido(data.adminData?.apellido || "");
                setPassword(data.adminCredentials?.clave || "");
                setEmail(data.adminCredentials?.correo || "");
                setDui(data.adminData?.dui || "");
                setTelefono(data.adminData?.telefono || "");
                setBirthDate(data.adminData?.birthDate || "");
                setDireccion(data.adminData?.direccion || "");
                setImageSrc(data.adminData?.profileImage || ""); // Si tienes una imagen de perfil almacenada
                setDocId(docSnap.id || "");
                setUid(data.uid || "");
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
        const docRef = doc(db, "administradores", id);

        // Obtener los datos del documento
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Asignar valores a los campos en el modal
                setUsernamme(data.adminData?.alias || "");
                setNombre(data.adminData?.nombre || "");
                setApellido(data.adminData?.apellido || "");
                setPassword(data.adminCredentials?.clave || "");
                setEmail(data.adminCredentials?.correo || "");
                setDui(data.adminData?.dui || "");
                setTelefono(data.adminData?.telefono || "");
                setBirthDate(data.adminData?.birthDate || "");
                setDireccion(data.adminData?.direccion || "");
                setImageSrc(data.adminData?.profileImage || ""); // Si tienes una imagen de perfil almacenada
                setDocId(docSnap.id || "");
                setUid(data.uid || "");
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
                document.getElementById('alias').value = "";
                document.getElementById('nombre').value = "";
                document.getElementById('apellido').value = "";
                document.getElementById('clave').value = "";
                document.getElementById('correof').value = "";
                document.getElementById('dui').value = "";
                document.getElementById('telefono').value = "";
                document.getElementById('fecha').value = "";
                document.getElementById('direccion').value = "";
                document.getElementById('file').value = "";
                setImageSrc(null);
            } catch (error) {
                toast.error("Ha ocurrido un error al limpiar los campos");
            };
        } else {
            try {
                document.getElementById('alias').value = "";
                document.getElementById('nombre').value = "";
                document.getElementById('apellido').value = "";
                document.getElementById('dui').value = "";
                document.getElementById('telefono').value = "";
                document.getElementById('fecha').value = "";
                document.getElementById('direccion').value = "";
                document.getElementById('file').value = "";
            } catch (error) {
                toast.error("Ha ocurrido un error al limpiar los campos");
            };
        }

    };

    /*   async function handleDelete(id) {
          try {
              // Obtener la referencia al documento en la colección "administradores"
              const docRef = doc(db, "administradores", id);
  
              // Obtener los datos del documento
              const docSnap = await getDoc(docRef);
  
              if (docSnap.exists()) {
                  const data = docSnap.data();
                  const userUid = data.uid || "";
                  const imagePath = data.adminData?.profileImage || "";
  
                  // Eliminar el usuario de Firebase Authentication
  
                  // Eliminar la imagen de Firebase Storage
                  if (imagePath) {
                      const imageRef = ref(storage, imagePath);
                      await deleteObject(imageRef);
                  }
                  else {
                      toast.error('no se ha podido eliminar la imagen')
                  }
  
                  // Eliminar el documento en Firestore
                  await deleteDoc(docRef);
                  toast.success('Usuario eliminado con éxito.');
              } else {
                  toast.error('El usuario que se esta tratando de eliminar no existe');
              }
          } catch (error) {
              toast.error("Ha ocurrido un error al eliminar el usuario");
              console.log(error);
          }
      } */

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
                                    <input type="text" id="alias" name="alias" onChange={(e) => setUsernamme(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Nombre de usuario</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="nombre" name="nombre" onChange={(e) => setNombre(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Nombre</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="apellido" name="apellido" onChange={(e) => setApellido(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Apellido</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="password" id="clave" name="clave" onChange={(e) => setPassword(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Contraseña</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="mail" id="correof" name="correo" onChange={(e) => setEmail(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Correo</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="dui" name="dui" onChange={(e) => setDui(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>DUI</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="telefono" name="telefono" onChange={(e) => setTelefono(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Numero de telefono</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="date" name="fecha_nacimiento" onChange={(e) => setBirthDate(e.target.value)} id="fecha" min="2006-01=01" />
                                    <div className="underline"></div>
                                    <label>Fecha de nacimiento</label>
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
                                    <input type="text" id="alias" name="alias" value={username} onChange={(e) => setUsernamme(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Nombre de usuario</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Nombre</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="apellido" name="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>Apellido</label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="text" id="dui" name="dui" value={Dui} onChange={(e) => setDui(e.target.value)} required />
                                    <div className="underline"></div>
                                    <label>DUI</label>
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
                                <div className="input-data">
                                    <input type="date" name="fecha_nacimiento" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} id="fecha" min="2006-01=01" />
                                    <div className="underline"></div>
                                    <label>Fecha de nacimiento</label>
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

            // Se carga el contenido del caso "delete"
            case 'show':
                return <div style={{ display: "flex" }} >
                    <div className="section1">
                        <div className="row">
                            <div className="col">
                                <div className="input-data">
                                    <label style={{ marginBottom: "15px" }}>Nombre de usuario:</label>
                                    <input type="text" id="alias" disabled={"true"} name="alias" value={username} required />
                                    <div className="underline"></div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <label style={{ marginBottom: "15px" }}>Nombre:</label>
                                    <input type="text" id="nombre" disabled={"true"} name="nombre" value={nombre} required />
                                    <div className="underline"></div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <label style={{ marginBottom: "15px" }}>Apellido:</label>
                                    <input type="text" id="apellido" disabled={"true"} name="apellido" value={apellido} required />
                                    <div className="underline"></div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <label style={{ marginBottom: "15px" }}>DUI:</label>
                                    <input type="text" id="dui" disabled={"true"} name="dui" value={Dui} required />
                                    <div className="underline"></div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <label style={{ marginBottom: "15px" }}>Numero de telefono:</label>
                                    <input type="text" id="telefono" disabled={"true"} name="telefono" value={telefono} required />
                                    <div className="underline"></div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-data">
                                    <input type="date" name="fecha_nacimiento" disabled={"true"} value={birthDate} id="fecha" min="2006-01=01" />
                                    <div className="underline"></div>
                                    <label style={{ marginBottom: "15px" }}>Fecha de nacimiento:</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section2" style={{ marginRight: "30px" }}>
                        <div className="btns">
                            <p>Imagen de usuario</p>
                        </div>
                        <img src={imageSrc} className="imagen"></img>
                        <div className="row" style={{ marginTop: "50px" }}>
                            <div className="col">
                                <div className="input-group">
                                    <label>Direccion</label>
                                    <textarea style={{ maxHeight: "10vh", marginLeft: "10px" }} disabled={'true'} value={direccion} className="form-control" aria-label="With textarea" id="direccion" name="direccion" required></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>;
            default:
                return;
        }
    }

    // Se muestra el contenido del CRUD administradores
    return (
        <div>
            <div className="topmain" style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="text">
                    <p>USERS | ADMINS</p>
                </div>
                <div className="buttonstop">
                    <Button className="stop" data-tooltip="btnprueba" style={filters}>Export  <FaArrowUpRightFromSquare style={{ marginLeft: "3px", marginRight: "3px", marginBottom: "3px" }} /></Button>
                    <Button className="stop" style={filters}>Print <FaPrint style={{ marginRight: "3px", marginLeft: "3px", marginBottom: "3px" }} /></Button>
                    <Button type="button" id="red" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleShow('insert')} style={{ width: "auto", marginLeft: "3px" }}>
                        <FaCirclePlus style={{ marginRight: "5px", marginBottom: "3px" }} />New User
                    </Button>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal('false')} backdrop="static" size='lg'>
                <Modal.Header style={{ display: "flex", justifyContent: "space-between" }}>
                    <Modal.Title>Manage admin's</Modal.Title>
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
                    <input type="text" name="search" placeholder="Username..." style={{ marginLeft: "23px" }} />
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
                <button className="active">All users <span>{numDocs}</span></button>
                <button>Disabled users <span>03</span></button>
            </div>
            <div className="datatable">
                <div className="infodatatable">
                    <p>Showing 21-30 of {numDocs} results</p>
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
                                <th scope="col">Mail</th>
                                <th scope="col">Password</th>
                                <th scope="col">UID</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                            {/* Se carga la tabla */}
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.adminCredentials?.correo}</td>
                                    <td>
                                        {'•'.repeat(item.adminCredentials?.clave.length)}
                                    </td>
                                    <td>{item.uid}</td>
                                    <td style={{ display: "flex", justifyContent: "space-evenly" }}>
                                        <Button variant='outline-warning' title='Editar usuario'><FaFilePen size={"1.3rem"} onClick={() => LoadUpdate(item.id)} /></Button>
                                        {/*                                         <Button variant='outline-danger' title='Eliminar usuario'><FaFileCircleMinus size={"1.3rem"} onClick={() => handleDelete(item.id)} /></Button>
 */}                                        <Button variant='outline-success' title='Consultar datos'><FaFileCircleQuestion size={"1.3rem"} onClick={() => LoadData(item.id)} /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default Admin;